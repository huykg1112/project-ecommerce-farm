import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteModalProps {
  open: boolean;
  handleConfirm: () => Promise<boolean>;
  setOpen: (open: boolean) => void;
  title: string;
  nameDelete?: string;
}

export default function DeleteModal({
  open,
  handleConfirm,
  setOpen,
  title,
  nameDelete,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await handleConfirm();
      if (success) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa{" "}
            {nameDelete ? `"${nameDelete}"` : "mục này"} không?
            <br />
            <span className="text-red-500 font-medium">
              Hành động này không thể hoàn tác.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
