import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ApiErrorResponse {
  message?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

const useInvalidateAdminDocs = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["adminDocuments"] });
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };
};

const blockDocument = async (docId: string) => {
  return api.post(`/admin/documents/${docId}/block`);
};
export const useBlockDocument = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: blockDocument,
    onSuccess: () => {
      toast.success("Đã block tài liệu!");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Block thất bại")),
  });
};

const unblockDocument = async (docId: string) => {
  return api.post(`/admin/documents/${docId}/unblock`);
};
export const useUnblockDocument = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: unblockDocument,
    onSuccess: () => {
      toast.success("Đã unblock tài liệu!");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Unblock thất bại")),
  });
};

const deleteDocument = async (docId: string) => {
  return api.delete(`/admin/documents/${docId}`);
};
export const useDeleteDocumentAdmin = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success("Đã xóa vĩnh viễn tài liệu!");
      invalidate();
    },
    onError: (err: unknown) =>
      toast.error(getErrorMessage(err, "Xóa thất bại")),
  });
};
