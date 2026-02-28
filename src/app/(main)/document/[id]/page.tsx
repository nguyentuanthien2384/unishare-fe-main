"use client";

import { useParams, useRouter } from "next/navigation";
import { useDocumentDetail } from "@/hooks/useDocumentDetail";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ClockIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
};

const formatFileType = (mimeType: string) => {
  if (!mimeType) return "FILE";
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("document")) return "DOCX";
  if (mimeType.includes("presentation")) return "PPTX";
  if (mimeType.includes("image")) return "IMG";
  return "FILE";
};

const getFileColor = (mimeType: string) => {
  if (!mimeType) return { bg: "bg-gray-100", text: "text-gray-600", badge: "bg-gray-500" };
  if (mimeType.includes("pdf")) return { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-500" };
  if (mimeType.includes("document")) return { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-500" };
  if (mimeType.includes("presentation")) return { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-500" };
  return { bg: "bg-gray-50", text: "text-gray-600", badge: "bg-gray-500" };
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: doc, isLoading, isError } = useDocumentDetail(id);

  const handleDownload = async () => {
    if (!doc) return;
    const toastId = toast.loading("Đang tải xuống...");
    try {
      const response = await api.get(`/documents/${doc._id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      let filename = doc.title;
      const cd = response.headers["content-disposition"];
      if (cd) {
        const match = cd.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }
      link.setAttribute("download", filename);
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Tải xuống thành công!", { id: toastId });
    } catch {
      toast.error("Tải xuống thất bại.", { id: toastId });
    }
  };

  const handleShare = () => {
    if (!doc) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/document/${doc._id}`)
      .then(() => toast.success("Đã sao chép đường dẫn!"))
      .catch(() => toast.error("Không thể sao chép."));
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !doc) {
    return (
      <main className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center py-20">
          <DocumentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-500 mb-6">
            Tài liệu này có thể đã bị xóa hoặc không tồn tại.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay về trang chủ
          </button>
        </div>
      </main>
    );
  }

  const colors = getFileColor(doc.fileType);
  const uploadDate = new Date(doc.uploadDate);

  return (
    <main className="flex-1 p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* File type banner */}
          <div className={`${colors.bg} px-8 py-10 flex items-center gap-6`}>
            <div className={`w-20 h-20 rounded-2xl ${colors.bg} border-2 border-white shadow-md flex items-center justify-center`}>
              <DocumentIcon className={`w-10 h-10 ${colors.text}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`${colors.badge} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                  {formatFileType(doc.fileType)}
                </span>
                <span className="text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full">
                  {formatFileSize(doc.fileSize)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-8 py-4 border-b border-gray-100 flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Tải xuống
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              <ShareIcon className="w-5 h-5" />
              Chia sẻ
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Description */}
            {doc.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Mô tả
                </h3>
                <p className="text-gray-700 leading-relaxed">{doc.description}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={<AcademicCapIcon className="w-5 h-5" />}
                label="Môn học"
                value={doc.subject?.name || "Chưa phân loại"}
                subValue={doc.subject?.code}
              />
              <InfoItem
                icon={<DocumentIcon className="w-5 h-5" />}
                label="Loại tài liệu"
                value={doc.documentType || "Khác"}
              />
              <InfoItem
                icon={<CalendarDaysIcon className="w-5 h-5" />}
                label="Năm học"
                value={doc.schoolYear || "N/A"}
              />
              <InfoItem
                icon={<ClockIcon className="w-5 h-5" />}
                label="Ngày đăng"
                value={uploadDate.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
                subValue={uploadDate.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <ArrowDownTrayIcon className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold text-gray-900">{doc.downloadCount}</span>
                <span className="text-sm">lượt tải</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <EyeIcon className="w-5 h-5 text-green-500" />
                <span className="text-lg font-bold text-gray-900">{doc.viewCount}</span>
                <span className="text-sm">lượt xem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Uploader Card */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Người đăng
          </h3>
          <Link
            href={`/profile/${doc.uploader?._id || ""}`}
            className="flex items-center gap-4 group"
          >
            {doc.uploader?.avatarUrl ? (
              <img
                src={doc.uploader.avatarUrl}
                alt={doc.uploader.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {(doc.uploader?.fullName || "?").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {doc.uploader?.fullName || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">Xem hồ sơ</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="text-blue-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
      </div>
    </div>
  );
}
