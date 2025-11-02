"use client";

import { logout } from "@/src/features/user/userSlice";
import { fetchUserInfo } from "@/src/services/api";
import {
  Bell,
  ChevronDown,
  Mail,
  Search,
  UserCircle2,
  LogIn,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(fetchUserInfo(token) as any);
    }
  }, [dispatch]);

  console.log("User Info in Header:", userInfo);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    dispatch(logout());
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 lg:gap-6">
          <a href="#" className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold tracking-wider">
              AG
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-wide">
                APECGLOBAL
              </div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Empower Future Together
              </div>
            </div>
          </a>

          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white xl:hidden">
            <Search size={18} />
          </button>

          <nav className="order-3 hidden w-full items-center gap-6 text-sm font-semibold uppercase tracking-wide text-slate-300 xl:order-none xl:flex xl:w-auto">
            <a href="#" className="hover:text-white transition">
              Trang chủ
            </a>
            <a href="#" className="hover:text-white transition">
              Tin tức nội bộ
            </a>
            <a href="#" className="hover:text-white transition">
              Dự án
            </a>
            <a href="#" className="hover:text-white transition">
              Sự kiện
            </a>
            <a href="#" className="hover:text-white transition">
              Chính sách
            </a>
            <a href="#" className="hover:text-white transition">
              Thống kê
            </a>
            <a href="#" className="hover:text-white transition">
              Thi đua
            </a>
            <a href="#" className="hover:text-white transition">
              Trợ giúp
            </a>
            <a href="#" className="hover:text-white transition">
              Liên hệ IT
            </a>
          </nav>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div className="hidden w-full max-w-sm items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 lg:flex">
              <Search size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm toàn hệ thống"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
              <Bell size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
              <Mail size={18} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
              >
                <UserCircle2 size={24} />
                <span>Tài khoản</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-800 bg-slate-900 shadow-xl z-50">
                  <div className="p-2">
                    {userInfo ? (
                      <>
                        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer" onClick={() => router.push('/profile')}>
                          <User size={18} />
                          <span>Thông tin cá nhân</span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer">
                          <Settings size={18} />
                          <span>Cài đặt</span>
                        </button>
                        <div className="my-2 border-t border-slate-800"></div>
                        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-red-400 transition hover:bg-slate-800 hover:text-red-300 cursor-pointer" onClick={handleLogout}>
                          <LogOut size={18} />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    ) : (
                      <button
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-blue-600 cursor-pointer"
                        onClick={() => router.push("/login")}
                      >
                        <LogIn size={18} />
                        <span>Đăng nhập</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
