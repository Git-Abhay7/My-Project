const hospital = require("../model/hospitalmodel");
const package=require('../model/packageModel')

const qrCode=require('qrcode')
//const NodeGeocoder = require("node-geocoder");
//const user=require('../model/userModel')
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dvkgaefsy",
  api_key: "856316835694293",
  
  api_secret: "xR5_M8BDv1aGrUhHBAyCO9g-y6o"
});

// var options = {
//   provider: 'opencage',
//   httpAdapter: 'https',
//   apiKey: '7233f6a1343f4c96b7a9e67b4fd9e9dc',
//   formatter: null
//   };

module.exports = {
  addHospital: (req, res) => {
    
    if (req.user.userType != "DOCTOR") {
      res.send({
        responseCode: 404,
        responseMessage: "User type should be doctor."
      });
    } else if (!req.body.hospitalName) {
      return res.send({
        responseCode: 404,
        responseMessage: "Hospital name required."
      });
    } else {
    
      hospital.findOne({hospitalName: req.body.hospitalName,status:{$ne:'DELETE'}}, (err, fResult) => {
       
        if (err) {
          res.send({
            responseCode: 500,
            responseMessage: "Internal server error!"
          });
        } else if (fResult) {
         
          if (fResult.doctorId == req.user._id) {console.log('jjj')
            res.send({
              responseCode: 409,
              responseMessage: "Doctor Id should be unique"
            });
          } else if (fResult.hospitalName == req.body.hospitalName) {
            res.send({
              responseCode: 409,
              responseMessage: "Hospital name should be unique."
            });
          }
        } else {
          var obj = {};

          if (req.body.state) {
          
            obj.state = req.body.state;
          }
          if (req.body.landmark) {
            obj.landmark = req.body.landmark;
          }

          if (req.body.street) {
            obj.street = req.body.street;
          }
          if (req.body.pincode) {
            obj.pincode = req.body.pincode;
          }
          if (req.body.city) {
            obj.city = req.body.city;
          }

          cloudinary.uploader.upload(
            req.body.image,
            (cloudierror, cloudiresult) => {
              if (cloudierror) {
                console.log("error");
              } else {
                //console.log(cloudiresult.secure_url);
                //let dr_id = req.user._id;
                //(req.body.doctorId = dr_id.toString()),
                  (req.body.image = cloudiresult.secure_url),
                  (req.body.hospitalAddress = obj),
                 
                  new hospital(req.body).save((saveErr, saveRes) => {
                    if (saveErr) {
                      res.send({
                        responseCode: 500,
                        responseMessage: "Internal server error!"
                      });
                    } else {
                      return res.send({
                        responseCode: 200,
                        responseMessage: "Successfully added.",
                        result: saveRes
                      });
                    }
                  });
              }
            }
          );
        }
      });
    }
  },

  listHospital: (req, res) => {
    var items = {
      page: req.body.page || 1,
      limit: req.body.limit || 5,
      sort: { createdAt: -1 },
      populate: { path: "doctorId", select: "drSpecialisation" }
    };
    var object = {};
    object = { status: "ACTIVE", _id: { $ne: req.body._id } };
    if (req.body.hospitalName) {
      object.hospitalName = new RegExp("^" + req.body.hospitalName);
    }
    if (req.body.drSpecialisation) {
      object.drSpecialisation = new RegExp("^" + req.body.drSpecialisation);
    }

    if (req.body.toDate) {
      object.createdAt = { $lte: req.body.toDate };
    } //console.log(object.createdAt)

    if (req.body.fromDate) {
      object.createdAt = { $gte: req.body.fromDate };
    }
    console.log(object);

    hospital.paginate(object, items, (error, pagresult) => {
      //console.log(pagresult)
      if (error) {
        res.send({ responseCode: 500, responseMessage: "Internal erroor!" });
      } else if (pagresult.docs.length == 0) {
        res.send({ responseCode: 404, responseMessage: "Not found" });
      } else {
        res.send({ responseCode: 200, result: pagresult });
      }
    });
  },
  editHospital: (req, res) => {
    hospital.findOne(
      { _id: req.body.hospitalId, status: "ACTIVE" },
      (findErr, findResult) => {
        //console.log(findResult.doctorId)
        if (findErr) {
          res.send({
            responseCode: 500,
            responseMessage: "Internal server error"
          });
        } else if (!findResult) {
          //console.log()
          res.send({ responseCode: 404, responseMessage: "Not found" });
        } else {
          var object = {};

          if (req.body.hospitalName) {
            object.hospitalName = req.body.hospitalName;
          }
          if (req.body.city) {
            object[`hospitalAddress.$[].city`] = req.body.city;
          }

          if (req.body.landmark) {
            object[`hospitalAddress.$[].landmark`] = req.body.landmark;
          }
          if (req.body.street) {
            object[`hospitalAddress.$[].street`] = req.body.street;
          }
          if (req.body.state) {
            object[`hospitalAddress.$.state`] = req.body.state;
          } //console.log(address)
          if (req.body.email) {
            object.email = req.body.email;
          }
          if (req.body.ContactNumber) {
            object.ContactNumber = req.body.ContactNumber;
          }
          if (req.body.startTime) {
            object.startTime = req.body.startTime;
          }
          if (req.body.endTime) {
            object.endTime = req.body.endTime;
          }
          hospital.findOneAndUpdate(
            {
              _id: req.body.hospitalId,
              "hospitalAddress._id": req.body.addressId
            },
            { $set: object },
            { new: true },
            (err, result) => {
              if (err) {
                res.send({
                  responseCode: 500,
                  responseMessage: "Internal server error"
                });
              } else {
                res.send({ responseCode: 200, responseMessage: result });
              }
            }
          );
        }
      }
    );
    //}
  },

  viewHospital: (req, res) => {
    hospital.findOne(
      { doctorId: req.query.doctorId, status: "ACTIVE" },
      (findErr, findResult) => {
        console.log();
        if (findErr) {
          res.send({
            responseCode: 500,
            responseMessage: "Internal server error"
          });
        } else if (!findResult) {
          res.send({
            responseCode: 404,
            responseMessage: "Hospital not found"
          });
        } else {
          res.send({ responseCode: 200, result: findResult });
        }
      }
    );
  },

  deleteHospital: (req, res) => {
    hospital.findOne(
      { _id: req.body.hospitalId, status: "ACTIVE" },
      (findError, findResult) => {
        console.log(findResult);
        if (findError) {
          res.send({
            responseCode: 500,
            responseMessage: "Internal server error!!"
          });
        } else if (!findResult) {
          res.send({ responseCode: 404, responseMessage: "Data not found" });
        } else {
          hospital.findByIdAndUpdate(
            { _id: findResult._id },
            { $set: { status: "DELETE" } },
            { new: true },
            (err, result) => {
              res.send({ responseCode: 200, responseMessage: result });
            }
          );
        }
      }
    );
  },

   geoNear:(req,res)=>{

      hospital.aggregate([
      {
        $geoNear: {
           near: { 
             type: "point", 

             coordinates: [parseFloat(req.body.lat),parseFloat(req.body.long)   ]
             },
           distanceField: "dist.calculated",
           maxDistance: 2000*1000,
           includeLocs: "dist.location",
           spherical: true
        }
      }
   ],(findError,findResult)=>{
     if(findError){
       res.send( { responseCode : 500 , Error  : findError})
      }
      else{
        res.send( { responseCode : 200 ,  responseMessage : 'succesfull', findResult  : findResult})
     }
   })
  
   },
   addPackage:(req,res)=>{
    
    package.findOne({packageCost:req.body.packageCost},(findError,findResult)=>{console.log(findResult)
      if(findError){
        res.send({responseCode:500,responseMessage:"Internal server error"})
      }
      else if(findResult){
        res.send({responseCode:404,responseMessage:"Already exist"})
      }
      else{
        
        cloudinary.uploader.upload(req.body.image,(cloudierror,cloudiresult)=>{
if(cloudierror){
  res.send({responseCode:500,responseMessage:"Internal server error1"})
}
else if(!cloudiresult)
{
  res.send({responseCode:404,responseMessage:"Image not found"})
}
else{console.log(cloudiresult)
  var object={}
  console.log(cloudiresult.secure_url)
    if(req.body.meals){
      object.meals=req.body.meals
    }
    if(req.body.arrive){
      object.arrive=req.body.arrive
    }
  if(req.body.description){
    object.description=req.body.description
  }
  
 req.body.packagePic=cloudiresult.secure_url,
 console.log(req.body.packagePic)
 req.body.itinery=object
  new package(req.body).save((saveError,saveResult)=>{
    if(saveError){
      res.send({responseCode:500,responseMessage:"Internal server error"})
    }
    else {
      res.send({responseCode:200,responseMessage:"successfully added"})
    }
  })
}
        })
      }
    })
   },
   editPackage:(req,res)=>{

    package.findOne({_id:req.body._id},(findError,findResult)=>{//console.log(findResult)
      if(findError){
        res.send({responseCode:500,responseMessage:"Internal server error"})
      }
      else if(!findResult){
        res.send({responseCode:404,responseMessage:"Not found!"})
      }
      else{
        var object={}
        if(req.body.packageCost){
          object.packageCost=req.body.packageCost
        }
        if(req.body.packagePic){
          object.packagePic=req.body.packagePic
        }
        if(req.body.packageDescription){
          object.packageDescription=req.body.packageDescription
        }
        if(req.body.itreteId){
          object.itinery = [{
            meals:req.body.meals,
            
          },{arrive:req.body.arrive},{description:req.body.description}]
        }
        // if(req.body.meals){
        //   object[`itinery.$[].meals`]=req.body.meals
        // }
        // if(req.body.arrive){
        //   object[`itinery.$[].arrive`]=req.body.arrive
        // }
        // if(req.body.description){
        //   object[`itinery.$[].description`]=req.body.description
        // }

        // User.update({'local.email' : user, 'devices.id' : deviceID},
        // {$set : {'devices.$.agenda' : agenda}}, function(err, response)

        package.findOneAndUpdate({_id:findResult._id},{$set:object},{new:true},(err,result)=>{console.log(findResult.itinery[1])

          if(err){
            res.send({responseCode:500,responseMessage:"Internal server error",err})
          }
          else {
            res.send({responseCode:200,responseMessage:"Edited successfully",result})
          }
        })
      }
    })

   },
   secretKey:(req,res)=>{
      var secret=speakeasy.generateSecret();   //////////generateSecret()
console.log(secret)
     let s = secret.otpauth_url.replace("SecretKey","himanshi")
console.log(secret.base32)
     qrCode.toDataURL(s,(qrError,qrResult)=>{
       if(qrError){
         res.send({responseCode:500,responseMessage:"Internal server error"})
       }
       else{

        cloudinary.uploader.upload(qrResult,(cloudiError,cloudiResult)=>{
            if(cloudiError){
              res.send({responseCode:500,responseMessage:"Internal server error"})
            }
            else{
              console.log( cloudiResult)
              req.body.secretKeyUrl=cloudiResult.secure_url
              req.body.base32=secret.base32
              new hospital(req.body).save((err,result)=>{  
                if(err){
                  res.send({responseCode:500,responseMessage:"Internal server error!", err})
                }
                else{console.log()

                  res.send({responseCode:200,Result:result})
                }
                
             
            }
        )
        
       }
     

     })


      
   }

  })
},

edit:(req,res)=>{

}
};
