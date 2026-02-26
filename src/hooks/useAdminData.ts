import { useMemo } from "react";
import {
  useAdminStore,
  Subject,
  Major,
} from "@/store/admin.store";
import { User } from "@/@types/user.type";
import { Document as DocType } from "@/@types/document.type";

export type { Subject, Major };

interface AdminUsersResponse {
  data: User[];
  pagination: { total: number };
}

interface AdminDocumentsResponse {
  data: DocType[];
  pagination: { total: number };
}

export const useAdminSubjects = () => {
  const subjects = useAdminStore((s) => s.subjects);
  return { data: subjects, isLoading: false };
};

export const useAdminMajors = () => {
  const majors = useAdminStore((s) => s.majors);
  return { data: majors, isLoading: false };
};

export const useAdminDocuments = (search: string) => {
  const documents = useAdminStore((s) => s.documents);
  const filtered = useMemo(() => {
    if (!search) return documents;
    const q = search.toLowerCase();
    return documents.filter((d) => d.title.toLowerCase().includes(q));
  }, [documents, search]);

  const result: AdminDocumentsResponse = {
    data: filtered,
    pagination: { total: filtered.length },
  };
  return { data: result, isLoading: false };
};

export const useAdminUsers = (search: string) => {
  const users = useAdminStore((s) => s.users);
  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const result: AdminUsersResponse = {
    data: filtered,
    pagination: { total: filtered.length },
  };
  return { data: result, isLoading: false };
};
