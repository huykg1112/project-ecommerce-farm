import { showToast } from "@/lib/toast-provider";
import axios from "axios";
import {
  AiConsultation,
  AIConsultationCreateRequest,
  AIConsultationResponse,
} from "../types/ai-consultation";
import { axiosInstance } from "./axios-instance";

export const ai_ConsultationServiceManagement = {
  async createAIConsultation(
    createAiConsultationDto: AIConsultationCreateRequest
  ) {
    try {
      const response = await axiosInstance.post(
        "/ai-consultation",
        createAiConsultationDto
      );
      console.log("Response data:", response.data);
      return response.data as AIConsultationResponse;
    } catch (error) {
      let msg = "Lỗi khi tạo tư vấn AI";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async getMYconsultations() {
    try {
      const response = await axiosInstance.get(
        "/ai-consultation/my-consultations"
      );
      return response.data as AiConsultation[];
    } catch (error) {
      let msg = "Lỗi khi lấy danh sách tư vấn AI của người dùng";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
  async getByDiseaseName(diseaseName: string) {
    try {
      const response = await axiosInstance.get(
        `/ai-consultation/disease-name?diseaseName=${diseaseName}`
      );
      return response.data as AiConsultation[];
    } catch (error) {
      let msg = "Lỗi khi lấy tư vấn AI theo tên bệnh";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast.error(msg);
      throw error;
    }
  },
};
