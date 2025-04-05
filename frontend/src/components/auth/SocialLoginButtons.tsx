import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SocialLoginButtonsProps {
  handleGoogleLogin: () => void;
}

export default function SocialLoginButtons({
  handleGoogleLogin,
}: SocialLoginButtonsProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            Hoặc đăng nhập với
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <Image
            src="/icons/google.svg"
            width={20}
            height={20}
            alt="Google"
            className="mr-2"
          />
          Google
        </Button>
        <Button variant="outline" className="w-full">
          <Image
            src="/icons/facebook.svg"
            width={20}
            height={20}
            alt="Facebook"
            className="mr-2"
          />
          Facebook
        </Button>
      </div>
    </div>
  );
}
