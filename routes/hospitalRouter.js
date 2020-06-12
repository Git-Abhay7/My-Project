var router=require('express').Router();
var auth=require('../middleware/auth')

const hospitalRouter=require('../controller/hospitalController')
router.post('/addHospital',auth.authToken,hospitalRouter.addHospital)
router.post('/listHospital',hospitalRouter.listHospital)
router.post('/editHospital',auth.authToken,hospitalRouter.editHospital)
router.post('/viewHospital',auth.authToken,auth.secretKeyVerify,hospitalRouter.viewHospital)
router.post('/geoNear',hospitalRouter.geoNear)
router.post('/deleteHospital',auth.authToken,hospitalRouter.deleteHospital)
router.post('/addPackage',hospitalRouter.addPackage)
router.post('/editPackage',hospitalRouter.editPackage)

//router.post('/secretKey',hospitalRouter.secretKey)
//router.post('/secretKeyVerify',auth.authToken,hospitalRouter.secretKeyVerify)


module.exports=router;

