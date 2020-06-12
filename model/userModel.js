const mongoose = require("mongoose");
var schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate");
const userKey = new schema(
  {
    
    firstName: {
      type: String
    },
    gender:{
      type:String
    },
    state:{
      type:String
    },
    city:{type:String},
    base32:{type:String},
    secretOtp:{type:Number},
    secretKeyUrl:{type:String},
    
    
    
    lastName: {
      type: String
    },
    userType: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ASSISTANT", "ADMIN"],
      default: "PATIENT"
    },

   
    secureURL:{type:String},

    email: {
      type: String
    },
    mobileNumber: {
      type: String
    },
    dateOfBirth: {
      type: String
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "DELETE"],
      default: "ACTIVE"
    },
    otp: {
      type: Number
    },
    emailVerify: {
      type: Boolean,
      default: false
    },
    otpVerify: {
      type: Boolean,
      default: false
    },

    otpTime: {
      type: Number
    },
    emailTime: {
      type: Number
    },
    password: {
      type: String
    },

    token: {
      type: String
    }
  },

  { timestamps: true }
);
userKey.plugin(mongoosePagination);
module.exports = mongoose.model("user", userKey, "user");
