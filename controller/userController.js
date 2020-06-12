const user = require("../model/userModel");
const hospital = require('../model/hospitalmodel')
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const commonFunction = require("../commonFunction/commonFunction");
const QRCode = require("qrcode");
const cloudinary = require("cloudinary").v2;
const speakeasy = require('speakeasy')
cloudinary.config({
  cloud_name: "dvkgaefsy",
  api_key: "85631683569XXXXX",
  api_secret: "xR5_M8BDv1aGrUhHBAyXXXX"
});

module.exports = {
  signUp: (req, res) => {
    if (!req.body.email) {
      console.log("rrgfg");
      res.send({ responseCode: 404, resonseMessage: "Email required!" });
    } else if (!req.body.mobileNumber) {

      return res.send({
        responeCode: 404,
        resonseMessage: "Mobile no. required!"
      });
    } else if (!req.body.password) {
      res.send({ responseCode: 404, resonseMessage: "Password required!" });
    } else {
      var query = {
        $or: [
          { email: req.body.email },
          { mobileNumber: req.body.mobileNumber }
        ],
        status: "ACTIVE"
      };

      user.findOne(query, (error, result) => {
        //
        if (error) {
          //console.log(error);
          res.send({
            responseCode: 500,
            responseMessage: "Internal server error!"
          });
        } else if (result) {
          ;
          if (result.email == req.body.email) {
            res.send({
              responseCode: 409,
              responseMessage: "Email already exists."
            });
          } else if (result.mobileNumber == req.body.mobileNumber) {
            res.send({
              responseCode: 409,
              responseMessage: "Mobile number already exits."
            });
          }
        } else {
          otp = Math.floor(Math.random() * 8888 + 1000);

          const token = jwt.sign({ email: req.body.email }, "himanshi");

          let link = `http://localhost:8080/user/emailVerify/${token}`; //////////for param

          commonFunction.sendmail(
            req.body.email,

            `Your otp is:${otp}    and click this link to verify your email:${link}`,
            "Otp verification..",
            (error, result) => {
              if (error) {
                console.log(error)
                //console.log(error);
                res.send({
                  responeCode: 500,
                  resonseMessage: "Internal server error:!!!!", error
                });
              } else {
                commonFunction.sms(
                  req.body.mobileNumber,
                  otp,
                  "Verification of sms:",
                  (error, result) => {
                    if (error) {
                      res.send({
                        responseCode: 500,
                        resonseMessage: "Internal server error!!",
                        error
                      });
                    } else {
                      if (req.body.password) {
                        req.body.password = bcrypt.hashSync(req.body.password);
                      }

                      req.body.otp = otp;
                      req.body.otpTime = Date.now();
                      req.body.emailTime = Date.now(); ////ms at the tym of emailverication
                      req.body.token = token;

                      new user(req.body).save((error, saveResult) => {
                        if (error) {
                          res.send({
                            responseCode: 500,
                            responseMessage: `Internal server error ${error}`
                          });
                        } else {
                          return res.send({
                            responseCode: 200,
                            resonseMessage: "Signup successfully.",
                            responseResult: saveResult
                          });
                        }
                      });
                    }
                  }
                );
                // }
                // }
                //);
              }
              //}
              // );
            }
          )
        }
      })
    }
  },
  ////////======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  logIn: (req, res) => {
    user.findOne(
      { email: req.body.email, status: "ACTIVE" },
      (findError, findResult) => {
        console.log(findResult)
        if (findError) {
          res.send({
            responseCode: 500,
            resonseMessage: "Internal server error::"
          });
        } else if (!findResult) {
          res.send({ responseCode: 404, resonseMessage: "User not found" });
        } else {
          var hashPassword = bcrypt.compareSync(
            req.body.password,
            findResult.password
          );

          if (!hashPassword) {
            res.send({ responseCode: 404, resonseMessage: "Wrong password" });
          } else {
            console.log(findResult.otpVerify);
            if (findResult.otpVerify == false) {
              res.send({
                responseCode: 404,
                resonseMessage: "First verify your otp"
              });
            } else if (findResult.emailVerify == false) {
              res.send({
                responseCode: 404,
                resonseMessage: "First verify your otp & email!"
              });
            }
            ///////token generation//////
            else
              var token1 = jwt.sign(
                {
                  email: req.body.email,
                  mobileNumber: user.mobileNumber,
                  _id: findResult._id
                },
                "himanshi",
                { expiresIn: "24h" }
              );
            // console.log(token)

            user.findByIdAndUpdate(
              { _id: findResult._id },
              { $set: { token: token1 } },
              { new: true },

              (updateError, updateResult) => {
                // console.log(updateResult)
                if (updateError) {
                  res.send({
                    responseCode: 500,
                    resonseMessage: "Internal server error!"
                  });
                } else {
                  return res.send({
                    responseCode: 200,
                    resonseMessage: "Login successfull",
                    token: token1
                  });
                }
              }
            );
          }
        }
      }
    );
  },

  getProfile: (req, res) => {
    var query = { email: req.body.email, status: "ACTIVE" };
    user
      .findOne(query)
      .select("firstName lastName email mobile ")
      .exec((err, result) => {
        if (err) {
          res.send({
            responseCode: 500,
            resonseMessage: "Internal server error"
          });
        } else if (!result) {
          res.send({ responseCode: 404, resonseMessage: "not found" });
        } else {
          res.send({
            responseCode: 200,
            resonseMessage: "Profile fetch.",
            result
          });
        }
      });
  },

  /////////==========================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  otpVerify: (req, res) => {
    if (!req.body.email) {
      res.send({ responseCode: 404, resonseMessage: "Email required" });
    } else if (!req.body.otp) {
      res.send({ responseCode: 404, resonseMessage: "Otp required" });
    } else {
      user.findOne(
        { email: req.body.email, status: "ACTIVE" },
        (error, result) => {
          if (error) {
            res.send({
              responseCode: 500,
              resonseMessage: "Internal server error"
            });
          } else if (!result) {
            res.send({ responseCode: 404, resonseMessage: "Not found" });
          } else {
            if (Date.now() - result.otpTime >= 300000000) {
              ////send otp again via email
              res.send({ responeCode: 404, resonseMessage: "Otp expired!" });
            } else {
              if (result.otp != req.body.otp) {
                res.send({
                  responseCode: 404,
                  responseMessage: "Incorect otp"
                });
              } else {
                user.findOneAndUpdate(
                  { email: req.body.email },
                  { otpVerify: true },
                  { new: true },
                  (err, result) => {
                    if (err) {
                      res.send({
                        responseCode: 500,
                        resonseMessage: "Internal server error"
                      });
                    } else {
                      res.send({
                        responseCode: 200,
                        resonseMessage: "OTP verified"
                      });
                    }
                  }
                );
              }
            }
          }
        }
      );
    }
  },

  ///////////ForgetPassword/////////////

  forgotPassword: (req, res) => {
    if (!req.body.email) {
      return res.send({
        responseCode: 404,
        resonseMessage: "Email is required:"
      });
    }
    user.findOne(
      { email: req.body.email, status: "ACTIVE" },
      (findError, findResult) => {
        if (findError) {
          res.send({
            responseCode: 500,
            resonseMessage: "Internal server error!!!!!!!!!!"
          });
        } else if (!findResult) {
          res.send({ responseCode: 404, resonseMessage: "Email not found:" });
        } else {
          var newotp = Math.floor(Math.random() * 8888 + 1000);
          commonFunction.sendmail(
            req.body.email,
            `this is otp ${newotp}`,
            "your new otp is:",
            (err, result) => {
              if (err) {
                console.log(err);
                res.send({
                  responseCode: 500,
                  resonseMessage: err
                });
              } else {
                user.findOneAndUpdate(
                  { _id: findResult._id },
                  {
                    $set: { otpVerify: false, otp: newotp, otpTime: Date.now() }
                  },
                  { new: true },
                  (updateErr, updateResult) => {
                    if (updateErr) {
                      res.send({
                        responseCode: 500,
                        resonseMessage: "Internal server error"
                      });
                    } else {
                      res.send({
                        responseCode: 200,
                        resonseMessage: "otp sent to your email id"
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  },
  ///////reSetPassword////////
  resetPassword: (req, res) => {
    if (!req.body.email) {
      res.send({ responseCode: 404, responseMessage: "Email is required::" });
    } else
      user.findOne(
        { email: req.body.email, status: "ACTIVE" },
        (findError, findResult) => {
          if (findError) {
            res.body({
              responseCode: 500,
              resonseMessage: "Internal server error"
            });
          } else if (!findResult) {
            res.send({ responseCode: 404, responseMessage: "Email not found" });
          } else {
            var hash = bcrypt.hashSync(req.body.password);

            user.findOneAndUpdate(
              { _id: findResult._id },
              { $set: { password: hash }, new: true },
              (updateError, updateResult) => {
                if (updateError) {
                  res.body({
                    responseCode: 500,
                    resonseMessage: "Internal server error"
                  });
                } else {
                  console.log(updateResult)
                  return res.send({
                    responeCode: 200,
                    resonseMessage: "Successfully changed!",
                    responseResult: updateResult
                  });
                }
              }
            );
          }
        }
      );
  },

  emailVerify: (req, res) => {
    console.log('kkk')
    user.findOne(
      { email: req.body.email, status: "ACTIVE" },
      (findError, findResult) => {//console.log(findResult.emailTime)
        // console.log(findResult);
        if (findError) {
          res.send({
            responeCode: 500,
            responseMessage: "Internal server error!"
          });
        } else if (!findResult) {
          res.send({
            responseCode: 404,
            resonseMessage: "Email not registered!"
          });
        } else if (Date.now() - findResult.emailTime >= 86400000) {
          res.send({ responseCode: 404, resonseMessage: "Email expired!" });
        }
        else {
          user.findOneAndUpdate(
            { _id: findResult._id, status: "ACTIVE" },
            { $set: { emailVerify: true } },
            { new: true },
            (findError, findResult) => {
              if (findError) {
                res.send({
                  responseCode: 500,
                  resonseMessage: "Internal server error:::"
                });
              } else if (!findResult) {
                res.send({
                  responseCode: 404,
                  resonseMessage: "Email not updated"
                });
              } else {
                res.send({
                  responseCode: 200,
                  resonseMessage: "Email verified"
                });
              }
            }
          );
        }
      }
    );
  },

  /////////////emailVerify by query///////////
  emailVerify1: (req, res) => {
    user.findOne(
      { token: req.query.token, status: "ACTIVE" },
      (findError, findResult) => {
        console.log(findResult.token)
        console.log(findResult);
        if (findError) {
          res.send({
            responeCode: 500,
            responseMessage: "Internal server error!"
          });
        } else if (!findResult) {
          res.send({
            responseCode: 404,
            resonseMessage: "Email not registered!"
          });
        } else if (Date.now() - findResult.emailTime >= 86400000) {
          res.send({ responseCode: 404, resonseMessage: "Email expired!" });
        } else {
          user.findOneAndUpdate(
            { _id: findResult._id, status: "ACTIVE" },
            { $set: { emailVerify: true } },
            { new: true },
            (findError, findResult) => {
              if (findError) {
                res.send({
                  responseCode: 500,
                  resonseMessage: "Internal server error:::"
                });
              } else if (!findResult) {
                res.send({
                  responseCode: 404,
                  resonseMessage: "Email not updated"
                });
              } else {
                res.send({
                  responseCode: 200,
                  resonseMessage: "Email verified"
                });
              }
            }
          );
        }
      }
    );
  },

  changePassword: (req, res) => {
    user.findOne(
      { email: req.body.email, status: "ACTIVE" },
      (findError, findResult) => {
        if (findError) {
          res.send({
            responseCode: 500,
            resonseMessage: "Internal server error"
          });
        } else if (!findResult) {
          res.send({ responseCode: 404, resonseMessage: "Result not found" });
        } else {
          // console.log(findResult)
          let passwordflag = bcrypt.compareSync(
            req.body.password,
            findResult.password
          );
          //console.log(passwordflag)
          if (passwordflag == false) {
            res.send({
              responseCode: 404,
              resonseMessage: "Old password is incorrect"
            });
          } else {
            let newPasswordhash = bcrypt.hashSync(req.body.newPassword);
            console.log(newPasswordhash);
            user.findOneAndUpdate(
              { _id: findResult._id },
              { $set: { password: newPasswordhash } },
              (updateErr, updateResult) => {
                if (updateErr) {
                  res.send({
                    responseCode: 500,
                    resonseMessage: "Internal server error"
                  });
                } else {
                  res.send({
                    responseCode: 200,
                    resonseMessage: "Password changed..."
                  });
                }
              }
            );
          }
        }
      }
    );
  }, ///////end of change password>>>>>>>>>>>>>>>>>>>.

  editProfile: (req, res) => {
    user.findById(
      { _id: req.body._id },
      { status: "ACTIVE" },
      (findError, findResult) => {
        if (findError) {
          res.send({
            responseCode: 500,
            resonseMessage: "Interal erver error",
            error: findError
          });
        } else if (!findResult) {
          res.send({ responseCode: 404, resonseMessage: "Not found" });
        } else {
          var obj = {};
          if (req.body.firstName) {
            obj.firstName = req.body.firstName;
          }
          if (req.body.lastName) {
            obj.lastName = req.body.lastName;
          }

          if (req.body.dateOfBirth) {
            obj.dateOfBirth = req.body.dateOfBirth;
          }

          var check = {
            $and: [
              {
                $or: [
                  { email: req.body.email },
                  { mobileNumber: req.body.mobileNumber }
                ]
              },
              { _id: { $ne: { _id: findResult._id } } }
            ]
          };
          console.log(check)
          user.findOne(check, (checkError, checkResult) => {
            if (checkError) {
              res.send({ responseCode: 500, resonseMessage: checkError });
            } else if (checkResult) {
              //console.log("jfidhsfh")
              if (checkResult.email == req.body.email) {
                res.send({
                  responeCode: 409,
                  responseMessage: "Email already exist"
                });
              } else if (checkResult.mobileNumber == req.body.mobileNumber) {
                res.send({
                  responeCode: 409,
                  resonseMessage: "Mobile number exists"
                });
              }
            } else {
              //console.log("hsuhdiusd")
              if (req.body.email) {
                obj.email = req.body.email;
              } else if (req.body.mobileNumber) {
                obj.mobileNumber = req.body.mobileNumber;
              }
              user.findByIdAndUpdate(
                { _id: req.body._id },
                { $set: obj },
                { new: true },
                (updateError, updateResult) => {
                  if (updateError) {
                    res.send({
                      responeCode: 500,
                      resonseMessage: "Internal server error!"
                    });
                  } else {
                    res.send({
                      responseCode: 200,
                      resonseMessage: "Profile updated.",
                      Result: updateResult
                    });
                  }
                }
              );
            }
          });
        }
      }
    );
  },
  resendOtp: (req, res) => {
    if (!req.body.email) {
      res.send({ responseCode: 404, resonseMessage: "Email required!" });
    } else {
      user.findOne(
        { email: req.body.email, status: "ACTIVE" },
        (findError, findResult) => {
          if (findError) {
            res.send({
              responseCode: 500,
              resonseMessage: "Internal server error!"
            });
          } else if (!findResult) {
            res.send({ responseCode: 404, resonseMessage: "Email not found" });
          } else {
            newOtp = Math.floor(Math.random() * 8888 + 1000);
            user.findByIdAndUpdate(
              { _id: findResult._id, status: { $ne: ["DELETE"] } },
              { $set: { otp: newOtp, otpVerify: false, new: true } },
              (updateError, updateResult) => {
                if (updateError) {
                  res.send({
                    responseCode: 500,
                    responseMessage: "Internal server error !"
                  });
                } else {
                  res.send({
                    responseCode: 200,
                    resonseMessage: "Otp sent to your email."
                  });
                }
              }
            );
          }
        }
      );
    }
  },

  //////qrCode//////

  qrCode: (req, res) => {
    var name = `name: ${req.body.name}   email:${req.body.email}`
    QRCode.toDataURL(name, (qrError, qrResult) => {
      if (qrError) {
        res.send({
          responseCode: 500,
          resonseMessage: "Internal server error!"
        });
      } else {
        res.send({ responseCode: 200, base64: qrResult });
        //
        console.log(qrResult);
        cloudinary.uploader.upload(qrResult, (err, result) => {
          if (err) {
            console.log(err);
          } else {

            console.log(result)

          }
        });
      }
    });
  },

  data: (req, res) => {
    var items = {
      page: req.body.page || 1,
      limit: req.body.limit || 10,
      sort: { createdAt: -1 }

    };

    var query = {
      $or: [ { email: new RegExp("^" + req.query.email) },{ firstName: new RegExp("^" + req.query.firstName)}],status: "ACTIVE" };
    user.paginate(query, items, (error, result) => {
      if (error) {
        res.send({
          responseCode: 500,
          resonseMessage: "Internal server error"
        });
      } else if (result.docs.length == 0) {

        res.send({ responseCode: 404, resonseMessage: "Not found" });
      } else {
        res.send({ responseCode: 200, result: result });
      }
    });
  },
  edit: (req, res) => {
    async function fun() {


      var a = 2
      console.log(a)

      promise = new Promise((success, error) => {
        if (success) {
          console.log('success')
        }
        else {
          console.log('error')
        }
      })
      //const a=2
      //  return Promise.resolve(a)

      //     await a
      //    console.log(a)

      //   }
      //   // console.log(f())
      //   console.log(fun(2))
    }
    console.log(fun())
  },





  ////
  secretKey: (req, res) => {
    var secret = speakeasy.generateSecret();   //////////generateSecret()
    console.log(secret)
    let s = secret.otpauth_url.replace("SecretKey", "himanshi")
    console.log(secret.base32)
    QRCode.toDataURL(s, (qrError, qrResult) => {
      if (qrError) {
        res.send({ responseCode: 500, responseMessage: "Internal server error" })
      }
      else {

        cloudinary.uploader.upload(qrResult, (cloudiError, cloudiResult) => {
          if (cloudiError) {
            res.send({ responseCode: 500, responseMessage: "Internal server error" })
          }
          else {
            console.log(cloudiResult)
            req.body.secretKeyUrl = cloudiResult.secure_url
            req.body.base32 = secret.base32
            new user(req.body).save((err, result) => {
              if (err) {
                res.send({ responseCode: 500, responseMessage: "Internal server error!", err })
              }
              else {
                console.log()

                res.send({ responseCode: 200, Result: result })
              }


            }
            )

          }


        })



      }

    })
  },
  // secretKeyVerify:(req,res,)=>{



  //   hospital.findOne({_id:req.body._id,status:'ACTIVE'},(findError,findResult)=>{ console.log(findResult)
  //     if(findError){
  //       //console.log(findError)
  //     }
  //     else{ console.log(req.user.base32)
  //       var verified = speakeasy.totp.verify({ secret: req.user.base32,
  //       encoding: 'base32',
  //       token: req.body.token });
  //     }

  //     console.log(verified)
  //   if(verified == false){
  //   res.send({responseCode:404,responseMessage:"Not verified."})
  //   }
  //   else{

  //     res.send({responseCode:404,responseMessage:"Verified."})
  //   }
  //    })

  //   },
};
////////end of exports////////////
