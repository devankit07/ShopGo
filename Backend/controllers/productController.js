import getDataUri from "../utils/dataUri.js";
import Cloudinary from "../utils/cloudinary.js";
import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;

    if (!productName || !productDesc || !productPrice || !category || !brand) {
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
      productImage, //array of objects [{url,punlic_id}]
    });
    return res.status(200).json({
      scuccess: true,
      message: "product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getallproduct = async (_, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      res.status(400).json({
        scuccess: false,
        message: "product not found",
        product: [],
      });
    }
    return res.status(200).json({
      scuccess: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      scuccess: false,
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
    product.productImage = UpdateImage;
    await product.save();
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
