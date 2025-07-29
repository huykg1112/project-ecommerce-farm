"use client";

import { DiseaseFilters } from "@/components/(dashboard)/diseases/disease-filters";
import { DiseaseFormModal } from "@/components/(dashboard)/diseases/disease-form-modal";
import { DiseaseTable } from "@/components/(dashboard)/diseases/diseases-table";
import { BatchActions } from "@/components/common/batch-actions";
import { DeleteModal } from "@/components/common/delete-modal";
import { StatisticsCards } from "@/components/common/statistics-cards";
import { Button } from "@/components/ui/button";
import { useDiseases } from "@/hooks/use-diseades";
import { showToast } from "@/lib/toast-provider";
import {
  activeDiseasesFormDataAtom,
  diseaseFiltersAtom,
  selectedDiseasesAtom,
} from "@/lib_dashboard/store/disease-store";
import { DiseaseFormData } from "@/lib_dashboard/types/disease";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export default function DiseasesManagementPage() {
  const [formData, setFormData] = useAtom(activeDiseasesFormDataAtom);
  const [selectedDiseases, setSelectedDiseases] = useAtom(selectedDiseasesAtom);
  const [filters, setFilters] = useAtom(diseaseFiltersAtom);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>("");
  const {
    diseases,
    allDiseasesRef,
    loading,
    refetch,
    getDiseaseById,
    createDisease,
    setDiseases,
    updateDisease,
    updateDiseaseStatus,
    batchUpdateDiseaseStatus,
    deleteDisease,
    deleteDiseases,
  } = useDiseases();

  const stats = useMemo(() => {
    const totalDiseases = diseases.length;
    const activeDiseases = diseases.filter(
      (disease) => disease.is_active
    ).length;
    const inactiveDiseases = allDiseasesRef.current.filter(
      (disease) => !disease.is_active
    ).length;
    return {
      totalDiseases,
      activeDiseases,
      inactiveDiseases,
    };
  }, [allDiseasesRef, diseases]);

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters((prev) => ({ ...prev, search }));
      setDiseases(() =>
        allDiseasesRef.current.filter((disease) =>
          disease.disease_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    },
    [setFilters]
  );
  const handleStatusChange = useCallback(
    (status: string) => {
      setFilters((prev) => ({ ...prev, status }));
      setDiseases(() =>
        allDiseasesRef.current.filter((disease) =>
          status === "all"
            ? true
            : status === "active"
            ? disease.is_active
            : !disease.is_active
        )
      );
    },
    [setFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ search: "", status: "" });
    setSelectedDiseases([]);
    setFormData({
      disease_name: "",
      description: "",
      is_active: true,
    });
    setSelectedDiseaseId("");
    setDiseases(allDiseasesRef.current);
  }, [setFilters, setSelectedDiseases, setFormData, setSelectedDiseaseId]);

  const handleSelectDisease = useCallback(
    (diseaseId: string) => {
      setSelectedDiseases((prev) =>
        prev.includes(diseaseId)
          ? prev.filter((id) => id !== diseaseId)
          : [...prev, diseaseId]
      );
    },
    [setSelectedDiseases]
  );
  const handleSelectAllDiseases = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedDiseases(diseases.map((d) => d.disease_id));
      } else {
        setSelectedDiseases([]);
      }
    },
    [diseases, setSelectedDiseases]
  );

  const handleCreateDisease = useCallback(async () => {
    const success = await createDisease(formData);
    if (success) {
      setOpenAddModal(false);
      setFormData({
        disease_name: "",
        description: "",
        is_active: true,
      });
      refetch();
    }
  }, [createDisease, formData, refetch, setFormData, setOpenAddModal]);

  const handleUpdateDisease = useCallback(async () => {
    if (!selectedDiseaseId) {
      showToast.error("Vui lòng chọn một bệnh để cập nhật");
      return;
    }
    const success = await updateDisease(selectedDiseaseId, formData);
    if (success) {
      setOpenEditModal(false);
      setFormData({
        disease_name: "",
        description: "",
        is_active: true,
      });
      setSelectedDiseaseId("");
      refetch();
    }
  }, [
    updateDisease,
    formData,
    refetch,
    setFormData,
    setOpenEditModal,
    selectedDiseaseId,
    setSelectedDiseaseId,
  ]);
  const handleDeleteDisease = useCallback(async () => {
    if (!selectedDiseaseId) {
      showToast.error("Vui lòng chọn một bệnh để xóa");
      return false;
    }
    const success = await deleteDisease(selectedDiseaseId);
    if (success) {
      setOpenDeleteModal(false);
      setSelectedDiseaseId("");
      setSelectedDiseases((prev) =>
        prev.filter((id) => id !== selectedDiseaseId)
      );
      // refetch();
    }
    return success;
  }, [
    deleteDisease,
    selectedDiseaseId,
    setSelectedDiseases,
    setOpenDeleteModal,
    setSelectedDiseaseId,
  ]);

  const handleToggleStatus = useCallback(
    async (diseaseId: string) => {
      const success = await updateDiseaseStatus(diseaseId);
      if (success) {
        refetch();
      }
    },
    [updateDiseaseStatus, refetch]
  );

  const handleBatchUpdateStatusActivate = useCallback(async () => {
    if (selectedDiseases.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một bệnh để cập nhật trạng thái");
      return false;
    }
    try {
      await batchUpdateDiseaseStatus(true);
      setSelectedDiseases([]);
      refetch();
      return true;
    } catch (error) {
      return false;
    }
  }, [
    selectedDiseases,
    batchUpdateDiseaseStatus,
    setSelectedDiseases,
    refetch,
  ]);

  const handleBatchUpdateStatusDeactivate = useCallback(async () => {
    if (selectedDiseases.length === 0) {
      showToast.error("Vui lòng chọn ít nhất một bệnh để cập nhật trạng thái");
      return false;
    }
    try {
      await batchUpdateDiseaseStatus(false);
      setSelectedDiseases([]);
      refetch();
      return true;
    } catch (error) {
      return false;
    }
  }, [
    selectedDiseases,
    batchUpdateDiseaseStatus,
    setSelectedDiseases,
    refetch,
  ]);

  const handleDeleteDiseases = useCallback(async () => {
    try {
      await deleteDiseases();
      setSelectedDiseases([]);
      refetch();
      return true;
    } catch (error) {
      return false;
    }
  }, [deleteDiseases, selectedDiseases, setSelectedDiseases, refetch]);

  const handOpenAddModal = useCallback(() => {
    setFormData({
      disease_name: "",
      description: "",
      is_active: true,
    });
    setOpenAddModal(true);
  }, [setFormData]);

  const handOpenEditModal = useCallback(
    (diseaseId: string) => {
      const disease = allDiseasesRef.current.find(
        (d) => d.disease_id === diseaseId
      );
      if (disease) {
        setFormData({
          disease_name: disease.disease_name,
          description: disease.description,
          is_active: disease.is_active,
        });
        setSelectedDiseaseId(diseaseId);
        setOpenEditModal(true);
      } else {
        showToast.error("Không tìm thấy bệnh để chỉnh sửa");
      }
    },
    [getDiseaseById, setFormData]
  );

  const handleOpenDeleteModal = useCallback(
    (diseaseId: string) => {
      setSelectedDiseaseId(diseaseId);
      setOpenDeleteModal(true);
    },
    [setOpenDeleteModal]
  );

  const handleCloseModals = useCallback(() => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setSelectedDiseaseId("");
    setFormData({
      disease_name: "",
      description: "",
      is_active: true,
    });
  }, []);

  return (
    <section className="p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[#44703d]">Quản lý bệnh</h1>
        <Button
          className="bg-[#90c577] hover:bg-[#74a65d] text-white"
          onClick={handOpenAddModal}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm bệnh
        </Button>
      </header>

      {/* Statistics Cards */}
      <StatisticsCards
        stats={{
          total: stats.totalDiseases,
          active: stats.activeDiseases,
          inactive: stats.inactiveDiseases,
        }}
        title="bệnh"
      />

      {/* Filters */}
      <div className="mb-6">
        <DiseaseFilters
          search={filters.search || ""}
          status={filters.status || ""}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Batch Actions */}
      {selectedDiseases.length > 0 && (
        <div className="mb-4">
          <BatchActions
            selectedCount={selectedDiseases.length}
            onBatchActivate={handleBatchUpdateStatusActivate}
            onBatchDeactivate={handleBatchUpdateStatusDeactivate}
            onBatchDelete={handleDeleteDiseases}
            loading={loading}
            title="bệnh"
          />
        </div>
      )}

      {/* Table */}
      <div className="mb-6">
        <DiseaseTable
          diseases={diseases}
          selectedDiseases={selectedDiseases}
          onSelectDisease={handleSelectDisease}
          onSelectAll={handleSelectAllDiseases}
          onToggleStatus={handleToggleStatus}
          onEditDisease={handOpenEditModal}
          onDeleteDisease={handleOpenDeleteModal}
        />
      </div>

      {/* Modals Create */}
      <DiseaseFormModal
        open={openAddModal}
        title="Thêm bệnh mới"
        submitText="Tạo mới"
        onClose={handleCloseModals}
        formData={formData}
        onUpdateFormData={(data: Partial<DiseaseFormData>) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSubmit={handleCreateDisease}
      />

      {/* Modals Edit */}
      <DiseaseFormModal
        open={openEditModal}
        title="Chỉnh sửa bệnh"
        submitText="Lưu thay đổi"
        isEdit
        onClose={handleCloseModals}
        formData={formData}
        onUpdateFormData={(data: Partial<DiseaseFormData>) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSubmit={handleUpdateDisease}
      />

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        handleConfirm={handleDeleteDisease}
        title="Xóa bệnh"
        nameDelete={
          diseases.find((d) => d.disease_id === selectedDiseaseId)
            ?.disease_name || ""
        }
      />
    </section>
  );
}
