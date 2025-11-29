const express = require('express');
const router = express.Router();
const { User, Payment, Locker } = require('../../models');
const mpesaService = require('../../services/mpesa.service');

/**
 * POST /api/payments/mpesa/stkpush
 * body: { phone, amount, lockerCode }
 */
router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, lockerCode } = req.body;
    if (!phone || !amount) return res.status(400).json({ error: 'phone and amount required' });

    // find or create user
    let user = await User.findOne({ where: { phone } });
    if (!user) user = await User.create({ phone });

    // find locker by code if provided
    let locker = null;
    if (lockerCode) locker = await Locker.findOne({ where: { code: lockerCode } });

    // create pending payment
    const payment = await Payment.create({
      user_id: user.id,
      locker_id: locker ? locker.id : null,
      amount,
      provider: 'mpesa',
      provider_ref: null,
      status: 'initiated'
    });

    // call MPESA STK push
    const resp = await mpesaService.stkPush(phone, amount, `Locker:${lockerCode || 'N/A'}`, 'Coin locker payment');

    // store checkout id if returned
    if (resp?.CheckoutRequestID) {
      payment.provider_ref = resp.CheckoutRequestID;
      await payment.save();
    }

    res.json({ message: 'STK Push requested', data: resp, paymentId: payment.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

