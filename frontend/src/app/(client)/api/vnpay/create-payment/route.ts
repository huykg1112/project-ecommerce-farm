import { createVnpayUrl } from "@/lib/vnpay-utils";
import { NextResponse } from "next/server";

function getClientIP(req: Request): string {
  // Thử các header khác nhau để lấy IP thực
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  const clientIP = req.headers.get("x-client-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (clientIP) {
    return clientIP;
  }

  // Fallback cho localhost
  return "127.0.0.1";
}

export async function POST(req: Request) {
  try {
    const { amount, orderId, orderInfo, ipAddr } = await req.json();

    // Lấy IP từ header nếu không được cung cấp
    const clientIP = ipAddr || getClientIP(req);

    // Lấy thông tin từ environment variables
    const vnp_TmnCode = process.env.VNP_TMNCODE;
    const vnp_HashSecret = process.env.VNP_HASHSECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.NEXT_PUBLIC_VNPAY_RETURN_URL;

    console.log("Environment variables:");
    console.log("VNP_TMNCODE:", vnp_TmnCode);
    console.log("VNP_URL:", vnp_Url);
    console.log("VNP_RETURN_URL:", vnp_ReturnUrl);
    console.log("VNP_HASHSECRET exists:", !!vnp_HashSecret);

    if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
      console.error("Missing environment variables");
      return NextResponse.json(
        {
          message: "Missing VNPAY environment variables",
          missing: {
            vnp_TmnCode: !vnp_TmnCode,
            vnp_HashSecret: !vnp_HashSecret,
            vnp_Url: !vnp_Url,
            vnp_ReturnUrl: !vnp_ReturnUrl,
          },
        },
        { status: 500 }
      );
    }

    console.log("Creating payment URL with params:");
    console.log("Amount:", amount);
    console.log("Order ID:", orderId);
    console.log("Order Info:", orderInfo);
    console.log("IP Address:", clientIP);

    const paymentUrl = createVnpayUrl(
      vnp_TmnCode,
      vnp_HashSecret,
      vnp_Url,
      amount,
      orderId,
      orderInfo,
      clientIP,
      vnp_ReturnUrl
    );

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating VNPay payment URL:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
