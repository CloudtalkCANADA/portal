const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.adminLogin);
router.post('/admin/register', authController.adminRegister);
router.post('/admin/verify', authController.adminVerify);
router.post('/admin/resend', authController.adminResendEmail);
router.post('/customer/login', authController.customerLogin);
router.post('/customer/google/login', authController.customerGoogleLogin);
router.post('/customer/register', authController.customerRegister);
router.post('/customer/google/register', authController.customerGoogleRegister);
router.post('/customer/verify', authController.adminVerify);
router.post('/customer/resend', authController.adminResendEmail);

module.exports = router;
