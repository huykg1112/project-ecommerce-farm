export interface LoginFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string | string[] | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

export interface RegisterFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error: string | string[] | null;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setActiveTab: (tab: string) => void;
}

export interface UserAuthSectionProps {
  isScrolled: boolean;
}
