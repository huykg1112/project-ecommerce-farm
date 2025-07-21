import { verifyVnpayReturn } from "@/lib/vnpay-utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const vnp_Params = Object.fromEntries(url.searchParams.entries());

    console.log("VNPay return params:", vnp_Params);

    const vnp_HashSecret = process.env.VNP_HASHSECRET;

    if (!vnp_HashSecret) {
      console.error("Missing VNP_HASHSECRET");
      return NextResponse.redirect(
        new URL(
          "/checkout/success?status=failed&message=Missing VNPAY secret",
          req.url
        )
      );
    }

    // Verify signature
    const isVerified = verifyVnpayReturn(vnp_HashSecret, vnp_Params);
    console.log("Signature verified:", isVerified);

    if (isVerified) {
      const responseCode = vnp_Params["vnp_ResponseCode"];
      const txnRef = vnp_Params["vnp_TxnRef"]; // Order ID
      const amount = vnp_Params["vnp_Amount"];
      const transactionNo = vnp_Params["vnp_TransactionNo"];

      console.log("Payment result:");
      console.log("Response Code:", responseCode);
      console.log("Transaction Ref:", txnRef);
      console.log("Amount:", amount);
      console.log("Transaction No:", transactionNo);

      if (responseCode === "00") {
        // Payment successful
        console.log(`VNPay payment successful for order: ${txnRef}`);

        // Xóa sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
        // Trong thực tế, bạn sẽ cập nhật database ở đây

        return NextResponse.redirect(
          new URL(
            `/checkout/success?orderId=${txnRef}&status=success&paymentMethod=vnpay`,
            req.url
          )
        );
      } else {
        // Payment failed
        console.log(
          `VNPay payment failed for order: ${txnRef}, Response Code: ${responseCode}`
        );
        return NextResponse.redirect(
          new URL(
            `/checkout/success?status=failed&orderId=${txnRef}&code=${responseCode}&paymentMethod=vnpay`,
            req.url
          )
        );
      }
    } else {
      // Invalid signature
      console.error("VNPay callback: Invalid signature");
      return NextResponse.redirect(
        new URL(
          "/checkout/success?status=failed&message=Invalid signature",
          req.url
        )
      );
    }
  } catch (error) {
    console.error("Error handling VNPay return:", error);
    return NextResponse.redirect(
      new URL(
        "/checkout/success?status=failed&message=Internal server error",
        req.url
      )
    );
  }
}
