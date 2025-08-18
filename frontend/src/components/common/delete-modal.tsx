"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo } from "react";

import { ChangeEvent, useState } from "react";
interface DeleteModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: (reason: string) => void;
  title: string;
  nameDelete?: string;
  requireReason?: boolean;
}

export const DeleteModal = memo((props: DeleteModal) => {
  const { open, setOpen, handleConfirm, title, nameDelete, requireReason } =
    props;
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const onConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError("Vui lòng nhập lý do xóa tài khoản.");
      return;
    }
    setError("");
    handleConfirm(reason);
  };

  const onChangeReason = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (error && e.target.value.trim()) setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-[#accc8b]">
        <DialogHeader>
          <DialogTitle className="text-[#44703d]">Xác nhận xoá</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#74a65d]">
          Bạn có chắc chắn muốn xoá {title} <strong>"{nameDelete}"</strong>?
          Thao tác không thể hoàn tác.
        </p>
        {requireReason && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#44703d] mb-1">
              Lý do xóa tài khoản <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border rounded p-2 text-sm"
              rows={3}
              value={reason}
              onChange={onChangeReason}
              placeholder="Nhập lý do xóa tài khoản..."
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
          >
            Huỷ
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
DeleteModal.displayName = "DeleteModal";
