"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
// --- THÊM IMPORT MỚI ---
import GlobalSearch from "./GlobalSearch";
// --- KẾT THÚC ---

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const isModeratorOrAdmin =
    isAuthenticated && user && ["ADMIN", "MODERATOR"].includes(user.role);

  const getAvatarFallback = () => {
    if (!user) return "...";
    const names = user.fullName.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
      <div className="flex-shrink-0">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Unishare
        </Link>
      </div>

      {/* --- THAY THẾ KHỐI NÀY --- */}
      {/* <div className="flex-1 max-w-md mx-4"> ... </div> */}
      <GlobalSearch />
      {/* --- KẾT THÚC --- */}

      <div className="flex-shrink-0 flex items-center gap-2">
        {isAuthenticated && user ? (
          <>
            {isModeratorOrAdmin && (
              <Link
                href="/admin/manage"
                className="px-4 py-2 font-semibold text-gray-700 rounded-full hover:bg-gray-100"
              >
                Quản lý
              </Link>
            )}
            {isModeratorOrAdmin && (
              <Link
                href="/statistics"
                className="px-4 py-2 font-semibold text-gray-700 rounded-full hover:bg-gray-100"
              >
                Thống kê
              </Link>
            )}
            <Link
              href="/upload"
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Upload
            </Link>

            {/* --- Menu Avatar --- */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex items-center justify-center w-10 h-10 font-semibold bg-gray-300 rounded-full text-gray-700">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    getAvatarFallback()
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile/me"
                          className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserIcon className="w-5 h-5 mr-3" />
                          Hồ sơ cá nhân
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${active ? "bg-gray-100" : ""} group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                        >
                          <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-3" />
                          Đăng xuất
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
