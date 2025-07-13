"use client";

import { VoucherTable } from "@/components/(dashboard)/vouchers/voucher-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { voucherService } from "@/lib_dashboard/services/voucher-service";
import {
  selectedVouchersAtom,
  voucherFormDataAtom,
  vouchersDataAtom,
  vouchersLoadingAtom,
} from "@/lib_dashboard/store/voucher-store";
import { useAtom } from "jotai";
import { Gift, Plus, Search, Ticket } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function VouchersManagementPage() {
  const { toast } = useToast();
  const [vouchers, setVouchers] = useAtom(vouchersDataAtom);
  const [loading, setLoading] = useAtom(vouchersLoadingAtom);
  const [selectedVouchers, setSelectedVouchers] = useAtom(selectedVouchersAtom);
  const [formData, setFormData] = useAtom(voucherFormDataAtom);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState("");

  // Fetch vouchers
  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await voucherService.getMyVouchers();
      setVouchers(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách voucher",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setVouchers, toast]);

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    let filtered = vouchers;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (voucher) =>
          voucher.voucher_code.toLowerCase().includes(search) ||
          voucher.promotion?.promotion_name.toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((voucher) =>
        statusFilter === "active" ? voucher.is_active : !voucher.is_active
      );
    }

    return filtered;
  }, [vouchers, searchTerm, statusFilter]);

  // Selection handlers
  const toggleVoucherSelection = useCallback(
    (voucherId: string) => {
      setSelectedVouchers((prev) =>
        prev.includes(voucherId)
          ? prev.filter((id) => id !== voucherId)
          : [...prev, voucherId]
      );
    },
    [setSelectedVouchers]
  );

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedVouchers(
        checked ? filteredVouchers.map((voucher) => voucher.voucher_id) : []
      );
    },
    [setSelectedVouchers, filteredVouchers]
  );

  // Action handlers
  const handleToggleStatus = useCallback(
    async (voucherId: string) => {
      try {
        await voucherService.toggleVoucherStatus(voucherId);
        await fetchVouchers();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật trạng thái voucher",
          variant: "destructive",
        });
      }
    },
    [fetchVouchers, toast]
  );

  const handleEditVoucher = useCallback((voucherId: string) => {
    // Open edit modal
    console.log("Edit voucher:", voucherId);
  }, []);

  const handleDeleteVoucher = useCallback((voucherId: string) => {
    setSelectedVoucherId(voucherId);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await voucherService.deleteVoucher(selectedVoucherId);
      await fetchVouchers();
      toast({
        title: "Thành công",
        description: "Xóa voucher thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa voucher",
        variant: "destructive",
      });
    }
    setDeleteModalOpen(false);
    setSelectedVoucherId("");
  }, [selectedVoucherId, fetchVouchers, toast]);

  // Batch actions
  const handleBatchActivate = useCallback(async () => {
    try {
      await voucherService.batchToggleStatus(selectedVouchers);
      await fetchVouchers();
      setSelectedVouchers([]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể kích hoạt voucher",
        variant: "destructive",
      });
    }
  }, [selectedVouchers, fetchVouchers, setSelectedVouchers, toast]);

  const handleBatchDeactivate = useCallback(async () => {
    try {
      await voucherService.batchToggleStatus(selectedVouchers);
      await fetchVouchers();
      setSelectedVouchers([]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tắt voucher",
        variant: "destructive",
      });
    }
  }, [selectedVouchers, fetchVouchers, setSelectedVouchers, toast]);

  const handleBatchDelete = useCallback(async () => {
    try {
      await voucherService.batchDelete(selectedVouchers);
      await fetchVouchers();
      setSelectedVouchers([]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa voucher",
        variant: "destructive",
      });
    }
  }, [selectedVouchers, fetchVouchers, setSelectedVouchers, toast]);

  // Statistics
  const stats = useMemo(() => {
    const totalVouchers = vouchers.length;
    const activeVouchers = vouchers.filter((v) => v.is_active).length;
    const inactiveVouchers = vouchers.filter((v) => !v.is_active).length;
    const usedVouchers = vouchers.filter((v) => v.used_count > 0).length;

    return { totalVouchers, activeVouchers, inactiveVouchers, usedVouchers };
  }, [vouchers]);

  // Get selected voucher name for delete modal
  const selectedVoucherName = useMemo(() => {
    const voucher = vouchers.find((v) => v.voucher_id === selectedVoucherId);
    return voucher?.voucher_code || "";
  }, [vouchers, selectedVoucherId]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý Voucher</h1>
        <Button
          className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          onClick={() => console.log("Add voucher")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm voucher
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng voucher
            </CardTitle>
            <Ticket className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalVouchers}
            </div>
            <p className="text-xs text-[#74a65d]">Tất cả voucher</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đang hoạt động
            </CardTitle>
            <Gift className="h-5 w-5 text-[#90c577]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.activeVouchers}
            </div>
            <p className="text-xs text-[#74a65d]">Voucher có thể sử dụng</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã tắt
            </CardTitle>
            <Ticket className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.inactiveVouchers}
            </div>
            <p className="text-xs text-[#74a65d]">Voucher không hoạt động</p>
          </CardContent>
        </Card>

        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Đã sử dụng
            </CardTitle>
            <Gift className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.usedVouchers}
            </div>
            <p className="text-xs text-[#74a65d]">Voucher đã được dùng</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#74a65d]" />
          <Input
            placeholder="Tìm kiếm voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-[#90c577] focus:border-[#74a65d] bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#90c577] rounded-md focus:outline-none focus:ring-2 focus:ring-[#74a65d] bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã tắt</option>
        </select>
      </div>

      {/* Batch Actions */}
      {selectedVouchers.length > 0 && (
        <div className="mb-4">
          <BatchActions
            selectedCount={selectedVouchers.length}
            onBatchActivate={handleBatchActivate}
            onBatchDeactivate={handleBatchDeactivate}
            onBatchDelete={handleBatchDelete}
            title="voucher"
          />
        </div>
      )}

      {/* Table */}
      <VoucherTable
        vouchers={filteredVouchers}
        selectedVouchers={selectedVouchers}
        onSelectVoucher={toggleVoucherSelection}
        onSelectAll={toggleSelectAll}
        onToggleStatus={handleToggleStatus}
        onEditVoucher={handleEditVoucher}
        onDeleteVoucher={handleDeleteVoucher}
        loading={loading}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirm={handleConfirmDelete}
        title="voucher"
        nameDelete={selectedVoucherName}
      />
    </section>
  );
}
