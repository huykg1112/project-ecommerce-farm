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

interface DeleteModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleConfirm: () => void;
  title: string;
  nameDelete?: string;
}

export const DeleteModal = memo((props: DeleteModal) => {
  const { open, setOpen, handleConfirm, title, nameDelete } = props;

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
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-[#90c577] text-[#44703d] hover:bg-[#accc8b]/20"
          >
            Huỷ
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Xoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
DeleteModal.displayName = "DeleteModal";
