import getDataUri from "../utils/dataUri.js";
import Cloudinary from "../utils/cloudinary.js";
import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import { logAction } from "../utils/adminLog.js";

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand, size } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //handle mulltiple img
    let productImage = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await Cloudinary.uploader.upload(fileUri, {
          folder: "products", //cloudinary folder name
        });
        productImage.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //create a product in db
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      size: size || undefined,
      productImage, //array of objects [{url,punlic_id}]
    });
    if (req.id) await logAction(req.id, "Product added", productName, "product", newProduct._id);
    return res.status(200).json({
      scuccess: true,
      message: "product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Distinct category values from products (for admin + storefront filters). */
export const getProductCategories = async (req, res) => {
  try {
    const raw = await Product.distinct("category", {
      category: { $nin: [null, ""] },
    });
    const cleaned = raw
      .map((c) => String(c).trim())
      .filter(Boolean);
    const seen = new Set();
    const unique = [];
    for (const c of cleaned) {
      const key = c.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(c);
    }
    unique.sort((a, b) => a.localeCompare(b));
    return res.status(200).json({ success: true, categories: unique });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getallproduct = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const category = (req.query.category || "").trim();
    const search = (req.query.search || req.query.q || "").trim();
    const minPriceRaw = req.query.minPrice;
    const maxPriceRaw = req.query.maxPrice;
    const minPrice =
      minPriceRaw !== undefined && minPriceRaw !== ""
        ? Number(minPriceRaw)
        : null;
    const maxPrice =
      maxPriceRaw !== undefined && maxPriceRaw !== ""
        ? Number(maxPriceRaw)
        : null;
    const sortParam = (req.query.sort || "newest").toLowerCase();
    const brand = (req.query.brand || "").trim();
    const size = (req.query.size || "").trim();

    const filter = {};
    if (category && category.toLowerCase() !== "all") {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { productName: rx },
        { productDesc: rx },
        { brand: rx },
        { category: rx },
      ];
    }

    if (brand) {
      filter.brand = new RegExp(`^${escapeRegex(brand)}$`, "i");
    }

    if (size) {
      filter.size = new RegExp(`^${escapeRegex(size)}$`, "i");
    }

    const priceCond = {};
    if (minPrice != null && !Number.isNaN(minPrice) && minPrice >= 0) {
      priceCond.$gte = minPrice;
    }
    if (maxPrice != null && !Number.isNaN(maxPrice) && maxPrice >= 0) {
      priceCond.$lte = maxPrice;
    }
    if (Object.keys(priceCond).length) {
      filter.productPrice = priceCond;
    }

    let sortObj = { createdAt: -1 };
    if (sortParam === "price_asc" || sortParam === "low") {
      sortObj = { productPrice: 1, createdAt: -1 };
    } else if (sortParam === "price_desc" || sortParam === "high") {
      sortObj = { productPrice: -1, createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const product = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      product,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(404).json({
        scuccess: false,
        message: "product not found",
      });
    }
    //delete product from cloudinary
    if (product.productImage && product.productImage.length > 0) {
      for (let img of product.productImage) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
    //delet product from mongodb
    await Product.findByIdAndDelete(productid);
    if (req.id) await logAction(req.id, "Product deleted", product.productName, "product", productid);
    return res.status(200).json({
      scuccess: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      scuccess: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const product = await Product.findById(productid);
    if (!product) {
      return res.status(400).json({
        scuccess: false,
        message: "product not found",
      });
    }
    let UpdateImage = [];

    //keep current existing image
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      UpdateImage = product.productImage.filter((img) =>
        keepIds.includes(img.public_id),
      );

      //dlete only removed images from cloudinary
      const removeImages = product.productImage.filter(
        (img) => !keepIds.includes(img.public_id),
      );
      for (let img of removeImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      //keep all if nothing sent
      UpdateImage = product.productImage;
    }

    //handle new uploaded images
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await Cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", //cloudinary folder name
        });
        UpdateImage.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //update product
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    if (size !== undefined) product.size = size || undefined;
    product.productImage = UpdateImage;
    await product.save();
    if (req.id) await logAction(req.id, "Product updated", product.productName, "product", productid);
    return res.status(200).json({
      scuccess: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      scuccess: false,
      message: error.message,
    });
  }
};
