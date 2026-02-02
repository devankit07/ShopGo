export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if(!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({ message: "All fields are required" });   
        }

        // //handle mulltiple img
        // let productImage = []; 
        // if(req.files && req.files.length > 0) {
        //     for (let files of req.files) {
        //        const fileUri = 
        //     }
        // }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}
    
