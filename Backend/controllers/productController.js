import getDataUri from "../utils/dataUri";
import Cloudinary from "../utils/Cloudinary";
import Product from "../models/productModel";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if(!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({ message: "All fields are required" });   
        }

        // //handle mulltiple img
        let productImage = []; 
        if(req.files && req.files.length > 0) {
            for (let file of req.files) {
               const fileUri = getDataUri(file)
               const result = await Cloudinary.uploader.upload(fileUri,{
                folder: "products" //cloudinary folder name
               })
               productImage.push({url: result.secure_url, public_id: result.public_id});
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
            productImage //array of objects [{url,punlic_id}]
        })
        return res.status(200).json({
            scuccess:true,
            message:"product added successfully",
            product:newProduct
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}

export const getallproduct = async (_, res)=>{
    try {
        const product = await Product.find()
        //yha se continue
    } catch (error) {
        return res.status(500).json({
            scuccess:false,
            message:error.message
        })
    }
} 
    
