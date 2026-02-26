import { toast } from "react-hot-toast";
import { useAdminStore } from "@/store/admin.store";
import { useCallback } from "react";

export const useBlockDocument = () => {
  const blockDoc = useAdminStore((s) => s.blockDocument);
  return {
    mutate: (docId: string) => {
      blockDoc(docId);
      toast.success("Đã block tài liệu!");
    },
    isPending: false,
  };
};

export const useUnblockDocument = () => {
  const unblockDoc = useAdminStore((s) => s.unblockDocument);
  return {
    mutate: (docId: string) => {
      unblockDoc(docId);
      toast.success("Đã unblock tài liệu!");
    },
    isPending: false,
  };
};

export const useDeleteDocumentAdmin = () => {
  const deleteDoc = useAdminStore((s) => s.deleteDocument);
  const mutate = useCallback(
    (docId: string) => {
      deleteDoc(docId);
      toast.success("Đã xóa vĩnh viễn tài liệu!");
    },
    [deleteDoc],
  );
  return { mutate, isPending: false };
};
