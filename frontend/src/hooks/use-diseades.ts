"use client";

import { showToast } from "@/lib/toast-provider";
import { diseaseServiceManagement } from "@/lib_dashboard/services/disease-service-management";
import {
  diseaseFiltersAtom,
  diseasesDataAtom,
  selectedDiseasesAtom,
} from "@/lib_dashboard/store/disease-store";
import {
  DiseaseCreateData,
  DiseaseFormData,
  DiseaseTableData,
} from "@/lib_dashboard/types/disease";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

export function useDiseases() {
  const [filters, setFilters] = useAtom(diseaseFiltersAtom);
  const [selectedDiseases, setSelectedDiseases] = useAtom(selectedDiseasesAtom);
  const [diseases, setDiseases] = useAtom(diseasesDataAtom);
  const [loading, setLoading] = useState<boolean>(false);

  const allDiseasesRef = useRef<DiseaseTableData[]>([]);

  const fetchDiseases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await diseaseServiceManagement.getDiseases();
      allDiseasesRef.current = data;
      console.log("Fetched diseases:", allDiseasesRef.current);
      setFilters({ search: "", status: "" }); // Reset filters on fetch
      setSelectedDiseases([]); // Reset selected diseases
      setDiseases(allDiseasesRef.current);
    } catch (error) {
      showToast.error("Không thể tải danh sách bệnh");
    } finally {
      setLoading(false);
    }
  }, [setFilters, setSelectedDiseases, setDiseases]);

  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  const getDiseaseById = useCallback(async (id: string) => {
    try {
      const disease = await diseaseServiceManagement.getDiseaseById(id);
      return disease as DiseaseFormData;
    } catch (error) {
      showToast.error("Không thể tải thông tin bệnh");
      return null;
    }
  }, []);

  const createDisease = useCallback(
    async (data: DiseaseCreateData) => {
      try {
        const newDisease = await diseaseServiceManagement.createDisease(data);
        setDiseases((prev) => [...prev, newDisease]);
        showToast.success("Bệnh đã được thêm thành công");
        return true;
      } catch (error) {
        showToast.error("Không thể thêm bệnh");
        return false;
      }
    },
    [showToast, setDiseases]
  );

  const updateDisease = useCallback(
    async (id: string, data: DiseaseFormData) => {
      try {
        const updatedDisease = await diseaseServiceManagement.updateDisease(
          id,
          data
        );
        setDiseases((prev) =>
          prev.map((disease) =>
            disease.disease_id === id ? updatedDisease : disease
          )
        );
        showToast.success(
          `${updatedDisease.disease_name} đã được cập nhật thành công`
        );
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật bệnh");
        return false;
      }
    },
    [setDiseases, showToast]
  );

  const updateDiseaseStatus = useCallback(
    async (id: string) => {
      try {
        const updatedDisease =
          await diseaseServiceManagement.updateDiseaseStatus(id);
        setDiseases((prev) =>
          prev.map((disease) =>
            disease.disease_id === id ? updatedDisease : disease
          )
        );
        showToast.success("Trạng thái bệnh đã được cập nhật");
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái bệnh");
        return false;
      }
    },
    [setDiseases, showToast]
  );

  const batchUpdateDiseaseStatus = useCallback(
    async (isActive: boolean) => {
      try {
        await diseaseServiceManagement.batchUpdateStatus(
          selectedDiseases,
          isActive
        );
        showToast.success(
          `Trạng thái của ${selectedDiseases.length} bệnh đã được cập nhật thành công`
        );
        return true;
      } catch (error) {
        showToast.error("Không thể cập nhật trạng thái bệnh hàng loạt");
        return false;
      }
    },
    [selectedDiseases, showToast]
  );

  const deleteDisease = useCallback(async (id: string) => {
    try {
      await diseaseServiceManagement.deleteDisease(id);
      setDiseases((prev) =>
        prev.filter((disease) => disease.disease_id !== id)
      );
      showToast.success("Bệnh đã được xóa thành công");
      return true;
    } catch (error) {
      showToast.error("Không thể xóa bệnh");
      return false;
    }
  }, []);

  const deleteDiseases = useCallback(async () => {
    try {
      await Promise.all(
        selectedDiseases.map((id) => diseaseServiceManagement.deleteDisease(id))
      );
      setDiseases((prev) =>
        prev.filter((disease) => !selectedDiseases.includes(disease.disease_id))
      );
      setSelectedDiseases([]);
      showToast.success("Các bệnh đã được xóa thành công");
      fetchDiseases();
      return true;
    } catch (error) {
      showToast.error("Không thể xóa các bệnh đã chọn");
      return false;
    }
  }, [selectedDiseases, setDiseases, setSelectedDiseases, fetchDiseases]);

  return {
    diseases,
    allDiseasesRef,
    loading,
    refetch: fetchDiseases,
    getDiseaseById,
    createDisease,
    setDiseases,
    updateDisease,
    updateDiseaseStatus,
    batchUpdateDiseaseStatus,
    deleteDisease,
    deleteDiseases,
  };
}
