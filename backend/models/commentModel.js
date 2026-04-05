import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    experience : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Experience",
        required : true
    },
    description : {
        type : String , 
        required : true,
    },
    upvotes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    replies : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    parentComment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment",
        default : null
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;