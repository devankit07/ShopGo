import mongoose from "mongoose";

const connectDB =async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/Shop-Go`)
        console.log("Mongodb connected succesfully")
    } catch (error) {
        console.log("Mongodb connection failed:",error)
    }
}

export default connectDB