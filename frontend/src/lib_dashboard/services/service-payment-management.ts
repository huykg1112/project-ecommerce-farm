import { showToast } from "@/lib/toast-provider";
import { axiosInstance } from "./axios-instance";

export const servicePaymentManagement = {
  /**
   * Gọi API tạo URL thanh toán VNPay
   * @param params { amount, orderId, orderInfo, orderType, bankCode }
   * @returns { paymentUrl }
   */
  async createVNPayPaymentUrl(params: {
    amount: number;
    orderId: string;
    orderInfo: string;
    orderType?: string;
    bankCode?: string;
  }): Promise<string | null> {
    try {
      const res = await axiosInstance.post(
        "/payment/vnpay/create-payment-url",
        params
      );
      return res.data.paymentUrl;
    } catch (error: any) {
      let msg = "Lỗi khi tạo URL thanh toán VNPay";
      if (error?.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      return null;
    }
  },
};
