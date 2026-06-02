import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required:true
    },
    description : {
        type : String , 
        required : true,
    },
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company"
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }],
    unlistedCompanyName: {
        type: String,
        required: function() { return !this.company; }
    },
    unlistedCompanyDetails: {
        offeredPackage: Number,
        eligibility: Number,
        location: [String],
        devStack: [String]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
},
{timestamps : true}
);

const Experience = mongoose.model("Experience" , experienceSchema);

export default Experience;