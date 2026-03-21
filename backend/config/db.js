import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        const dbURL = process.env.MONGO_URI;
        await mongoose.connect(dbURL);
        console.log("MongoDB connected successfully");
    }catch(err){
        console.log("MongoDB connection error : " , err);
    }
}

export default connectDB;