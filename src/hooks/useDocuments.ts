import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Document } from "@/@types/document.type";

interface DocumentsResponse {
  data: Document[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- CẬP NHẬT THAM SỐ: THÊM `search` ---
export const useDocuments = (
  sortBy: string,
  sortOrder: string,
  subjectIds: string[],
  search: string, // <-- THAM SỐ MỚI
) => {
  const getDocuments = async (): Promise<DocumentsResponse> => {
    console.log("🚀 [API CALL] Fetching documents with filters:", {
      sortBy,
      sortOrder,
      subjects: subjectIds,
      search: search, // <-- LOG MỚI
    });

    const response = await api.get("/documents", {
      params: {
        sortBy,
        sortOrder,
        subjects: subjectIds,
        search: search, // <-- GỬI ĐI API
      },
      paramsSerializer: {
        indexes: null,
      },
    });
    console.log("✅ [API CALL] Success:", response.data.data.length, "results");
    return response.data;
  };

  return useQuery({
    queryKey: ["documents", sortBy, sortOrder, subjectIds.join(","), search],
    queryFn: getDocuments,
  });
};
