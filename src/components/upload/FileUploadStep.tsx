// src/components/upload/FileUploadStep.tsx
"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadStepProps {
  onFilesAccepted: (files: File[]) => void;
}

export default function FileUploadStep({
  onFilesAccepted,
}: FileUploadStepProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Chuyển file cho component cha
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      // Thêm các loại file khác ở đây
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Thả file vào đây ...</p>
        ) : (
          <p>Kéo thả file, hoặc click để chọn file</p>
        )}
      </div>
    </div>
  );
}
