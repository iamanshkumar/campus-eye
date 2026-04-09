import Company from "../models/companyModel.js"
import UserCompanyStatus from "../models/userCompanyStatusModel.js";

export const targetCompany = async(req , res)=>{
    const {company : companyId , notes} = req.body;
    try{
        const user = req.user._id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company not found"
            })
        }

        const userCompanyStatus = new UserCompanyStatus({
            user,
            company : companyId,
            notes : notes===null ? '' : notes,
        })

        await userCompanyStatus.save();
        return res.status(201).json({
            success : true,
            message : "Company added successfully",
            data : userCompanyStatus
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Targeting company error : ${err}`
        })
    }
}

export const getAllTragetingCompanies = async(req , res)=>{
    try{
        const user = req.user._id;
        const companies = await UserCompanyStatus.find({user : user}).populate('company', 'name logo');
        return res.status(200).json({
            success : true,
            message : "Companies fetched successfully",
            data : companies
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching companies status error : ${err}`
        })
    }
}

export const updateCompanyStatus = async(req,res)=>{
    const {status} = req.body;
    const {companyId} = req.params;
    try{
        const userStatus = await UserCompanyStatus.findOne({company : companyId , user : req.user._id});

        if(!userStatus){
            return res.status(404).json({
                success : false,
                message : "User have not targeted this company yet"
            })
        }

        const company = userStatus.company;
        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company not found"
            })
        }

        const validStatuses = ['targeting', 'applied', 'interviewed', 'selected', 'rejected'];
        if(!status || !validStatuses.includes(status)){
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            })
        }

        userStatus.status = status;

        await userStatus.save();

        return res.status(200).json({
            success : true,
            message : "Status updated successfully",
            data : userStatus
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Updating user company status error : ${err}`
        })
    }
}

export const removeCompanyStatus = async(req , res)=>{
    const {companyId} = req.params;
    try{
        const userStatus = await UserCompanyStatus.findOne({company : companyId , user : req.user._id});

        if(!userStatus){
            return res.status(404).json({
                success : false,
                message : "User have not targeted this company yet"
            })
        }

        const company = userStatus.company;
        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company not found"
            })
        }

        const userStatusId = userStatus._id;
        await UserCompanyStatus.findByIdAndDelete(userStatusId);
        return res.status(200).json({
            success : true,
            message : "User company status removed successfully",
            data : userStatus
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `User company status removing error : ${err}`
        })
    }
}