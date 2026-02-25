"use client";
import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useMyDocuments } from "@/hooks/useMyDocuments";
import { Document } from "@/@types/document.type";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useDeleteDocument } from "@/hooks/useMutateDocument";
import EditDocumentModal from "@/components/profile/EditDocumentModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useAuthStore } from "@/store/auth.store";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";

// --- TÁCH COMPONENT MyDocumentListItem RA ---
interface MyDocumentListItemProps {
  doc: Document;
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

function MyDocumentListItem({
  doc,
  onEdit,
  onDelete,
}: MyDocumentListItemProps) {
  // Lỗi "General" là do hook `useMyDocuments` chưa populate
  // Chúng ta sẽ sửa hook đó
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h3 className="text-lg font-semibold text-blue-700">{doc.title}</h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span>{doc.subject?.name || "Chưa phân loại"}</span>
          <span>•</span>
          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
          <span>•</span>
          <span>{doc.downloadCount} downloads</span>
        </div>
      </div>
      <div className="flex gap-4">
        {/* Gắn sự kiện onClick */}
        <button
          onClick={() => onEdit(doc)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <PencilIcon className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
// --- KẾT THÚC COMPONENT ---

export default function MyProfilePage() {
  const { data: docData, isLoading, isError } = useMyDocuments();
  const deleteMutation = useDeleteDocument();

  // --- STATE QUẢN LÝ MODAL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const { data: apiUser } = useMyProfile();
  const storeUser = useAuthStore((s) => s.user);
  const user = apiUser ?? storeUser;

  // --- HÀM XỬ LÝ MODAL ---
  const handleEditClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDoc) {
      deleteMutation.mutate(selectedDoc._id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedDoc(null);
        },
      });
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader
        user={user}
        onEditClick={() => setIsEditProfileOpen(true)}
        onChangePassClick={() => setIsChangePassOpen(true)}
      />

      {/* 2. Danh sách "My Documents" */}
      <div className="mt-12 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">My Documents</h2>
          <span className="font-semibold text-blue-600">
            {docData?.pagination.total || 0} documents
          </span>
        </div>

        <div>
          {isLoading && <p className="p-6">Đang tải tài liệu của bạn...</p>}
          {isError && <p className="p-6 text-red-500">Lỗi khi tải tài liệu.</p>}

          {docData && docData.data.length > 0
            ? docData.data.map((doc) => (
                <MyDocumentListItem
                  key={doc._id}
                  doc={doc}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))
            : !isLoading && (
                <p className="p-6">Bạn chưa tải lên tài liệu nào.</p>
              )}
        </div>
      </div>

      {/* 3. Render các Modal (chúng bị ẩn theo mặc định) */}
      {user && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={user}
        />
      )}
      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
      />
      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        doc={selectedDoc}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận Xóa tài liệu"
        message={`Bạn có chắc chắn muốn xóa tài liệu "${selectedDoc?.title}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
}
