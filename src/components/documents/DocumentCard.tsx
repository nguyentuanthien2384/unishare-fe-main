"use client";
import { useState } from "react";
import { Document } from "@/@types/document.type";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FlagIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentCardProps {
  doc: Document;
  viewMode: "grid" | "list";
}

const formatDownloads = (num: number) => {
  if (!num) return 0;
  if (num < 1000) return num;
  return (num / 1000).toFixed(1) + "K";
};
const formatFileType = (mimeType: string) => {
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("document")) return "DOCX";
  if (mimeType.includes("presentation")) return "PPTX";
  if (mimeType.includes("image")) return "IMG";
  return "FILE";
};

export default function DocumentCard({ doc, viewMode }: DocumentCardProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner = user && doc.uploader?._id === user._id;
  const isAdminOrMod =
    user?.role === "ADMIN" || user?.role === "MODERATOR";
  const canDelete = isOwner || isAdminOrMod;

  const handlePreview = () => {
    window.open(`/document/${doc._id}`, "_blank");
  };

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/document/${doc._id}`;
    const textArea = document.createElement("textarea");
    textArea.value = publicUrl;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Đã sao chép đường dẫn thành công!");
    } catch {
      toast.error("Không thể sao chép đường dẫn.");
    }
    document.body.removeChild(textArea);
  };

  const handleDownload = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tải xuống tài liệu.");
      return;
    }
    const downloadToastId = toast.loading("Đang tải xuống...");
    try {
      const response = await api.get(`/documents/${doc._id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      let filename = doc.title;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Tải xuống thành công!", { id: downloadToastId });
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { id: downloadToastId });
        useAuthStore.getState().logout();
      } else {
        toast.error("Tải xuống thất bại.", { id: downloadToastId });
      }
    }
  };

  const handleReport = () => {
    toast("Tính năng Report (Báo cáo) đang được phát triển!", { icon: "🚧" });
  };

  const handleDelete = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này.");
      setIsDeleteOpen(false);
      return;
    }
    const toastId = toast.loading("Đang xóa tài liệu...");
    try {
      if (isAdminOrMod && !isOwner) {
        await api.delete(`/admin/documents/${doc._id}`);
      } else {
        await api.delete(`/documents/${doc._id}`);
      }
      toast.success("Đã xóa tài liệu thành công!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", { id: toastId });
        useAuthStore.getState().logout();
      } else {
        const msg =
          err?.response?.data?.message || "Xóa tài liệu thất bại.";
        toast.error(Array.isArray(msg) ? msg[0] : msg, { id: toastId });
      }
    }
    setIsDeleteOpen(false);
  };

  const cardContent =
    viewMode === "list" ? (
      <ListLayout
        doc={doc}
        onPreview={handlePreview}
        onShare={handleShare}
        onDownload={handleDownload}
        onReport={handleReport}
        onDelete={canDelete ? () => setIsDeleteOpen(true) : undefined}
      />
    ) : (
      <GridLayout
        doc={doc}
        onPreview={handlePreview}
        onShare={handleShare}
        onDownload={handleDownload}
        onReport={handleReport}
        onDelete={canDelete ? () => setIsDeleteOpen(true) : undefined}
      />
    );

  return (
    <>
      {cardContent}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa tài liệu"
        message={`Bạn có chắc chắn muốn xóa tài liệu "${doc.title}"? Hành động này không thể hoàn tác.`}
      />
    </>
  );
}

interface LayoutProps {
  doc: Document;
  onPreview: () => void;
  onShare: () => void;
  onDownload: () => void;
  onReport: () => void;
  onDelete?: () => void;
}

const GridLayout = ({
  doc,
  onPreview,
  onShare,
  onDownload,
  onReport,
  onDelete,
}: LayoutProps) => (
  <div className="relative p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
    <Link href={`/document/${doc._id}`} className="block">
      <div className="h-32 flex items-center justify-center bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-blue-800 uppercase bg-blue-100 rounded">
          {formatFileType(doc.fileType || "application/pdf")}
        </span>
        <DocumentIcon className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="mt-4 text-lg font-semibold truncate text-gray-900 group-hover:text-blue-600 transition-colors">
        {doc.title}
      </h3>
      <p className="h-10 mt-1 text-sm text-gray-600 overflow-hidden text-ellipsis">
        {doc.description}
      </p>
    </Link>
    <div className="absolute top-4 right-4 z-10">
      <DocumentMenu
        onPreview={onPreview}
        onShare={onShare}
        onDownload={onDownload}
        onReport={onReport}
        onDelete={onDelete}
      />
    </div>
    <div className="flex gap-2 mt-3">
      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
        {doc.subject?.name || "General"}
      </span>
      <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
        {doc.documentType || "File"}
      </span>
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center text-sm text-gray-500">
        <Link
          href={`/profile/${doc.uploader?._id || ""}`}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600 group/uploader"
        >
          <span className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-semibold bg-green-200 rounded-full text-green-700">
            {(doc.uploader?.fullName || "??").substring(0, 2).toUpperCase()}
          </span>
          <span>{doc.uploader?.fullName || "Unknown"}</span>
        </Link>
      </div>
      <span className="flex items-center text-sm font-medium text-gray-600">
        <ArrowDownTrayIcon className="inline w-4 h-4 mr-1" />
        {formatDownloads(doc.downloadCount)}
      </span>
    </div>
  </div>
);

const ListLayout = ({
  doc,
  onPreview,
  onShare,
  onDownload,
  onReport,
  onDelete,
}: LayoutProps) => (
  <div className="relative flex items-center w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
    <Link href={`/document/${doc._id}`} className="flex items-center flex-1">
      <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
        <DocumentIcon className="w-8 h-8 text-blue-500" />
      </div>
      <div className="flex-1 mx-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {doc.title}
        </h3>
        <p className="text-sm text-gray-600">{doc.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
          <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
            {doc.subject?.name || "General"}
          </span>
          <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
            {doc.documentType || "File"}
          </span>
          <span className="flex items-center">
            <span className="flex items-center justify-center w-5 h-5 mr-1 text-xs font-semibold bg-green-200 rounded-full text-green-700">
              {(doc.uploader?.fullName || "??").substring(0, 2).toUpperCase()}
            </span>
            {doc.uploader?.fullName || "Unknown"}
          </span>
          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
          <span>{formatDownloads(doc.downloadCount)} DLs</span>
          <span>{formatFileType(doc.fileType)}</span>
          <span>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      </div>
    </Link>
    <div className="absolute top-4 right-4 z-10">
      <DocumentMenu
        onPreview={onPreview}
        onShare={onShare}
        onDownload={onDownload}
        onReport={onReport}
        onDelete={onDelete}
      />
    </div>
  </div>
);

const DocumentMenu = ({
  onPreview,
  onShare,
  onDownload,
  onReport,
  onDelete,
}: Omit<LayoutProps, "doc">) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onPreview}
                className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                <EyeIcon className="w-5 h-5 mr-3" />
                Xem trước
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDownload}
                className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-3" />
                Tải xuống
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onShare}
                className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                <ShareIcon className="w-5 h-5 mr-3" />
                Chia sẻ
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onReport}
                className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
              >
                <FlagIcon className="w-5 h-5 mr-3" />
                Báo cáo
              </button>
            )}
          </Menu.Item>
          {onDelete && (
            <>
              <div className="my-1 h-px bg-gray-100" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDelete}
                    className={`${active ? "bg-red-50" : ""} group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                  >
                    <TrashIcon className="w-5 h-5 mr-3" />
                    Xóa tài liệu
                  </button>
                )}
              </Menu.Item>
            </>
          )}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);
