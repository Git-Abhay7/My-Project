
var router=require('express').Router();
var userRouter = require('../controller/userController')
var auth=require('../middleware/auth')//for param   /user/emailVerify/:{email}

/**
 * @swagger
 * /user/signUp:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: 
 *         in: formData
 *         required: true
 *       - name: lastName
 *         description: 
 *         in: formData
 *         required: true
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *       - name: mobileNumber
 *         description: 
 *         in: formData
 *         required: true
 *       - name: dateOfBirth
 *         description: 
 *         in: formData
 *         required: true
 *       - name: password
 *         description: 
 *         in: formData
 *         required: true
 *       - name: userType
 *         description: 
 *         in: formData
 *         required: 
 *       - name: gender
 *         description: 
 *         in: formData
 *         required: true
 *       - name: city
 *         description: 
 *         in: formData
 *         required: true
 *       - name: state
 *         description: 
 *         in: formData
 *         required: false
 *
 *     responses:
 *       200:
 *         description: Thanks, You have successfully signed up
 *       404:
 *         description: This Email/Mobile number already exists
 *       500:
 *         description: Internal Server Error
 */





 router.post('/signUp',userRouter.signUp)
 /**
 * @swagger
 * /user/otpVerify:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: otp
 *         description: 
 *         in: formData
 *         required: true
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: Otp verified
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/otpVerify',userRouter.otpVerify)
 /**
 * @swagger
 * /user/logIn:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *       - name: password
 *         description: 
 *         in: formData
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: login successful.
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/logIn',userRouter.logIn)
  /**
 * @swagger
 * /user/getProfile:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 
 *         in: formData
 *
 *
 *     responses:
 *       200:
 *         description: Profile fetched.
 *
 *       500:
 *         description: Internal Server Error
 */
  router.post('/getProfile',auth.authToken,userRouter.getProfile)
  /**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Profile fetched.
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/forgotPassword',userRouter.forgotPassword)
   /**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *       - name: password
 *         description:
 *         in: formData
 *         required: true
 * 
 *     responses:
 *       200:
 *         description: Succesfully changed.
 *
 *       500:
 *         description: Internal Server Error
 */
router.post('/resetPassword',userRouter.resetPassword)
 /**
 * @swagger
 * /user/emailVerify:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: Email verified
 *
 *       500:
 *         description: Internal Server Error
 */
router.post('/emailVerify',userRouter.emailVerify)
 /**
 * @swagger
 * /user/emailVerify1/?:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *
 *       - name: token
 *         description: 
 *         in: query
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: Email verified
 *
 *       500:
 *         description: Internal Server Error
 */
  router.get('/emailVerify1/?',userRouter.emailVerify1)
   /**
 * @swagger
 * /user/changePassword:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *
 *       - name: authorization
 *         description: 
 *         in: header
 *         required: true
 *       - name: email
 *         description: 
 *         in : formData
 *         required: true
 *       - name: password
 *         description:
 *         in: formData
 *         required: true
 *       - name: newPassword
 *         description:
 *         in: formData
 *         required: true
 *        
 *     responses:
 *       200:
 *         description: Password changed
 * 
 *       404:
 *         description: Old password is incorrect.
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/changePassword',auth.authToken,userRouter.changePassword)

router.post('/resendOtp',userRouter.resendOtp)
/**
 * @swagger
 * /user/editProfile:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: 
 *         in: formData
 *         required: true
 *       - name: authorization
 *         description: 
 *         in: header
 *         required: true
 *       - name: firstName
 *         description: 
 *         in: formData
 *         required: false
 *       - name: lastName
 *         description: 
 *         in: formData
 *         required: false
 *       - name: email
 *         description: 
 *         in: formData
 *         required: false
 *       - name: mobileNumber
 *         description: 
 *         in: formData
 *         required: false
 *       - name: dateOfBirth
 *         description: 
 *         in: formData
 *         required: false
 *       - name: password
 *         description: 
 *         in: formData
 *         required: false
 *       - name: userType
 *         description: 
 *         in: formData
 *         required: 
 *       - name: gender
 *         description: 
 *         in: formData
 *         required: false
 *       - name: city
 *         description: 
 *         in: formData
 *         required: false
 *       - name: state
 *         description: 
 *         in: formData
 *         required: false
 *
 *     responses:
 *       200:
 *         description: Profile edited.
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/editProfile',auth.authToken,userRouter.editProfile)
  /**
 * @swagger
 * /user/qrCode:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *
 *       - name: email
 *         description: 
 *         in: formData
 *         required: true
 *       - name: name
 *         description: 
 *         in: formData
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: Email verified
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/qrCode',userRouter.qrCode)
   /**
 * @swagger
 * /user/data:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *
 *       - name: email
 *         description: 
 *         in: formData
 *         required: false
 *       - name: firstName
 *         description: 
 *         in: formData
 *         required: false
 *
 *
 *     responses:
 *       200:
 *         description: result
 *
 *       500:
 *         description: Internal Server Error
 */
 router.post('/data',userRouter.data)
 router.post('/edit',userRouter.edit)
 router.post('/secretKey',userRouter.secretKey)
 router.post('/secretKeyVerify',auth.authToken,auth.secretKeyVerify)
module.exports=router;