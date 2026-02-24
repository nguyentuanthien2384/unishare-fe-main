// src/hooks/useCategories.ts (Frontend)

import { useQuery } from "@tanstack/react-query";
// TODO: Bỏ comment khi có backend thật
// import api from "@/lib/axios";

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
  subjects: Subject[];
}

// TODO: Bỏ mock data và dùng API thật khi có backend
const mockSubjects: Subject[] = [
  { _id: "sub-001", name: "Phân tích thiết kế phần mềm", code: "SAD" },
  { _id: "sub-002", name: "Lập trình hướng đối tượng", code: "OOP" },
  { _id: "sub-003", name: "Cơ sở dữ liệu", code: "DB" },
  { _id: "sub-004", name: "Mạng máy tính", code: "NET" },
  { _id: "sub-005", name: "Trí tuệ nhân tạo", code: "AI" },
  { _id: "sub-006", name: "Cấu trúc dữ liệu và giải thuật", code: "DSA" },
  { _id: "sub-007", name: "Kinh tế vi mô", code: "MIC" },
  { _id: "sub-008", name: "Quản trị học", code: "MGT" },
];

const mockMajors: Major[] = [
  {
    _id: "major-001",
    name: "Công nghệ thông tin",
    subjects: [
      mockSubjects[0],
      mockSubjects[1],
      mockSubjects[2],
      mockSubjects[4],
      mockSubjects[5],
    ],
  },
  {
    _id: "major-002",
    name: "Kỹ thuật mạng",
    subjects: [mockSubjects[3], mockSubjects[2]],
  },
  {
    _id: "major-003",
    name: "Quản trị kinh doanh",
    subjects: [mockSubjects[6], mockSubjects[7]],
  },
];

// --- Hook lấy danh sách Môn học (Subjects) ---
const getSubjects = async (): Promise<Subject[]> => {
  // TODO: Bỏ mock, dùng API thật khi có backend
  // const response = await api.get("/categories/subjects");
  // return response.data;
  return mockSubjects;
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 5 * 60 * 1000,
  });
};

// --- Hook lấy danh sách Ngành học (Majors) ---
const getMajors = async (): Promise<Major[]> => {
  // TODO: Bỏ mock, dùng API thật khi có backend
  // const response = await api.get("/categories/majors");
  // return response.data;
  return mockMajors;
};

export const useMajors = () => {
  return useQuery({
    queryKey: ["majors"],
    queryFn: getMajors,
    staleTime: 5 * 60 * 1000,
  });
};
