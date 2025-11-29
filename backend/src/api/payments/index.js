const express = require('express');
const router = express.Router();

const paymentsRouter = require('./payments.router');
const mpesaCallback = require('./mpesa.callback');

router.use('/mpesa', paymentsRouter);
router.use('/mpesa', mpesaCallback);

module.exports = router;
