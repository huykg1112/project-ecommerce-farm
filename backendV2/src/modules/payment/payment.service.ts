import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class PaymentService {
  private vnp_TmnCode = process.env.VNPAY_TMN_CODE;
  private vnp_HashSecret = process.env.VNPAY_HASH_SECRET || '';
  private vnp_Url = process.env.VNPAY_URL;
  private vnp_ReturnUrl = process.env.VNPAY_RETURN_URL;

  createPaymentUrl({
    amount,
    orderId,
    orderInfo,
    orderType,
    ipAddr,
    bankCode,
  }) {
    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(
      new Date(date.getTime() + 15 * 60 * 1000),
    );
    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType || 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };
    if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;

    // Sort params
    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((r, k) => ((r[k] = vnp_Params[k]), r), {});

    // Build hashdata
    const signData = qs.stringify(sortedParams, {
      encode: false,
      delimiter: '&',
    });
    const secureHash = crypto
      .createHmac('sha512', this.vnp_HashSecret)
      .update(signData)
      .digest('hex');

    sortedParams['vnp_SecureHash'] = secureHash;
    const paymentUrl = `${this.vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
    return paymentUrl;
  }

  private formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const MM = ('0' + (date.getMonth() + 1)).slice(-2);
    const dd = ('0' + date.getDate()).slice(-2);
    const HH = ('0' + date.getHours()).slice(-2);
    const mm = ('0' + date.getMinutes()).slice(-2);
    const ss = ('0' + date.getSeconds()).slice(-2);
    return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  }
}
