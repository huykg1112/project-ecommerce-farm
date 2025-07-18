"use client";
import { PromotionFilters } from "@/components/(dashboard)/promotions/promotion-filters";
import { PromotionFormModal } from "@/components/(dashboard)/promotions/promotion-form-modal";
import { PromotionTable } from "@/components/(dashboard)/promotions/promotion-table";
import { DeleteModal } from "@/components/common/delete-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/lib/toast-provider";
import { promotionService } from "@/lib_dashboard/services/promotio-service-management";
import {
  PromotionFormData,
  promotionFormDataAtom,
  promotionsDataAtom,
  promotionsLoadingAtom,
  resetPromotionFormAtom,
  selectedPromotionsAtom,
} from "@/lib_dashboard/store/promotion-store";
import { UpdatePromotionRequest } from "@/lib_dashboard/types/promotion";
import { useAtom, useSetAtom } from "jotai";
import { Gift, Plus, Ticket } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function PromotionManagementPage() {
  const [promotions, setPromotions] = useAtom(promotionsDataAtom);
  const [loading, setLoading] = useAtom(promotionsLoadingAtom);
  const [selectedPromotions, setSelectedPromotions] = useAtom(
    selectedPromotionsAtom
  );
  const [formData, setFormData] = useAtom(promotionFormDataAtom);
  const resetFormData = useSetAtom(resetPromotionFormAtom);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opentModal, setOpenModal] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState("");
  const [typeSubmit, setTypeSubmit] = useState<"create" | "update">("create");

  // Fetch promotions
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await promotionService.getPromotions();
      setPromotions(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPromotions]);

  // Filter promotions
  const filteredPromotions = useMemo(() => {
    let filtered = promotions;
    console;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((promotion) =>
        (promotion?.promotion_name || "").toLowerCase().includes(search)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((promotion) =>
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? promotion.is_active
          : !promotion.is_active
      );
    }

    return filtered;
  }, [promotions, searchTerm, statusFilter]);

  // Selection handlers
  const togglePromotionSelection = useCallback(
    (promotionId: string) => {
      setSelectedPromotions((prev) =>
        prev.includes(promotionId)
          ? prev.filter((id) => id !== promotionId)
          : [...prev, promotionId]
      );
    },
    [setSelectedPromotions]
  );

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedPromotions(
        checked
          ? filteredPromotions.map((promotion) => promotion.promotion_id)
          : []
      );
    },
    [setSelectedPromotions, filteredPromotions]
  );

  // Action handlers
  const handleToggleStatus = useCallback(
    async (promotionId: string) => {
      try {
        await promotionService.togglePromotionStatus(promotionId);
        await fetchPromotions();
      } catch (error) {}
    },
    [fetchPromotions]
  );

  const handleDeletePromotion = useCallback((promotionId: string) => {
    setSelectedPromotionId(promotionId);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await promotionService.deletePromotion(selectedPromotionId);
      await fetchPromotions();
    } catch (error) {}
    setDeleteModalOpen(false);
    setSelectedPromotionId("");
  }, [selectedPromotionId, fetchPromotions]);

  // Batch actions
  const handleBatchActivate = useCallback(async () => {
    try {
      // await promotionService.togglePromotionStatus(selectedPromotionId);
      showToast.info(
        "Chức năng kích hoạt hàng loạt chưa được triển khai. Vui lòng thực hiện từng khuyến mãi."
      );
      await fetchPromotions();
      setSelectedPromotions([]);
    } catch (error) {}
  }, [selectedPromotions, fetchPromotions, setSelectedPromotions]);

  const handleBatchDeactivate = useCallback(async () => {
    try {
      // await promotionService.batchToggleStatus(selectedPromotions);
      showToast.info(
        "Chức năng tắt hàng loạt chưa được triển khai. Vui lòng thực hiện từng khuyến mãi."
      );
      await fetchPromotions();
      setSelectedPromotions([]);
    } catch (error) {}
  }, [selectedPromotions, fetchPromotions, setSelectedPromotions]);

  const handleBatchDelete = useCallback(async () => {
    try {
      // await promotionService.batchDelete(selectedPromotions);
      showToast.info(
        "Chức năng xóa hàng loạt chưa được triển khai. Vui lòng thực hiện từng khuyến mãi."
      );
      setDeleteModalOpen(false);
      setSelectedPromotionId("");
      setSelectedPromotions([]);
      setOpenModal(false);
      await fetchPromotions();
      setSelectedPromotions([]);
    } catch (error) {}
  }, [selectedPromotions, fetchPromotions, setSelectedPromotions]);

  // Statistics
  const stats = useMemo(() => {
    const totalVouchers = promotions.length;
    const activeVouchers = promotions.filter((v) => v.is_active).length;
    const inactiveVouchers = promotions.filter((v) => !v.is_active).length;
    const usedVouchers = 0;

    return { totalVouchers, activeVouchers, inactiveVouchers, usedVouchers };
  }, [promotions]);

  // Get selected promotion name for delete modal
  const selectedPromotionName = useMemo(() => {
    const promotion = promotions.find(
      (v) => v.promotion_id === selectedPromotionId
    );
    return promotion?.promotion_name || "";
  }, [promotions, selectedPromotionId]);

  const handleFormChange = useCallback(
    (
      field: keyof PromotionFormData,
      value: string | number | boolean | Date | null
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [setFormData]
  );

  const handleSubmitForm = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const dataUpdate: UpdatePromotionRequest = {
          promotion_name: formData.promotion_name,
          description: formData.description,
          discount_value: formData.discount_value,
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_active: formData.is_active,
          batch_product_ids: formData.batch_product_ids,
        };
        if (typeSubmit === "update") {
          await promotionService.updatePromotion(
            selectedPromotionId,
            dataUpdate
          );
        } else {
          await promotionService.createPromotion({
            promotion_name: formData?.promotion_name || null,
            description: formData.description,
            discount_value: formData.discount_value || 0,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            is_active: formData.is_active || false,
            batch_product_ids: formData.batch_product_ids || [],
          });
        }
        await fetchPromotions();
      } catch (error) {}
      setTypeSubmit("create");
      resetFormData();
      setOpenModal(false);
      setSelectedPromotionId("");
      setDeleteModalOpen(false);
    },
    [formData, fetchPromotions, setFormData]
  );

  const handleOpenModalCreate = useCallback(() => {
    setOpenModal(true);
    setTypeSubmit("create");
  }, []);

  const handleOpenModalUpdate = useCallback(
    (promotionId: string) => {
      setSelectedPromotionId(promotionId);
      setTypeSubmit("update");
      const promotion = promotions.find((v) => v.promotion_id === promotionId);
      if (promotion) {
        setFormData({
          promotion_name: promotion.promotion_name || "",
          discount_value: promotion.discount_value,
          description: promotion.description || "",
          start_date: promotion.start_date,
          end_date: promotion.end_date,
          is_active: promotion.is_active,
        });
      }
      setOpenModal(true);
    },
    [promotions, setFormData]
  );

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    resetFormData();
  }, [resetFormData]);

  useEffect(() => {
    fetchPromotions();
    resetFormData();
    setOpenModal(false);
    setSelectedPromotionId("");
    setDeleteModalOpen(false);
  }, [fetchPromotions, resetFormData]);

  return (
    <section className="p-4 md:p-6 gap-4 flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý giảm giá</h1>
        <Button
          className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          onClick={handleOpenModalCreate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm giảm giá
        </Button>
      </header>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="card-agricultural">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-[#44703d]">
              Tổng giảm giá
            </CardTitle>
            <Ticket className="h-5 w-5 text-[#74a65d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#44703d]">
              {stats.totalVouchers}
            </div>
            <p className="text-xs text-[#74a65d]">Tất cả giảm giá</p>
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
            <p className="text-xs text-[#74a65d]">Giảm giá có thể sử dụng</p>
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
            <p className="text-xs text-[#74a65d]">Giảm giá không hoạt động</p>
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

      {/* Filters
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
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Đã tắt</option>
        </select>
      </div> */}

      <PromotionFilters
        search={searchTerm}
        status={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearchTerm("");
          setStatusFilter("all");
        }}
      />

      {/* Batch Actions */}
      {/* {selectedPromotions.length > 0 && (
        <div className="mb-4">
          <BatchActions
            selectedCount={selectedPromotions.length}
            onBatchActivate={handleBatchActivate}
            onBatchDeactivate={handleBatchDeactivate}
            onBatchDelete={handleBatchDelete}
          />
        </div>
      )} */}

      {/* Table */}
      <PromotionTable
        promotions={filteredPromotions}
        selectedPromotions={selectedPromotions}
        onSelectPromotion={togglePromotionSelection}
        onSelectAll={toggleSelectAll}
        onToggleStatus={handleToggleStatus}
        onEditPromotion={handleOpenModalUpdate}
        onDeletePromotion={handleDeletePromotion}
        loading={loading}
      />

      {/* Add/Edit Promotion Modal */}
      <PromotionFormModal
        open={opentModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        formData={formData}
        onUpdateFormData={handleFormChange}
        title="Chỉnh sửa voucher"
        submitText="Lưu"
        isEdit
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirm={handleConfirmDelete}
        title="voucher"
        nameDelete={selectedPromotionName}
      />
    </section>
  );
}
