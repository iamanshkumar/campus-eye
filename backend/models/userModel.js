import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },

    profilePic : {
        type : String
    },

    username : {
        type : String,
        unique : true,
        required : true
    },
    
    email : {
        type : String,
        unique : true,
        required : true
    },

    password : {
        type : String , 
        required : true
    },

    cgpa : {
        type : Number,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    year : {
        type : Number,
        required : true
    },
    role : {
        type : String,
        enum : ['student' , 'admin'],
        default : 'student'
    },
    prepChecklist: {
        arrays: { type: Boolean, default: false },
        strings: { type: Boolean, default: false },
        twoPointers: { type: Boolean, default: false },
        slidingWindow: { type: Boolean, default: false },
        binarySearch: { type: Boolean, default: false },
        dynamicProgramming: { type: Boolean, default: false },
        graphs: { type: Boolean, default: false },
        trees: { type: Boolean, default: false },
        oop: { type: Boolean, default: false },
        os: { type: Boolean, default: false },
        dbms: { type: Boolean, default: false },
        computerNetworks: { type: Boolean, default: false },
        systemDesign: { type: Boolean, default: false },
        aptitude: { type: Boolean, default: false },
        sql: { type: Boolean, default: false }
    }
})

const User = mongoose.model("User" , userSchema);

export default User;