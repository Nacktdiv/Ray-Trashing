const midtransClient = require('midtrans-client');

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

export const snap = new midtransClient.Snap({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export const midtransConfig = {
  merchantId: process.env.MIDTRANS_MERCHANT_ID,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
  isProduction: isProduction,
  snapScriptUrl: isProduction 
    ? 'https://app.midtrans.com/snap/snap.js' 
    : 'https://app.sandbox.midtrans.com/snap/snap.js'
};

