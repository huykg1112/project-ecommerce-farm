// Debug script để test VNPay signature
const crypto = require('crypto');

const params = {
  vnp_Amount: 10000000,
  vnp_Command: 'pay',
  vnp_CreateDate: '20250723023607',
  vnp_CurrCode: 'VND',
  vnp_IpAddr: '127.0.0.1',
  vnp_Locale: 'vn',
  vnp_OrderInfo: 'Test payment',
  vnp_OrderType: 'other',
  vnp_ReturnUrl: 'http://localhost:3000/checkout/success',
  vnp_TmnCode: 'D30SA57V',
  vnp_TxnRef: 'TEST123',
  vnp_Version: '2.1.0',
};

// Sort params
const sortedParams = Object.keys(params)
  .sort()
  .reduce((result, key) => {
    result[key] = params[key];
    return result;
  }, {});

// Create query string
const queryString = Object.keys(sortedParams)
  .map((key) => `${key}=${encodeURIComponent(sortedParams[key])}`)
  .join('&');

console.log('Query string:', queryString);

// Create signature
const secretKey = '5O3U8EFFZRYI5FNUYWW8WVYRAJRV4XRP';
const hmac = crypto.createHmac('sha512', secretKey);
hmac.update(queryString);
const signature = hmac.digest('hex');

console.log('Generated signature:', signature);
