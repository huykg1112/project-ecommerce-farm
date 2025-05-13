"use client";

import DealerInfoStep from "@/components/register-dealer/dealer-info-step";
import IntroductionStep from "@/components/register-dealer/introduction-step";
import PersonalInfoStep from "@/components/register-dealer/personal-info-step";
import SuccessStep from "@/components/register-dealer/success-step";
import TermsStep from "@/components/register-dealer/terms-step";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { UpdateProfileDto } from "@/interfaces";
import { userService } from "@/lib/services/user-service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterDealerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      idNumber: "",
      businessLicense: "",
    },
    dealerInfo: {
      dealerName: "",
      address: {
        fullAddress: "",
        latitude: 0,
        longitude: 0,
        street: "",
        ward: "",
        district: "",
        city: "",
        notes: "",
      },
      image: null as File | null,
      imagePreview: "",
    },
    termsAccepted: false,
  });

  const router = useRouter();
  const { toast } = useToast();
  let user: UpdateProfileDto;

  // fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        if (data) {
          user = data;
          setFormData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              fullName: user.fullName || "",
              email: user.email || "",
              phone: user.phone || "",
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          dealerInfo: {
            ...prev.dealerInfo,
            address: {
              ...prev.dealerInfo.address,
              latitude,
              longitude,
            },
          },
        }));
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Kiểm tra trạng thái hoàn thành của bước hiện tại
  useEffect(() => {
    checkStepCompletion(currentStep);
  }, [currentStep, formData]);

  const checkStepCompletion = (step: number) => {
    switch (step) {
      case 1: // Giới thiệu
        setIsStepCompleted(true);
        break;
      case 2: // Thông tin cá nhân
        const { fullName, email, phone, idNumber, businessLicense } =
          formData.personalInfo;
        setIsStepCompleted(
          !!fullName && !!email && !!phone && !!idNumber && !!businessLicense
        );
        break;
      case 3: // Thông tin đại lý
        const { dealerName, address, image } = formData.dealerInfo;
        setIsStepCompleted(!!dealerName && !!address.fullAddress && !!image);
        break;
      case 4: // Điều khoản
        setIsStepCompleted(formData.termsAccepted);
        break;
      default:
        setIsStepCompleted(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Mô phỏng gửi dữ liệu lên server
      console.log("Submitting dealer registration:", formData);

      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Chuyển đến bước thành công
      setCurrentStep(5);

      toast({
        title: "Đăng ký thành công",
        description:
          "Yêu cầu đăng ký đại lý của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn sớm.",
      });
    } catch (error) {
      console.error("Error submitting dealer registration:", error);
      toast({
        title: "Đăng ký thất bại",
        description: "Đã xảy ra lỗi khi gửi đăng ký. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] || {}),
        ...data,
      },
    }));
  };

  // Tính toán phần trăm tiến độ
  const progressPercentage = ((currentStep - 1) / 4) * 100;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">
          Đăng ký trở thành đại lý
        </h1>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>Bắt đầu</span>
          <span>Hoàn thành</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {currentStep === 1 && <IntroductionStep />}

        {currentStep === 2 && (
          <PersonalInfoStep
            data={formData.personalInfo}
            updateData={(data) => updateFormData("personalInfo", data)}
          />
        )}

        {currentStep === 3 && (
          <DealerInfoStep
            data={formData.dealerInfo}
            updateData={(data) => updateFormData("dealerInfo", data)}
          />
        )}

        {currentStep === 4 && (
          <TermsStep
            termsAccepted={formData.termsAccepted}
            updateTermsAccepted={(accepted) =>
              updateFormData("termsAccepted", accepted)
            }
          />
        )}

        {currentStep === 5 && <SuccessStep />}
      </div>

      <div className="flex justify-between">
        {currentStep > 1 && currentStep < 5 && (
          <Button onClick={handleBack} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        )}

        {currentStep === 1 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="opacity-0 pointer-events-none"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        )}

        {currentStep < 4 && (
          <Button onClick={handleNext} disabled={!isStepCompleted}>
            Tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        {currentStep === 4 && (
          <Button
            onClick={handleSubmit}
            disabled={!isStepCompleted}
            className="bg-green-600 hover:bg-green-700"
          >
            Hoàn thành đăng ký
          </Button>
        )}

        {currentStep === 5 && (
          <Button onClick={() => router.push("/")} className="ml-auto">
            Về trang chủ
          </Button>
        )}
      </div>
    </div>
  );
}
