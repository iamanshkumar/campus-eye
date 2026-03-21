import mongoose from "mongoose";

const userCompanyStatusSchema = new mongoose.Schema({
    user:  {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    status: {
        type: String,
        enum: ['targeting', 'applied', 'interviewed', 'selected', 'rejected'],
        default: 'targeting'
    },
    notes: {
        type: String,
        default: ''
    },
    reminderDate: {
        type: Date
    }
},{ timestamps: true });

userCompanyStatusSchema.index({user : 1 , company : 1} , {unique : true})

const UserCompanyStatus = mongoose.model("UserCompanyStatus" , userCompanyStatusSchema);
export default UserCompanyStatus;