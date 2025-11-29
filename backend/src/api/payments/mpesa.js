const axios = require('axios');

async function stkPush(phone, amount, lockerId) {
  return {
    status: 'queued',
    message: 'STK Push initiated (stub)',
    phone,
    amount,
    lockerId
  };
}

module.exports = { stkPush };
