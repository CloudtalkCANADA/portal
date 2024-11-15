const express = require('express');
const router = express.Router();
const paymentContoller = require('../controllers/paymentController');

router.post('/add_payment', paymentContoller.addPayment);
// router.post('/login', login);
// router.post('/logout', logout);

module.exports = router;

