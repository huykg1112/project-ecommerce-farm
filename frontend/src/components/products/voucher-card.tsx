import { showToast } from "@/lib/toast-provider";
import { formatCurrency, getCookie } from "@/lib/utils";
import { voucherService } from "@/lib_dashboard/services/voucher-service";
import { Voucher } from "@/types/entities";
import { format } from "date-fns";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface VoucherCardProps {
  voucher: Voucher;
}

export default function VoucherCard({ voucher }: VoucherCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [remainingUses, setRemainingUses] = useState<number>(
    voucher.usage_limit ? voucher.usage_limit - voucher.used_count : Infinity
  );
  const router = useRouter();

  const userId = getCookie("user_id");

  //kiểm tra trong voucher có id của người  không
  const isCollectVoucher = useMemo(() => {
    return voucher.users?.some((user) => user.user_id === userId);
  }, [voucher.users, userId]);

  // có phải người tạo voucher không
  const isOwner = useMemo(() => {
    return voucher.distributor.user_id === userId;
  }, [voucher.distributor.user_id, userId]);

  console.log("isCollectVoucher", isCollectVoucher);

  const handleSaveVoucher = async () => {
    setIsSaving(true);
    try {
      if (!userId) {
        showToast.error("Bạn cần đăng nhập để lưu voucher.");
        router.push(`/login`);
        return false;
      }
      await voucherService.collectVoucher(voucher.voucher_id);
      showToast.success(`Đã lưu voucher: ${voucher.voucher_code}`);
      // router.push(`/seller/${voucher.distributor_id}`);
      // Decrease remaining uses
      if (typeof remainingUses === "number") {
        setRemainingUses((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error collecting voucher:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCardClick = () => {
    if (isCollectVoucher) {
      showToast.info("Bạn đã lưu voucher này rồi.");
      return;
    }
    if (isOwner) {
      showToast.info("Bạn là người tạo voucher này.");
      return;
    }
    if (remainingUses !== 0) {
      handleSaveVoucher();
    }
  };

  return (
    <Card
      className="relative group overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="flex h-fit w-full">
        {/* Voucher Icon Section (1/3) */}
        <div className="w-1/3 bg-gradient-to-br from-[#599146] to-[#7cb342] flex items-center justify-center">
          <Ticket className="w-12 h-12 text-white" />
        </div>
        {/* Voucher Info Section (2/3) */}
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {voucher.max_discount_value
                ? `Giảm ${formatCurrency(voucher.max_discount_value)} `
                : "Giảm giá"}
            </h3>
            {voucher.min_order_value && (
              <p className="text-xs text-gray-500">
                Đơn tối thiểu: {formatCurrency(voucher.min_order_value)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Hết hạn:{" "}
              {voucher.end_date
                ? format(new Date(voucher.end_date), "dd/MM/yyyy")
                : "Không có"}
            </p>
            <p className="text-xs text-gray-500">
              Còn lại:{" "}
              {remainingUses === Infinity ? "Unlimited" : remainingUses}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 text-[#599146] border-[#599146] hover:bg-[#599146] hover:text-white text-xs"
            disabled={isSaving || !voucher.is_active || remainingUses === 0}
          >
            {isSaving ? "Đang lưu..." : "Lưu Voucher"}
          </Button>
        </div>
      </div>
      {/* Sticker-like effect */}
      <div className="absolute inset-0 border-2 border-dashed border-[#599146] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {voucher.distributor.invenstory?.name || "Nông Sản"}
      </span>
    </Card>
  );
}
