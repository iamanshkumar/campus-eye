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
            return res.status(400).json({
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

        await comment.populate("user" , "fullName");

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
        const allComments = await Comment.find({experience : experienceId}).populate("user" , "fullName username").sort({createdAt : 1}).lean();
        const commentMap = {}
        const topLevelComments = [];

        allComments.forEach(comment=>{
            comment.replies = [];
            commentMap[comment._id.toString()]=comment;
        })

        allComments.forEach(comment=>{
            if(comment.parentComment){
                const parent = commentMap[comment.parentComment.toString()];
                if(parent){
                    parent.replies.push(comment);
                }
            }else{
                topLevelComments.push(comment);
            }
        })

        return res.status(200).json({
            success : true,
            message : "Comments fetched successfully",
            data : topLevelComments
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching comments error : ${err.message}`
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
    const userId = req.user._id;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({
                success : false,
                message : "Comment not found"
            })
        }

        const hasUpvoted = comment.upvotes.includes(userId);
        const hasDownvoted = comment.downvotes.includes(userId);

        if(hasUpvoted){
            comment.upvotes.pull(userId);
        }else{
            comment.upvotes.push(userId);
            if (hasDownvoted) comment.downvotes.pull(userId);
        }
    
        await comment.save();
    
        return res.status(200).json({
            success : true,
            message : "Comment upvote toggled successfully",
            data : comment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in upvoting comment ${err}`
        })
    }
}

export const downvoteComment = async(req,res)=>{
    const {id} = req.params;
    const userId = req.user._id;
    try{
        const comment = await Comment.findById(id);
        if(!comment){
            return res.status(404).json({
                success : false,
                message : "Comment not found"
            })
        }

        const hasUpvoted = comment.upvotes.includes(userId);
        const hasDownvoted = comment.downvotes.includes(userId);

        if (hasDownvoted) {
            comment.downvotes.pull(userId);
        } else {
            comment.downvotes.push(userId);
            if (hasUpvoted) comment.upvotes.pull(userId);
        }

        await comment.save();
    
        return res.status(200).json({
            success : true,
            message : "Comment downvote toggled successfully",
            data : comment
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in downvoting comment ${err}`
        })
    }
}