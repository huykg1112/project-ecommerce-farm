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
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib_dashboard/types/order";
import { Printer } from "lucide-react";
import { MouseEvent, useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintInvoiceProps {
  order: Order;
}

export function PrintInvoice({ order }: PrintInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Hóa đơn #${order?.order_code}`,
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
  const orderDate = new Date(order.created_at);
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
                <span className="font-normal">{order.order_code}</span>
              </p>
              <p className="font-medium">
                Ngày đặt hàng:{" "}
                <span className="font-normal">{formattedDate}</span>
              </p>
              <p className="font-medium">
                Phương thức thanh toán:{" "}
                <span className="font-normal">
                  {order.payment_method.method_name}
                </span>
              </p>
            </div>
            <div className="flex-1">
              <p className="font-medium">
                Khách hàng:{" "}
                <span className="font-normal">
                  {order.user?.full_name || "N/A"}
                </span>
              </p>
              <p className="font-medium">
                Nhà phân phối:{" "}
                <span className="font-normal">
                  {order.distributor?.full_name || "N/A"}
                </span>
              </p>
              {order.shipping_address && (
                <p className="font-medium">
                  Địa chỉ:{" "}
                  <span className="font-normal">{order.shipping_address}</span>
                </p>
              )}
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
              {order.order_details.map((detail, index) => (
                <TableRow key={detail.order_detail_id}>
                  <TableCell className="border">{index + 1}</TableCell>
                  <TableCell className="border">
                    {detail.batch_product.product.product_name}
                  </TableCell>
                  <TableCell className="border">
                    {order.distributor?.full_name || "N/A"}
                  </TableCell>
                  <TableCell className="border">
                    {formatCurrency(Number(detail.unit_price))}
                  </TableCell>
                  <TableCell className="border">{detail.quantity}</TableCell>
                  <TableCell className="border">
                    {formatCurrency(Number(detail.subtotal))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="font-bold">
                <TableCell colSpan={5} className="border text-right">
                  Tổng cộng:
                </TableCell>
                <TableCell className="border">
                  {formatCurrency(
                    order.total_amount ||
                      order.order_details.reduce(
                        (sum, detail) => sum + Number(detail.subtotal),
                        0
                      )
                  )}
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
