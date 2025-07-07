"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/use-categories";
import {
  deleteCategoryModalAtom,
  selectedCategoryIdAtom,
} from "@/lib_dashboard/store/category-store";
import { useAtom } from "jotai";
import { memo, useCallback } from "react";

export const DeleteCategoryModal = memo(() => {
  const [open, setOpen] = useAtom(deleteCategoryModalAtom);
  const [catId] = useAtom(selectedCategoryIdAtom);
  const { deleteCategory } = useCategories();

  const handleConfirm = useCallback(async () => {
    if (catId) await deleteCategory(catId);
    setOpen(false);
  }, [catId, deleteCategory, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-[#accc8b]">
        <DialogHeader>
          <DialogTitle className="text-[#44703d]">Xác nhận xoá</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#74a65d]">
          Bạn có chắc chắn muốn xoá danh mục này? Thao tác không thể hoàn tác.
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
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
DeleteCategoryModal.displayName = "DeleteCategoryModal";
