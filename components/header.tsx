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
    Menu,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(fetchUserInfo(token) as any);
        }
    }, [dispatch]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        dispatch(logout());
        setIsDropdownOpen(false);
        router.push("/login");
    };

    const menuItems = [
        { label: "Trang chủ", href: "#" },
        { label: "Tin tức", href: "#" },
        { label: "Dự án", href: "#" },
        { label: "Sự kiện", href: "#" },
        { label: "Chính sách", href: "#" },
        { label: "Thống kê", href: "#" },
        { label: "Thi đua", href: "#" },
        { label: "Trợ giúp", href: "#" },
        { label: "Liên hệ IT", href: "#" },
    ];

    return (
        <header className="bg-slate-950 border-b border-slate-800 w-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto w-full">
                {/* Logo */}
                <a
                    href="#"
                    className="flex items-center gap-3 sm:gap-3 text-white flex-shrink-0"
                >
                    <img
                        src="https://res.cloudinary.com/dbt97thds/image/upload/v1751877069/rzasmzadpuv8tlbdigmh.png"
                        alt="APECGLOBAL Logo"
                        className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[70px] lg:h-[70px]"
                    />
                    <div>
                        <div className="text-xl sm:text-2xl font-extrabold tracking-wide">
                            APECGLOBAL
                        </div>
                        <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-400">
                            Empower Future Together
                        </div>
                    </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-4 lg:gap-3 text-sm font-semibold uppercase tracking-wide text-slate-300 flex-1 justify-center">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="hover:text-white transition whitespace-nowrap"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="xl:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Search & Actions */}
            <div className="border-t border-slate-800">
                <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
                    {/* Search */}
                    <div className="flex-1 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">
                        <Search size={18} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm toàn hệ thống"
                            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
                            <Bell size={18} />
                        </button>
                        <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
                            <Mail size={18} />
                        </button>

                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-2 sm:px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
                            >
                                <UserCircle2 size={20} />
                                <span className="hidden sm:inline">
                                    Tài khoản
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`hidden sm:block text-slate-500 transition-transform ${
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
                            {/* Dropdown nội dung... */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full z-50 transform ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out bg-slate-950 w-1/2 border-l border-slate-800`}
                ref={sidebarRef}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-800">
                    <span className="text-white font-bold text-lg">Menu</span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-slate-300 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex flex-col p-4 gap-2">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-slate-300 py-2 px-3 rounded hover:bg-slate-800 hover:text-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </header>
    );
}
