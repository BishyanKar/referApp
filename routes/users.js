var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', userController.getAllUsers);
router.get('/refercode', userController.getReferredUsers);
router.get('/totalEarned', userController.calculateRevenuefromReferals);

router.post('/signUp', userController.signUp);

router.delete('/delete', userController.deleteById);

module.exports = router;
