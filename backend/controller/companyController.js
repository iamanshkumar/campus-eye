import Company from "../models/companyModel.js";

export const addCompany = async(req , res)=>{
    const {name , offeredPackage , location , description , visitingDate , status , devStack , eligibility } = req.body;
    if(!name || !offeredPackage || !location || location.length===0 || !description || !visitingDate || !status || !devStack || devStack.length===0 || !eligibility){
        return res.status(400).json({
            success : false,
            message : "Missing Details"
        });
    }

    let logo = "";
    if (req.file) {
        logo = req.file.path; 
    }

    try{
        const existingCompany = await Company.findOne({name : name}) ;
        if(existingCompany){
            return res.status(409).json({
                success : false,
                message : "Company already exists"
            })
        }

        const company = new Company({
            name , 
            logo,
            offeredPackage,
            location,
            description,
            visitingDate,
            status,
            devStack,
            eligibility
        })

        await company.save();

        return res.status(201).json({
            success : true,
            message : "Company added successfully"
        })
        

    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Adding company error : ${err}`
        })
    }
}

export const getAllCompanies = async(req,res)=>{
    try{
        const filter ={};

        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }
        
        if(req.query.status){
            filter.status = req.query.status;
        }

        if (req.query.minPackage) {
            filter.offeredPackage = {
                ...filter.offeredPackage,
                $gte: Number(req.query.minPackage)
            };
        }

        if (req.query.eligibility) {
            filter.eligibility = {
                ...filter.eligibility,
                $lte: Number(req.query.eligibility)
            };
        }

        if (req.query.devStack) {
            const terms = req.query.devStack.split(",").map(t => t.trim()).filter(Boolean);
            filter.devStack = {
                $elemMatch: { $in: terms.map(t => new RegExp(t, 'i')) }
            };
        }

        const companies = await Company.find(filter);

        return res.status(200).json({
            success : true,
            message : "Companies fetched successfully",
            count: companies.length,
            data : companies
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching companies error : ${err}`
        })
    }
}

export const getCompany = async(req , res)=>{
    const {id} = req.params;
    try{
        const company = await Company.findById(id);
        if(!company){
            return res.status(404).json({
                success : false,
                message : "Company with entered ID doesn't exists"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Company fetched successfully",
            data : company
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Fetching company error : ${err}`
        })
    }
}

export const updateCompany = async(req , res)=>{
    try{
        const {id} = req.params;
        const allowedFields = [
            "name",
            "offeredPackage",
            "location",
            "description",
            "visitingDate",
            "status",
            "devStack",
            "eligibility"
        ]

        const updatedData = {};

        allowedFields.forEach(field=>{
            if(req.body[field]!==undefined){
                updatedData[field] = req.body[field];
            }
        })

        if (req.file) {
            updatedData.logo = req.file.path;
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,
                runValidators: true 
            }
        );

        if (!updatedCompany) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            message : "Company updated successfully",
            data: updatedCompany
        });
    }catch(err){
        return res.status(500).json({
            success : false,
            message : `Company updating error : ${err}`
        })
    }
}