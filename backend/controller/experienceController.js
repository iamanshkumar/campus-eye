import Experience from "../models/experienceModel.js"

export const addExpereience = async(req , res)=>{
    const {description , company} = req.body;
    const userId = req.user._id;
    try{
        if(!description){
            return res.status(400).json({
                success : false,
                message : "Description is required"
            })
        }


        const experience = new Experience({
            description , 
            company : company===null ? null : company,
            user : userId
        })

        await experience.save();

        return res.status(201).json({
            success : true,
            message : "Experience added successfully",
            data : experience
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Adding experience error : ${err}`
        })
    }
}

export const getAllExperience = async(req,res)=>{
    try{
        const filter = {}

        if(req.query.company){
            filter.company = req.query.company;
        }

        const experiences = await Experience.find(filter).populate('user' , "fullName username").populate('company','name logo').populate('comments');

        return res.status(200).json({
            success : true,
            message : "All experiences fetched successfully",
            count : experiences.length,
            data : experiences
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching experiences error : ${err}`
        })
    }
}


export const getExperience = async(req,res)=>{
    const {id} = req.params;
    try{
        const experience = await Experience.findById(id);
        if(!experience){
            return res.status(404).json({
                success : false,
                message : "Experience not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Experience fetched successfully",
            data : experience
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching experience error : ${err}`
        })
    }
}

export const deleteExperience = async(req,res)=>{
    const {id} = req.params;
    try{
        const experience = await Experience.findById(id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        const ownerId = experience.user.toString();
        const currentUserId = req.user._id.toString();
        const currentUserRole = req.user.role;

        const isOwner = currentUserId === ownerId;
        const isAdmin = currentUserRole === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only the owner or an admin can delete this experience.'
            });
        }

        await Experience.findByIdAndDelete(id);

        return res.status(200).json({
            success : true,
            message : "Experience deleted successfully",
            data : experience
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Experience deletion error : ${err}`
        })
    }
}

export const upvoteExperience = async(req,res)=>{
    const {id} = req.params;
    const userId = req.user._id;
    try{
        const experience = await Experience.findById(id);
        if(!experience){
            return res.status(404).json({
                success : false,
                message : "Experience not found"
            })
        }

        const hasUpvoted = experience.upvotes.includes(userId);
        const hasDownvoted = experience.downvotes.includes(userId);

        if(hasUpvoted){
            experience.upvotes.pull(userId);
        } else {
            experience.upvotes.push(userId);
            if(hasDownvoted) experience.downvotes.pull(userId);
        }

        await experience.save();

        return res.status(200).json({
            success : true,
            message : "Experience upvoted successfully",
            data : experience
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in upvoting experience ${err}`
        })
    }
}

export const downvoteExperience = async(req,res)=>{
    const {id} = req.params;
    const userId = req.user._id;
    try{
        const experience = await Experience.findById(id);
        if(!experience){
            return res.status(404).json({
                success : false,
                message : "Experience not found"
            })
        }

        const hasUpvoted = experience.upvotes.includes(userId);
        const hasDownvoted = experience.downvotes.includes(userId);

        if(hasDownvoted){
            experience.downvotes.pull(userId);
        } else {
            experience.downvotes.push(userId);
            if(hasUpvoted) experience.upvotes.pull(userId);
        }

        await experience.save();
        return res.status(200).json({
            success : true,
            message : "Experience downvoted successfully",
            data : experience
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Error in downvoting experience ${err}`
        })
    }
}

export const getMyExperiences = async (req, res) => {
    try {
        const userId = req.user._id;

        const experiences = await Experience.find({ user: userId })
            .populate('user', 'fullName username profilePic role')
            .populate('company', 'name logo')
            .sort({ createdAt: -1 }); 

        return res.status(200).json({
            success: true,
            message: "Your experiences fetched successfully",
            count: experiences.length,
            data: experiences
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Fetching your experiences error: ${err.message}`
        });
    }
};