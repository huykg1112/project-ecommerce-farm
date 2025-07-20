import { VouchersSectionProps } from "@/interfaces";
import VoucherCard from "../products/voucher-card";
import { Skeleton } from "../ui/skeleton";

export default function VouchersSection({
  vouchers,
  loading,
}: VouchersSectionProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#599146]">
            Danh Mục Khuyến Mãi
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-40">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))
            : vouchers.map((voucher) => (
                <VoucherCard key={voucher.voucher_id} voucher={voucher} />
              ))}
        </div>
      </div>
    </section>
  );
}
