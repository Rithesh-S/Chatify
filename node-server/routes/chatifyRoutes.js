const express = require('express')
const router = express.Router()
const chatifyController = require('../controllers/chatifyController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.post('/signup', userController.signup)
router.post('/login', chatifyController.login)
router.get('/auth',authController.verifyJWT,(req,res) => res.status(200).json({}))
router.post('/chatapp/user', chatifyController.getUser)
router.put('/chatapp/addmember', userController.addMember)
router.get('/chatapp/:userId', chatifyController.getUserCollections)
router.post('/chatapp/chatuserlist', chatifyController.getChatUserList)
router.put('/statusupdate',chatifyController.statusUpdate)
router.get('/checkstatus',chatifyController.checkStatus)
router.put('/updatesocket',chatifyController.updateSocket)

module.exports = router
