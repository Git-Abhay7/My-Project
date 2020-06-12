const jwt=require('jsonwebtoken');
const user=require('../model/userModel')
const speakeasy=require('speakeasy')
//const user=require('../model/userModelH')
module.exports={

    authToken:(req,res,next)=>{

       // console.log(req.headers.authorization)
        if(!req.headers.authorization){
            res.send({responesCode:403,responseMessage:"Token not found"})
        }
        else {
           jwt.verify(req.headers.authorization,"himanshi",(err,data)=>{
               if(err){
                   res.send({responesCode:500,responseMessage:"Internal server error",err})
               }
                else{
                    user.findOne({email:data.email,status:{$ne:"DELETE"}},(findErr,findUser)=>{
                        if(findErr){
                            res.send({responesCode:500,responseMessage:"Internal server error",err})
                        }
                        else if(!findUser){
                            res.send({responesCode:404,responseMessage:"User not found"})
                        }
                        else{
                           if(findUser.status=='BLOCK'){
                               res.send({responesCode:404,responseMessage:"User has been blocked!!"})
                           }
                           else if(findUser.status=='DELETE'){
                            res.send({responesCode:404,responseMessage:"User has been deleted!!"})

                           }
                           else{
                               req.user=findUser
                          
                               next()
                           }
                        }

                      
                    })

                }
           })
        }
},
secretKeyVerify:(req,res,next)=>{
  

           console.log(req.user.base32)
    // hospital.findOne({_id:req.body._id,status:'ACTIVE'},(findError,findResult)=>{ console.log(findResult)
    //   if(findError){
      
    //   }
      console.log(req.user.base32)
        var verified = speakeasy.totp.verify({ secret: req.user.base32,
        encoding: 'base32',
        token: req.body.token });
    
     
      console.log(verified)
    if(verified == false){
    res.send({responseCode:404,responseMessage:"Not verified."})
    }
    else{
    next()
      res.send({responseCode:404,responseMessage:"Verified."})
    }
    
    
    
    },
};