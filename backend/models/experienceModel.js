import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    description : {
        type : String , 
        required : true,
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company"
    },
    upvotes : {
        type : Number,
        default : 0
    },
    downvotes : {
        type : Number,
        default : 0
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }]
},
{timestamps : true}
);

const Experience = mongoose.model("Experience" , experienceSchema);

export default Experience;