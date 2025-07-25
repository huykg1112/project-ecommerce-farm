import { AIConsultationInfo } from "@/lib_dashboard/types/pest-analysis";

export interface ConsultationHistory {
  id: string;
  consultation: AIConsultationInfo;
  timestamp: number;
  date: string;
}

export interface UserConsultationHistory {
  consultations: ConsultationHistory[];
  lastUpdated: number;
}

const STORAGE_KEY_PREFIX = "consultation_history_";

/**
 * Lưu kết quả tư vấn mới vào localStorage
 */
export const saveConsultationToHistory = (
  userId: string,
  consultation: AIConsultationInfo
): void => {
  try {
    if (!userId || !consultation) return;

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const existingHistory = getUserConsultationHistory(userId);

    const newConsultation: ConsultationHistory = {
      id: generateConsultationId(),
      consultation,
      timestamp: Date.now(),
      date: new Date().toISOString(),
    };

    const updatedHistory: UserConsultationHistory = {
      consultations: [newConsultation, ...existingHistory.consultations].slice(
        0,
        50
      ), // Giữ tối đa 50 lịch sử
      lastUpdated: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));

    console.log("✅ Đã lưu lịch sử tư vấn vào localStorage");
  } catch (error) {
    console.error("❌ Lỗi khi lưu lịch sử tư vấn:", error);
  }
};

/**
 * Lấy toàn bộ lịch sử tư vấn của user
 */
export const getUserConsultationHistory = (
  userId: string
): UserConsultationHistory => {
  try {
    if (!userId) return { consultations: [], lastUpdated: 0 };

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const data = localStorage.getItem(storageKey);

    if (!data) return { consultations: [], lastUpdated: 0 };

    const history: UserConsultationHistory = JSON.parse(data);
    return history;
  } catch (error) {
    console.error("❌ Lỗi khi đọc lịch sử tư vấn:", error);
    return { consultations: [], lastUpdated: 0 };
  }
};

/**
 * Lấy một tư vấn cụ thể theo ID
 */
export const getConsultationById = (
  userId: string,
  consultationId: string
): ConsultationHistory | null => {
  try {
    const history = getUserConsultationHistory(userId);
    return history.consultations.find((c) => c.id === consultationId) || null;
  } catch (error) {
    console.error("❌ Lỗi khi tìm tư vấn:", error);
    return null;
  }
};

/**
 * Xóa một tư vấn khỏi lịch sử
 */
export const deleteConsultationFromHistory = (
  userId: string,
  consultationId: string
): boolean => {
  try {
    if (!userId || !consultationId) return false;

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const history = getUserConsultationHistory(userId);

    const updatedConsultations = history.consultations.filter(
      (c) => c.id !== consultationId
    );

    const updatedHistory: UserConsultationHistory = {
      consultations: updatedConsultations,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));

    console.log("✅ Đã xóa tư vấn khỏi lịch sử");
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi xóa tư vấn:", error);
    return false;
  }
};

/**
 * Xóa toàn bộ lịch sử của user
 */
export const clearUserConsultationHistory = (userId: string): boolean => {
  try {
    if (!userId) return false;

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    localStorage.removeItem(storageKey);

    console.log("✅ Đã xóa toàn bộ lịch sử tư vấn");
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi xóa lịch sử:", error);
    return false;
  }
};

/**
 * Tạo ID duy nhất cho consultation
 */
const generateConsultationId = (): string => {
  return `consultation_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

/**
 * Format ngày tháng hiển thị
 */
export const formatConsultationDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Lấy thống kê lịch sử
 */
export const getConsultationStats = (userId: string) => {
  const history = getUserConsultationHistory(userId);
  const consultations = history.consultations;

  return {
    total: consultations.length,
    thisMonth: consultations.filter((c) => {
      const consultationDate = new Date(c.timestamp);
      const now = new Date();
      return (
        consultationDate.getMonth() === now.getMonth() &&
        consultationDate.getFullYear() === now.getFullYear()
      );
    }).length,
    diseaseTypes: [
      ...new Set(consultations.map((c) => c.consultation.disease_name)),
    ].length,
    cropTypes: [...new Set(consultations.map((c) => c.consultation.crop_type))]
      .length,
  };
};
