export interface PlantDiseaseRequest {
  name: string;
  description: string;
}

export interface PlantDiseaseResponse {
  disease: string;
  probability: string;
  label: number;
}

/**
 * Call the local AI model for plant disease prediction
 * @param request Plant information and symptoms
 * @returns Array of disease predictions with probabilities
 */
export const predictPlantDisease = async (
  request: PlantDiseaseRequest
): Promise<PlantDiseaseResponse[]> => {
  try {
    // Call the local AI model at localhost:8000
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as PlantDiseaseResponse[];
  } catch (error) {
    console.error("Error calling plant disease AI model:", error);
    throw new Error("Không thể kết nối đến model AI. Vui lòng thử lại sau.");
  }
};
