"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/data/orders";
import { formatCurrency } from "@/lib/utils";
import { Printer } from "lucide-react";
import { MouseEvent, useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintInvoiceProps {
  order: Order;
}

export function PrintInvoice({ order }: PrintInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    //     content: () => invoiceRef.current as HTMLElement,
    documentTitle: `Hóa đơn #${order.orderNumber}`,
    onAfterPrint: () => console.log("In hóa đơn thành công"),
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .print-hidden {
          display: none;
        }
      }
    `,
  });

  // Bọc handlePrint để tương thích với onClick
  const onPrintClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handlePrint();
  };

  // Format date
  const orderDate = new Date(order.date);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(orderDate);

  return (
    <div>
      <Button
        onClick={onPrintClick}
        className="bg-primary hover:bg-primary-dark"
      >
        <Printer className="mr-2 h-4 w-4" />
        In hóa đơn
      </Button>

      {/* Invoice template for printing */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={invoiceRef}
          className="max-w-3xl mx-auto p-6 font-sans text-gray-800"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-600">
              HÓA ĐƠN BÁN HÀNG
            </h1>
            <p className="text-gray-500">
              Nông Sàn - Sàn Thương Mại Điện Tử Nông Nghiệp
            </p>
          </div>

          <div className="flex justify-between mb-8 gap-4">
            <div className="flex-1">
              <p className="font-medium">
                Mã đơn hàng:{" "}
                <span className="font-normal">{order.orderNumber}</span>
              </p>
              <p className="font-medium">
                Ngày đặt hàng:{" "}
                <span className="font-normal">{formattedDate}</span>
              </p>
              <p className="font-medium">
                Phương thức thanh toán:{" "}
                <span className="font-normal">{order.paymentMethod}</span>
              </p>
              {order.trackingNumber && (
                <p className="font-medium">
                  Mã vận đơn:{" "}
                  <span className="font-normal">{order.trackingNumber}</span>
                </p>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                Khách hàng:{" "}
                <span className="font-normal">
                  {order.shippingAddress.fullName}
                </span>
              </p>
              <p className="font-medium">
                Số điện thoại:{" "}
                <span className="font-normal">
                  {order.shippingAddress.phone}
                </span>
              </p>
              <p className="font-medium">
                Địa chỉ:{" "}
                <span className="font-normal">
                  {order.shippingAddress.address}, {order.shippingAddress.ward},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </span>
              </p>
            </div>
          </div>

          <Table className="mb-8">
            <TableHeader>
              <TableRow>
                <TableHead className="border bg-gray-100">STT</TableHead>
                <TableHead className="border bg-gray-100">Sản phẩm</TableHead>
                <TableHead className="border bg-gray-100">Đại lý</TableHead>
                <TableHead className="border bg-gray-100">Đơn giá</TableHead>
                <TableHead className="border bg-gray-100">Số lượng</TableHead>
                <TableHead className="border bg-gray-100">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{index + 1}</TableCell>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border">{item.sellerName}</TableCell>
                  <TableCell className="border">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="border">{item.quantity}</TableCell>
                  <TableCell className="border">
                    {formatCurrency(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="border text-right font-medium"
                >
                  Tạm tính:
                </TableCell>
                <TableCell className="border">
                  {formatCurrency(order.totalAmount - order.shippingFee)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="border text-right font-medium"
                >
                  Phí vận chuyển:
                </TableCell>
                <TableCell className="border">
                  {formatCurrency(order.shippingFee)}
                </TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell colSpan={5} className="border text-right">
                  Tổng cộng:
                </TableCell>
                <TableCell className="border">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>Cảm ơn bạn đã mua hàng tại Nông Sàn!</p>
            <p>
              Mọi thắc mắc xin liên hệ: hotline 1900 1234 56 hoặc email
              hotro@nongsan.vn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
