// src/hooks/useCategories.ts (Frontend)

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// --- Kiểu dữ liệu (Types) ---
export interface Subject {
  _id?: string;
  name: string;
  code?: string;
  managingFaculty?: string;
}

export interface Major {
  _id: string;
  name: string;
  subjects: Subject[]; // API của chúng ta trả về các môn học đã populate
}

// --- Hook lấy danh sách Môn học (Subjects) ---
const getSubjects = async (): Promise<Subject[]> => {
  const response = await api.get("/categories/subjects");
  console.log("✅ [useSubjects] Total subjects:", response.data.length);
  return response.data;
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

// --- Hook lấy danh sách Ngành học (Majors) ---
const getMajors = async (): Promise<Major[]> => {
  const response = await api.get("/categories/majors");
  const majors = response.data;

  // ✅ DEBUG: Kiểm tra dữ liệu trả về
  console.log("✅ [useMajors] Received majors:", majors.length);
  majors.forEach((m: Major) => {
    console.log(`  - ${m.name}: ${m.subjects?.length || 0} subjects`, {
      _id: m._id,
      subjectsPreview: m.subjects?.slice(0, 2),
      totalSubjects: m.subjects?.length,
    });
  });

  return majors;
};

export const useMajors = () => {
  return useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};
