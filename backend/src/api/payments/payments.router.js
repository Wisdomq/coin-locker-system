const express = require('express');
const router = express.Router();
const mpesa = require('./mpesa');

router.post('/mpesa/stkpush', async (req, res) => {
  try {
    const { phone, amount, lockerId } = req.body;
    const result = await mpesa.stkPush(phone, amount, lockerId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
