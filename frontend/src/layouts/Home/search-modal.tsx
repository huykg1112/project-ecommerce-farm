"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Camera, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({
  isOpen,
  onOpenChange,
}: SearchModalProps) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      onOpenChange(false);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tìm kiếm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-16"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary-dark">
              Tìm kiếm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
