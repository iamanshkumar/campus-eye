import Experience from "../models/experienceModel.js";
import Company from "../models/companyModel.js";
import Notification from "../models/notificationModel.js";

export const addExpereience = async(req , res)=>{
    const {description , company, unlistedCompanyName, unlistedCompanyDetails} = req.body;
    const userId = req.user._id;
    try{
        if(!description){
            return res.status(400).json({
                success : false,
                message : "Description is required"
            })
        }

        const isUnlisted = !company && unlistedCompanyName;

        if (isUnlisted) {
            if (!unlistedCompanyDetails || !unlistedCompanyDetails.offeredPackage || !unlistedCompanyDetails.eligibility || !unlistedCompanyDetails.location || !unlistedCompanyDetails.devStack) {
                return res.status(400).json({
                    success: false,
                    message: "Company details (package, eligibility, locations, dev stack) are required for unlisted companies."
                });
            }
        }

        const experience = new Experience({
            description , 
            company : isUnlisted ? null : company,
            unlistedCompanyName: isUnlisted ? unlistedCompanyName : undefined,
            unlistedCompanyDetails: isUnlisted ? unlistedCompanyDetails : undefined,
            status: isUnlisted ? 'pending' : 'approved',
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
        const filter = { status: 'approved' }

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

export const getExperiencesByStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        
        const { status } = req.query;
        const filter = status ? { status } : { status: { $ne: 'approved' } };

        const experiences = await Experience.find(filter)
            .populate('user', "fullName username")
            .populate('company', 'name logo')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Experiences fetched successfully",
            data: experiences
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
};

export const approveExperience = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { id } = req.params;
        const { name, offeredPackage, location, description, visitingDate, status: companyStatus, devStack, eligibility } = req.body;

        const experience = await Experience.findById(id);
        if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

        if (experience.status === 'approved') {
            return res.status(400).json({ success: false, message: 'Already approved' });
        }

        let companyLogo = "";
        if (req.file) {
            companyLogo = req.file.path;
        }

        const company = new Company({
            name,
            logo: companyLogo,
            offeredPackage,
            location,
            description,
            visitingDate,
            status: companyStatus || 'visited',
            devStack,
            eligibility
        });

        await company.save();

        experience.company = company._id;
        experience.status = 'approved';
        await experience.save();

        await Notification.create({
            user: experience.user,
            message: `Your interview experience for ${experience.unlistedCompanyName} has been approved and the company is now listed!`,
            type: 'success'
        });

        return res.status(200).json({ success: true, message: 'Experience approved and company added', data: experience });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
};

export const rejectExperience = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { id } = req.params;
        const experience = await Experience.findById(id);
        if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

        experience.status = 'rejected';
        await experience.save();

        await Notification.create({
            user: experience.user,
            message: `Your interview experience for ${experience.unlistedCompanyName || 'the unlisted company'} has been rejected.`,
            type: 'error'
        });

        return res.status(200).json({ success: true, message: 'Experience rejected', data: experience });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Error: ${err.message}` });
    }
};