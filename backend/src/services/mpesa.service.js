/**
 * MPESA service (sandbox-ready)
 * - Uses consumer key/secret to get access token
 * - Issues STK Push requests (Lipa Na M-Pesa Online)
 *
 * NOTE: Sandbox endpoints and payloads are based on Daraja. Adjust baseURL for production.
 */

const axios = require('axios');
const qs = require('qs');
const base64 = require('base-64');

const MPESA_BASE = process.env.MPESA_BASE_URL || 'https://sandbox.safaricom.co.ke';
const SHORTCODE = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY = process.env.MPESA_PASSKEY || ''; // test sandbox passkey
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://your-public-callback.example.com/api/payments/mpesa/callback';

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('MPESA keys not set');

  const token = base64.encode(`${key}:${secret}`);
  const url = `${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`;
  const resp = await axios.get(url, { headers: { Authorization: `Basic ${token}` } });
  return resp.data.access_token;
}

function getTimestamp() {
  const d = new Date();
  const year = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  return `${year}${mm}${dd}${hh}${min}${ss}`;
}

async function stkPush(phone, amount, accountReference = 'CoinLocker', transactionDesc = 'Locker payment') {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = base64.encode(SHORTCODE + PASSKEY + timestamp);

  // format MSISDN: for Kenya sandbox often 2547XXXXXXXX
  const msisdn = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: msisdn,
    PartyB: SHORTCODE,
    PhoneNumber: msisdn,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };

  const url = `${MPESA_BASE}/mpesa/stkpush/v1/processrequest`;
  const resp = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
  return resp.data;
}

module.exports = { stkPush, getAccessToken };
