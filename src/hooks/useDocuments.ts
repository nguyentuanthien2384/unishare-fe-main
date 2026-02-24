import { useQuery } from "@tanstack/react-query";
// TODO: Bỏ comment khi có backend thật
// import api from "@/lib/axios";
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

// TODO: Bỏ mock data khi có backend thật
const mockDocuments: Document[] = [
  {
    _id: "doc-001",
    title: "Bài giảng Phân tích thiết kế phần mềm",
    description: "Slide bài giảng SAD chương 1-5, bao gồm UML, Use Case, Class Diagram.",
    fileUrl: "#",
    fileType: "application/pdf",
    fileSize: 2500000,
    uploader: { _id: "user-001", fullName: "Tran Van A", avatarUrl: "" },
    status: "VISIBLE",
    subject: { _id: "sub-001", name: "Phân tích thiết kế phần mềm", code: "SAD" },
    documentType: "Lecture Notes",
    schoolYear: "2024-2025",
    downloadCount: 128,
    viewCount: 450,
    uploadDate: "2025-01-15T10:00:00.000Z",
  },
  {
    _id: "doc-002",
    title: "Đề thi OOP giữa kỳ 2024",
    description: "Đề thi giữa kỳ môn Lập trình hướng đối tượng kèm đáp án chi tiết.",
    fileUrl: "#",
    fileType: "application/pdf",
    fileSize: 1200000,
    uploader: { _id: "user-002", fullName: "Le Thi B" },
    status: "VISIBLE",
    subject: { _id: "sub-002", name: "Lập trình hướng đối tượng", code: "OOP" },
    documentType: "Exam Paper",
    schoolYear: "2024-2025",
    downloadCount: 256,
    viewCount: 820,
    uploadDate: "2025-02-10T14:30:00.000Z",
  },
  {
    _id: "doc-003",
    title: "Bài tập Cơ sở dữ liệu có lời giải",
    description: "Tổng hợp bài tập SQL, ER Diagram, chuẩn hóa cơ sở dữ liệu.",
    fileUrl: "#",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 3800000,
    uploader: { _id: "user-003", fullName: "Nguyen Van C" },
    status: "VISIBLE",
    subject: { _id: "sub-003", name: "Cơ sở dữ liệu", code: "DB" },
    documentType: "Solved Exercises",
    schoolYear: "2023-2024",
    downloadCount: 89,
    viewCount: 310,
    uploadDate: "2024-12-20T08:00:00.000Z",
  },
  {
    _id: "doc-004",
    title: "Tài liệu Trí tuệ nhân tạo - Machine Learning",
    description: "Giới thiệu ML, Neural Networks, Decision Trees và ứng dụng thực tế.",
    fileUrl: "#",
    fileType: "application/pdf",
    fileSize: 5200000,
    uploader: { _id: "user-001", fullName: "Tran Van A", avatarUrl: "" },
    status: "VISIBLE",
    subject: { _id: "sub-005", name: "Trí tuệ nhân tạo", code: "AI" },
    documentType: "Lecture Notes",
    schoolYear: "2024-2025",
    downloadCount: 312,
    viewCount: 1050,
    uploadDate: "2025-01-28T16:00:00.000Z",
  },
  {
    _id: "doc-005",
    title: "Hướng dẫn thực hành Mạng máy tính",
    description: "Lab thực hành cấu hình router, switch, VLAN, subnetting.",
    fileUrl: "#",
    fileType: "application/pdf",
    fileSize: 1800000,
    uploader: { _id: "user-004", fullName: "Pham Thi D" },
    status: "VISIBLE",
    subject: { _id: "sub-004", name: "Mạng máy tính", code: "NET" },
    documentType: "Tutorial",
    schoolYear: "2024-2025",
    downloadCount: 67,
    viewCount: 200,
    uploadDate: "2025-02-01T09:00:00.000Z",
  },
  {
    _id: "doc-006",
    title: "Đề thi cuối kỳ Cấu trúc dữ liệu 2023",
    description: "Đề thi cuối kỳ DSA gồm phần trắc nghiệm và tự luận.",
    fileUrl: "#",
    fileType: "application/pdf",
    fileSize: 980000,
    uploader: { _id: "user-002", fullName: "Le Thi B" },
    status: "VISIBLE",
    subject: { _id: "sub-006", name: "Cấu trúc dữ liệu và giải thuật", code: "DSA" },
    documentType: "Exam Paper",
    schoolYear: "2023-2024",
    downloadCount: 195,
    viewCount: 620,
    uploadDate: "2024-11-05T11:00:00.000Z",
  },
];

export const useDocuments = (
  sortBy: string,
  sortOrder: string,
  subjectIds: string[],
  search: string,
) => {
  const getDocuments = async (): Promise<DocumentsResponse> => {
    // TODO: Bỏ mock, dùng API thật khi có backend
    // const response = await api.get("/documents", {
    //   params: { sortBy, sortOrder, subjects: subjectIds, search },
    //   paramsSerializer: { indexes: null },
    // });
    // return response.data;

    let filtered = [...mockDocuments];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }

    if (subjectIds.length > 0) {
      filtered = filtered.filter(
        (d) => d.subject?._id && subjectIds.includes(d.subject._id),
      );
    }

    if (sortBy === "downloadCount") {
      filtered.sort((a, b) =>
        sortOrder === "desc"
          ? b.downloadCount - a.downloadCount
          : a.downloadCount - b.downloadCount,
      );
    } else if (sortBy === "uploadDate") {
      filtered.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          : new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime(),
      );
    }

    return {
      data: filtered,
      pagination: { total: filtered.length, page: 1, limit: 10, totalPages: 1 },
    };
  };

  return useQuery({
    queryKey: ["documents", sortBy, sortOrder, subjectIds.join(","), search],
    queryFn: getDocuments,
  });
};
