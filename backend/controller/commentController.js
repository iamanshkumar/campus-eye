import Comment from "../models/commentModel.js";
import Experience from "../models/experienceModel.js";
import User from "../models/userModel.js";

export const addComment = async(req , res)=>{
    const {experienceId , description , parentCommentId} = req.body;
    const userId = req.user._id;
    try{
        if(!experienceId){
            return res.status(400).json({
                success : false,
                message : "Experience not found"
            })
        }

        if(!description){
            return res.status(400).json({
                success : false,
                message : "Missing comment"
            })
        }

        if(description.trim().length===0){
            return res.json.status(400).json({
                success : false,
                message : "Comment cannot be empty"
            })
        }

        const experiencePost = await Experience.findById(experienceId);
        if(!experiencePost){
            return res.status(404).json({
                success : false,
                message : 'Experience not found'
            })
        }

        const comment = new Comment({
            experience: experienceId,
            description,
            user: userId,
            parentComment: parentCommentId || null
        })

        await comment.save();
        experiencePost.comments.push(comment._id);
        await experiencePost.save();

        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId);
            if(parent){
                parent.replies.push(comment._id);
                await parent.save();
            }
        }

        return res.status(201).json({
            success : true,
            message : "Comment added successfully",
            data : comment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Adding comment error : ${err}`
        })
    }
}

export const getComments = async(req, res)=>{
    const {experienceId} = req.params;
    try{
        const comments = await Comment.find({experience : experienceId}).populate("user" , "fullName username")

        return res.status(200).json({
            success : true,
            message : "Comments fetched successfully",
            data : comments
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching comments error : ${err}`
        })
    }
}


export const deleteComment = async(req,res)=>{
    const {commentId} = req.params;
    try{
        const comment = await Comment.findById(commentId).populate("experience");
        if(!comment){
            return res.status(404).json({
                success : false,
                message : "Comment not found"
            })
        }

        const commentOwnerId = comment.user;
        const userId = req.user._id;
        const user = await User.findById(userId);
        const postOwnerId = comment.experience.user;

        if(commentOwnerId.toString()!==userId.toString() && postOwnerId.toString()!==userId.toString() && user.role!=="admin"){
            return res.status(403).json({
                success : false,
                message : "You are not authorised to delete the comment"
            })
        }

        const experienceId = comment.experience._id;
        await Comment.findByIdAndDelete(commentId);

        if(comment.parentComment){
            const parentComment = await Comment.findById(comment.parentComment);
            if(parentComment){
                parentComment.replies = parentComment.replies.filter(
                    r => r.toString() !== commentId.toString()
                );
                await parentComment.save();
            }
        }
        
        const experience = await Experience.findById(experienceId);
        experience.comments = experience.comments.filter(
            c => c.toString() !== commentId.toString()
        );
        await experience.save();

        return res.status(200).json({
            success : true,
            message : "Comment deleted successfully",
            data : comment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Deleting comment error : ${err}`
        })
    }
}

export const upvoteComment = async(req,res)=>{
    const {id} = req.params;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({
                success : false,
                message : "Comment not found"
            })
        }
    
        const updatedComment = await Comment.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true });
    
        return res.status(200).json({
            success : true,
            message : "Comment upvoted successfully",
            data : updatedComment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in upvoting experience ${err}`
        })
    }
}

export const downvoteComment = async(req,res)=>{
    const {id} = req.params;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({
                success : false,
                message : "Comment not found"
            })
        }
    
        const updatedComment = await Comment.findByIdAndUpdate(id, { $inc: { downvotes: 1 } }, { new: true });
    
        return res.status(200).json({
            success : true,
            message : "Comment upvoted successfully",
            data : updatedComment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in upvoting experience ${err}`
        })
    }
}