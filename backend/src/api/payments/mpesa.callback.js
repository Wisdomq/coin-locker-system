/**
 * MPESA callback handler.
 * Daraja will POST a JSON payload describing the transaction result.
 * We parse it and update Payment record accordingly.
 *
 * Endpoint: POST /api/payments/mpesa/callback
 */

const express = require('express');
const router = express.Router();
const { Payment, Locker, User } = require('../../models');
const deviceClient = require('../../utils/device-client');

router.post('/callback', express.json(), async (req, res) => {
  // Acknowledge quickly
  res.status(200).send({ result: 'ok' });

  try {
    const body = req.body;
    // Daraja wraps data under Body.stkCallback
    const callback = body?.Body?.stkCallback;
    if (!callback) return;

    const merchantRequestID = callback.MerchantRequestID;
    const checkoutRequestID = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;
    // find amount and phone inside callback.CallbackMetadata.Item[]
    let amount = null, mpesaReceipt = null, phone = null;
    const items = callback?.CallbackMetadata?.Item || [];
    for (const i of items) {
      if (i.Name === 'Amount') amount = i.Value;
      if (i.Name === 'MpesaReceiptNumber') mpesaReceipt = i.Value;
      if (i.Name === 'PhoneNumber') phone = i.Value;
    }

    // Payment strategy: find payment by provider_ref = CheckoutRequestID or create new
    let payment = await Payment.findOne({ where: { provider_ref: checkoutRequestID } });
    if (!payment) {
      // try searching by user phone + amount + recent
      let user = await User.findOne({ where: { phone } });
      payment = await Payment.create({
        user_id: user ? user.id : null,
        locker_id: null,
        amount: amount || 0,
        provider: 'mpesa',
        provider_ref: checkoutRequestID,
        status: resultCode === 0 ? 'success' : 'failed'
      });
    } else {
      payment.status = resultCode === 0 ? 'success' : 'failed';
      payment.provider_ref = mpesaReceipt || payment.provider_ref;
      await payment.save();
    }

    // If success -> find pending locker payment (application-specific)
    if (resultCode === 0) {
      // Example: if you stored locker_id in payment metadata, unlock it:
      if (payment.locker_id) {
        const locker = await Locker.findByPk(payment.locker_id);
        if (locker) {
          // publish unlock command to device
          await deviceClient.publishUnlock(locker.code, { reason: 'mpesa_success', paymentId: payment.id });
          locker.status = 'occupied';
          await locker.save();
        }
      }
    }

    console.log('MPESA callback processed:', checkoutRequestID, resultDesc);
  } catch (err) {
    console.error('Error processing mpesa callback:', err);
  }
});

module.exports = router;
