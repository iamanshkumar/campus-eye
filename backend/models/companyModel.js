import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name : {
        type: String, 
        required : true,
        unique : true,
    } ,
    logo : {
        type : String
    },
    offeredPackage : {
        type : Number,
        required : true
    },
    location : [{
        type : String , 
        required : true
    }],
    description : {
        type : String,
        required : true
    },
    visitingDate : {
        type : Date,
        required : true
    },
    status : {
        type: String,
        enum: ['upcoming', 'visited', 'cancelled'],
        default: 'upcoming'
    },
    devStack : [{
        type : String,
        required : true
    }],
    eligibility : {
        type : Number,
        required : true
    }
});

const Company = mongoose.model("Company" , companySchema);

export default Company;