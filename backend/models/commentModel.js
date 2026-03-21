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
    upvotes : {
        type : Number,
        default : 0
    },
    downvotes : {
        type : Number,
        default : 0
    },
    replies : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }]
},{
    timestamps : true
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;