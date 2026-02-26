import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/@types/user.type";
import { Document as DocType } from "@/@types/document.type";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  managingFaculty: string;
}

export interface Major {
  _id: string;
  name: string;
  subjects: Subject[];
}

interface AdminState {
  subjects: Subject[];
  majors: Major[];
  users: User[];
  documents: DocType[];

  addSubject: (s: Omit<Subject, "_id">) => void;
  updateSubject: (id: string, s: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addMajor: (name: string, subjectIds: string[]) => void;
  updateMajor: (id: string, name: string, subjectIds: string[]) => void;
  deleteMajor: (id: string) => void;

  blockUser: (id: string) => void;
  unblockUser: (id: string) => void;
  updateUserRole: (id: string, role: User["role"]) => User;
  resetPassword: (id: string) => { message: string; newPassword: string };

  blockDocument: (id: string) => void;
  unblockDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
}

let idCounter = 100;
const nextId = () => `mock-${++idCounter}`;

const initialSubjects: Subject[] = [
  { _id: "sub-001", name: "Phân tích thiết kế phần mềm", code: "SAD", managingFaculty: "CNTT" },
  { _id: "sub-002", name: "Lập trình hướng đối tượng", code: "OOP", managingFaculty: "CNTT" },
  { _id: "sub-003", name: "Cơ sở dữ liệu", code: "DB", managingFaculty: "CNTT" },
  { _id: "sub-004", name: "Mạng máy tính", code: "NET", managingFaculty: "KTMT" },
  { _id: "sub-005", name: "Trí tuệ nhân tạo", code: "AI", managingFaculty: "CNTT" },
  { _id: "sub-006", name: "Cấu trúc dữ liệu và giải thuật", code: "DSA", managingFaculty: "CNTT" },
];

const initialMajors: Major[] = [
  { _id: "major-001", name: "Công nghệ thông tin", subjects: [initialSubjects[0], initialSubjects[1], initialSubjects[2], initialSubjects[4], initialSubjects[5]] },
  { _id: "major-002", name: "Kỹ thuật mạng", subjects: [initialSubjects[3], initialSubjects[2]] },
];

const initialUsers: User[] = [
  { _id: "user-001", email: "a@test.com", fullName: "Tran Van A", role: "USER", status: "ACTIVE", joinedDate: "2024-01-01", uploadsCount: 3, downloadsCount: 10 },
  { _id: "user-002", email: "b@test.com", fullName: "Le Thi B", role: "MODERATOR", status: "ACTIVE", joinedDate: "2024-02-15", uploadsCount: 5, downloadsCount: 20 },
  { _id: "user-003", email: "c@test.com", fullName: "Nguyen Van C", role: "USER", status: "BLOCKED", joinedDate: "2024-03-10", uploadsCount: 1, downloadsCount: 2 },
];

const initialDocuments: DocType[] = [
  {
    _id: "doc-001", title: "Bài giảng SAD", description: "Slide bài giảng SAD chương 1-5",
    fileUrl: "#", fileType: "application/pdf", fileSize: 2500000,
    uploader: { _id: "user-001", fullName: "Tran Van A" },
    status: "VISIBLE", subject: { _id: "sub-001", name: "Phân tích thiết kế phần mềm", code: "SAD" },
    documentType: "Lecture Notes", schoolYear: "2024-2025", downloadCount: 128, viewCount: 450, uploadDate: "2025-01-15",
  },
  {
    _id: "doc-002", title: "Đề thi OOP giữa kỳ 2024", description: "Đề thi giữa kỳ OOP kèm đáp án",
    fileUrl: "#", fileType: "application/pdf", fileSize: 1200000,
    uploader: { _id: "user-002", fullName: "Le Thi B" },
    status: "VISIBLE", subject: { _id: "sub-002", name: "Lập trình hướng đối tượng", code: "OOP" },
    documentType: "Exam Paper", schoolYear: "2024-2025", downloadCount: 256, viewCount: 820, uploadDate: "2025-02-10",
  },
  {
    _id: "doc-003", title: "Bài tập CSDL có lời giải", description: "Tổng hợp bài tập SQL, ER Diagram",
    fileUrl: "#", fileType: "application/pdf", fileSize: 3800000,
    uploader: { _id: "user-003", fullName: "Nguyen Van C" },
    status: "BLOCKED", subject: { _id: "sub-003", name: "Cơ sở dữ liệu", code: "DB" },
    documentType: "Solved Exercises", schoolYear: "2023-2024", downloadCount: 89, viewCount: 310, uploadDate: "2024-12-20",
  },
];

export const useAdminStore = create(
  persist<AdminState>(
    (set, get) => ({
      subjects: initialSubjects,
      majors: initialMajors,
      users: initialUsers,
      documents: initialDocuments,

      addSubject: (s) => {
        const newSubject: Subject = { ...s, _id: nextId() };
        set((state) => ({ subjects: [...state.subjects, newSubject] }));
      },
      updateSubject: (id, data) => {
        set((state) => ({
          subjects: state.subjects.map((s) => (s._id === id ? { ...s, ...data } : s)),
        }));
      },
      deleteSubject: (id) => {
        set((state) => ({ subjects: state.subjects.filter((s) => s._id !== id) }));
      },

      addMajor: (name, subjectIds) => {
        const allSubjects = get().subjects;
        const subjects = allSubjects.filter((s) => subjectIds.includes(s._id));
        const newMajor: Major = { _id: nextId(), name, subjects };
        set((state) => ({ majors: [...state.majors, newMajor] }));
      },
      updateMajor: (id, name, subjectIds) => {
        const allSubjects = get().subjects;
        const subjects = allSubjects.filter((s) => subjectIds.includes(s._id));
        set((state) => ({
          majors: state.majors.map((m) => (m._id === id ? { ...m, name, subjects } : m)),
        }));
      },
      deleteMajor: (id) => {
        set((state) => ({ majors: state.majors.filter((m) => m._id !== id) }));
      },

      blockUser: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u._id === id ? { ...u, status: "BLOCKED" as const } : u)),
        }));
      },
      unblockUser: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u._id === id ? { ...u, status: "ACTIVE" as const } : u)),
        }));
      },
      updateUserRole: (id, role) => {
        let updated: User | null = null;
        set((state) => ({
          users: state.users.map((u) => {
            if (u._id === id) {
              updated = { ...u, role };
              return updated;
            }
            return u;
          }),
        }));
        return updated!;
      },
      resetPassword: (id) => {
        const user = get().users.find((u) => u._id === id);
        const newPassword = Math.random().toString(36).slice(-8);
        return {
          message: `Đã reset mật khẩu cho ${user?.email || id}`,
          newPassword,
        };
      },

      blockDocument: (id) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d._id === id ? { ...d, status: "BLOCKED" as const } : d,
          ),
        }));
      },
      unblockDocument: (id) => {
        set((state) => ({
          documents: state.documents.map((d) =>
            d._id === id ? { ...d, status: "VISIBLE" as const } : d,
          ),
        }));
      },
      deleteDocument: (id) => {
        set((state) => ({ documents: state.documents.filter((d) => d._id !== id) }));
      },
    }),
    { name: "admin-storage" },
  ),
);
