var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userPackage = new schema(
  {
    
    packagePic: {
            type: String
          },
        
        
          packageCost: {
            type: Number
          },
        
        
          packageDescripton: {
            type: String
          },
        
        
          itinery: [
            {
              meals: {
                type: String
              },
              arrive: {
                type: String
              },
              description: {
                type: String
              }
            }
          ]
        
      
    
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model("package", userPackage);
