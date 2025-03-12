import { Input } from "@/components/ui/input";
import { PasswordInputProps } from "@/interfaces";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  id,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={toggleShowPassword}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
