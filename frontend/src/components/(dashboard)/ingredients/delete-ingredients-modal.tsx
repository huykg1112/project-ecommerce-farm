"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIngredient } from "@/hooks/use-ingredient";
import {
  deleteActiveIngredientModalAtom,
  selectedActiveIngredientIdAtom,
} from "@/lib_dashboard/store/active-ingredient-store";
import { useAtom } from "jotai";
import { memo } from "react";

export const DeleteIngredientsModal = memo(() => {
  const [open, setOpen] = useAtom(deleteActiveIngredientModalAtom);
  const [catId] = useAtom(selectedActiveIngredientIdAtom);
  const { deleteIngredient } = useIngredient();

  async function handleConfirm() {
    if (catId) await deleteIngredient(catId);
    setOpen(false);
  }

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
DeleteIngredientsModal.displayName = "DeleteIngredientsModal";
