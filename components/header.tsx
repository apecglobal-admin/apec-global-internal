"use client";

import { logout } from "@/src/features/user/userSlice";
import { apiLogout, fetchUserInfo, getPermissonManager } from "@/src/services/api";
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
    House,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "./searchBar";
import { useProfileData } from "@/src/hooks/profileHook";
import Link from "next/link";

function removeAllSlashes(path: string) {
    return path.replace(/\//g, "");
}
const menuItems = [
    { label: "Trang chủ", href: "/", icon: "House" },
    { label: "Dự án", href: "/project" },
    { label: "Sự kiện", href: "/event" },
    { label: "Hệ sinh thái", href: "/ecosystem" },
    { label: "Chính sách", href: "/policy" },
    { label: "Thống kê", href: "/analysis" },
    { label: "Thi đua", href: "/compet" },
    { label: "Liên hệ", href: "/contact" },
];

export default function Header() {
    const { permission } = useProfileData();
    const pathname = usePathname();
    const profifle = pathname === "/profile";
    const searchPath = pathname === "/project" || pathname === "/event" || pathname === "/policy" || pathname === "/compet"
    const router = useRouter();
    const dispatch = useDispatch();
    const { userInfo } = useProfileData();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const currentMenu = menuItems.find((item) => item.href === pathname);
    const [searchQuery, setSearchQuery] = useState<string>("");
    
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const loadPermission = async () => {
            const res = await dispatch(getPermissonManager({token }) as any)

        }
        loadPermission();
    }, []);

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

    const handleLogout = async () => {
        const token = localStorage.getItem("userToken");
        await dispatch(apiLogout({token}) as any);
        await dispatch(logout());
        setIsDropdownOpen(false);
        setIsSidebarOpen(false);
        localStorage.removeItem("userToken");
        router.push("/login");
    };

    const icons: any = {
        House,
    };


    return (
        <header
            className={`${
                profifle
                    ? "bg-white  border-b border-slate-400"
                    : "bg-white  border-b border-slate-400"
            }  w-full"`}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto w-full">
                {/* Logo */}
                <a
                    href="/"
                    className="flex items-center gap-3 sm:gap-3 flex-shrink-0"
                >
                    <img
                        src="https://res.cloudinary.com/dbt97thds/image/upload/v1751877069/rzasmzadpuv8tlbdigmh.png"
                        alt="APECGLOBAL Logo"
                        className="w-16 h-12 sm:w-20 sm:h-16 lg:w-[100px] lg:h-[70px]"
                    />
                    <div>
                        <div className="text-xl sm:text-2xl font-extrabold  text-blue-main ">
                            APEC
                            <span className="pl-2 text-[#272863]">GLOBAL</span>
                        </div>
                        <div className="text-xs sm:text-sm uppercase  font-semibold text-black">
                            Kiến tạo giá trị - Làm Chủ Tương Lai
                        </div>
                    </div>
                </a>

                {/* Desktop Navigation & Actions */}
                <div className="hide-under-1200">
                    {/* Desktop Navigation */}
                    <nav className="flex items-center pb-3 justify-center gap-4 lg:gap-3 text-md font-normal uppercase">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon
                                ? icons[item.icon]
                                : null;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="hover:text-slate-400 transition whitespace-nowrap text-blue-main font-extrabold flex items-center justify-center"
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                        <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main text-white transition hover:border-blue-500 hover:text-black/30">
                            <Bell size={18} className="text-black" />
                        </button>
                        <button className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main text-white transition hover:border-blue-500 hover:text-black/30">
                            <Mail size={18} className="text-black" />
                        </button>

                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="flex items-center gap-2 rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main px-2 sm:px-3 py-2 text-sm font-semibold text-black transition hover:border-blue-500 hover:text-black/30"
                            >
                                <UserCircle2 size={20} className="text-black" />
                                <span className="hidden sm:inline">
                                    Tài khoản
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`hidden sm:block text-white transition-transform ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-gray-300 bg-white inset-shadow-sm inset-shadow-black/40 z-50">
                                    <div className="p-2">
                                        {userInfo ? (
                                            <>
                                                <button
                                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-black transition hover:bg-white hover:text-black cursor-pointer"
                                                    onClick={() =>
                                                        router.push("/profile")
                                                    }
                                                >
                                                    <User size={18} />
                                                    <span>
                                                        Thông tin cá nhân
                                                    </span>
                                                </button>
                                                {/* <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-black transition hover:bg-white hover:text-black cursor-pointer">
                                                    <Settings size={18} />
                                                    <span>Cài đặt</span>
                                                </button> */}
                                                <div className="my-2 border-t border-black"></div>
                                                <button
                                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-red-700 transition hover:bg-white hover:text-red-600 cursor-pointer"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut size={18} />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-medium text-black transition hover:bg-black/10 cursor-pointer"
                                                onClick={() =>
                                                    router.push("/login")
                                                }
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

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="hidden show-over-1200 flex h-10 w-10 items-center justify-center rounded-full bg-blue-gradiant-main bg-box-shadow text-slate-300 transition hover:border-blue-500 hover:text-black/30 shadow-xl"
                >
                    <Menu size={20} className="text-black font-bold" />
                </button>
            </div>

            {/* Search Bar - Only show when searchPath is true */}
            {/* {searchPath && (
                <div className="border-t border-black">
                    <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
                        <SearchBar
                            placeholder={`tìm kiếm cho ${
                                currentMenu && currentMenu.label
                            }`}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )} */}

            {/* Mobile Sidebar */}
            <div
                className={`hidden show-over-1200 fixed top-0 right-0 ${profifle ? ` h-[91%]` : `h-full`} z-50 transform ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out bg-white w-64 sm:w-80 border-l border-black flex flex-col`}
                ref={sidebarRef}
            >
                {/* Sidebar Header with Bell, Mail, and Close button */}
                <div className="flex justify-between items-center p-4 border-b border-black">
                    <div className="flex items-center gap-2">
                        <button className="flex h-9 w-9 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main text-white transition hover:border-blue-500 hover:text-black/30">
                            <Bell size={18} className="text-black" />
                        </button>
                        <button className="flex h-9 w-9 items-center justify-center rounded-full inset-shadow-sm inset-shadow-black/50 bg-blue-gradiant-main text-white transition hover:border-blue-500 hover:text-black/30">
                            <Mail size={18} className="text-black" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-black rounded-full p-1 bg-gray-200 bg-box-shadow-inset hover:text-black/30 hover:bg-black hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-black py-2 px-3 rounded hover:bg-gray-200 hover:text-black"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* User Info Section at Bottom */}
                <div className="border-t border-black p-4">
                    {userInfo ? (
                        <div className="space-y-2">
                            <button
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-black transition hover:bg-gray-200 cursor-pointer"
                                onClick={() => {
                                    router.push("/profile");
                                    setIsSidebarOpen(false);
                                }}
                            >
                                <User size={18} />
                                <span>Thông tin cá nhân</span>
                            </button>
                            {/* <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-black transition hover:bg-gray-200 cursor-pointer">
                                <Settings size={18} />
                                <span>Cài đặt</span>
                            </button> */}
                            <div className="my-2 border-t border-gray-300"></div>
                            <button
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-red-700 transition hover:bg-red-50 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-medium text-black transition hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                router.push("/login");
                                setIsSidebarOpen(false);
                            }}
                        >
                            <LogIn size={18} />
                            <span>Đăng nhập</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="hidden show-over-1200 fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </header>
    );
}