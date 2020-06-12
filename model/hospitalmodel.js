const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const schema = mongoose.Schema;
const hospitals = new schema(
  {
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
      },
      
      location: {
        type: {
          type: String, 
          default: 'Point', 
          
        },
        coordinates: {
          type: [Number],index:'2dsphere',
          
        }
      },
     
      secureURL:{
        type:String
      },
    

      image:{type:String},
    hospitalName: {
      type: String
    },
    doctorId: {
      type: schema.Types.ObjectId,
      ref: "user"
    },
    drSpecialisation: {
      type: String,
      enum: [
        "Dermatologists",
        "Cardiologist",
        "FamilyPhysician",
        "Physiatrists",
        "PlasticSurgeons"
      ],
      default: "FamilyPhysician"
    },
    hospitalAddress: [
      {
        landmark: { type: String },
        street: { type: String },
        pincode: { type: Number },
        state: { type: String },
        city: { type: String }
      }
    ],
    ContactNumber: {
      type: String
    },
    startTime: { type: String },
    endTime: { type: String },

    email: {
      type: String
    }
  },
  { timestamps: true }
);
hospitals.plugin(mongoosePaginate);
module.exports = mongoose.model("hospital", hospitals);
