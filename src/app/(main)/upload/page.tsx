"use client";

import { useState } from "react";
import { UploadDocumentDto } from "@/@types/document.type";
import FileUploadStep from "@/components/upload/FileUploadStep";
import FileDetailsStep from "@/components/upload/FileDetailsStep";
import UploadDoneStep from "@/components/upload/UploadDoneStep";
// --- IMPORT MỚI ---
import { toast } from "react-hot-toast";
// --- KẾT THÚC ---

export default function UploadPage() {
  const [step, setStep] = useState(1); // Step 1: Upload
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<Partial<UploadDocumentDto>[]>([]);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setMetadata(Array(acceptedFiles.length).fill({}));
    setStep(2);
  };

  // --- HÀM ĐƯỢC CẬP NHẬT ---
  const handleDetailsSubmit = () => {
    // Validation: Kiểm tra tất cả các file
    for (const meta of metadata) {
      if (!meta.title || !meta.subject) {
        toast.error(
          "Vui lòng điền đầy đủ Môn học và Tiêu đề cho tất cả các file!",
        );
        return; // Dừng lại, không chuyển bước
      }
    }

    // Nếu tất cả đều OK, chuyển sang Bước 3
    setStep(3);
  };
  // --- KẾT THÚC CẬP NHẬT ---

  const renderStep = () => {
    switch (step) {
      case 1:
        return <FileUploadStep onFilesAccepted={handleFilesAccepted} />;
      case 2:
        return (
          <FileDetailsStep
            files={files}
            metadata={metadata}
            setMetadata={setMetadata}
            onSubmit={handleDetailsSubmit}
          />
        );
      case 3:
        return (
          <UploadDoneStep
            files={files}
            metadata={metadata as UploadDocumentDto[]}
          />
        ); // Ép kiểu ở đây
      default:
        return <FileUploadStep onFilesAccepted={handleFilesAccepted} />;
    }
  };

  return (
    <div className="p-8 mx-auto max-w-4xl bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-[#2F80ED]">
        Upload your files
      </h1>

      {/* Stepper (giữ nguyên) */}
      <div className="flex justify-between my-8 text-gray-500">
        <span className={step === 1 ? "text-[#2F80ED] font-bold" : ""}>
          1. Upload
        </span>
        <span className={step === 2 ? "text-[#2F80ED] font-bold" : ""}>
          2. Details
        </span>
        <span className={step === 3 ? "text-[#2F80ED] font-bold" : ""}>
          3. Done
        </span>
      </div>

      <div>{renderStep()}</div>
    </div>
  );
}
