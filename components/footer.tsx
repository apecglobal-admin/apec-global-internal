"use client";

import { getContact } from "@/src/features/contact/api/api";
import { useContactData } from "@/src/hooks/contacthook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { MessageSquareWarning } from "lucide-react";

export default function Footer() {
    const dispatch = useDispatch();
    const { listContact } = useContactData();

    useEffect(() => {
        if(listContact.length !== 0) return;
        const payload = {}
        dispatch(getContact(payload) as any);
    }, []);

    // Helper function để lấy thông tin contact theo title
    const getContactInfo = (title: string) => {
        return listContact?.find((item: any) => item.title === title);
    };

    const hotlineInfo = getContactInfo("Hotline");
    const emailInfo = getContactInfo("Email");
    const workTimeInfo = getContactInfo("Giờ Làm Việc");

    // Helper function để format thời gian
    const formatTime = (time: string) => {
        if (!time) return "";
        return time.substring(0, 5); // Lấy HH:MM từ HH:MM:SS
    };

    return (
        <footer className="border-t border-slate-800 bg-white">
            <div className="container mx-auto grid gap-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl mx-auto lg:grid-cols-[2fr_1fr]">
                <div>
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
                                <span className="pl-2 text-[#272863]">
                                    GLOBAL
                                </span>
                            </div>
                            <div className="text-xs sm:text-sm uppercase  font-semibold text-black">
                                Kiến tạo giá trị - Làm Chủ Tương Lai
                            </div>
                        </div>
                    </a>
                    <h3 className="mt-2 text-2xl font-bold text-blue-main">
                        © 2025 – Tập đoàn Hợp danh ApecGlobal. All rights
                        reserved.
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-black">
                        <a
                            href="/policy"
                            className="rounded-full bg-white shadow-lg/10 bg-box-shadow px-4 py-2 hover:bg-black/10 hover:text-black/70"
                        >
                            Chính sách
                        </a>
                        <a
                            href="/project"
                            className="rounded-full bg-white shadow-lg/10 bg-box-shadow px-4 py-2 hover:bg-black/10 hover:text-black/70"
                        >
                            Dự án
                        </a>
                        <a
                            href="/ecosystem"
                            className="rounded-full bg-white shadow-lg/10 bg-box-shadow px-4 py-2 hover:bg-black/10 hover:text-black/70"
                        >
                            Hệ sinh thái
                        </a>
                        <a
                            href="/contact"
                            className="rounded-full bg-white shadow-lg/10 bg-box-shadow px-4 py-2 hover:bg-black/10 hover:text-black/70"
                        >
                            Trung tâm hỗ trợ
                        </a>
                        <div className="relative inline-flex group">
                            <span className="absolute inline-flex h-full w-full animate-ping-small rounded-full bg-red-500 opacity-75"></span>
                            <a
                                href="/feedback"
                                className="relative z-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-6 py-2.5 pl-5 font-bold text-white shadow-xl shadow-red-500/30 ring-2 ring-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 hover:ring-red-400"
                            >
                                <MessageSquareWarning className="w-5 h-5 transition-transform group-hover:rotate-12" />
                                <span>Phản ảnh</span>
                            </a>
                        </div>

                    </div>
                </div>

                <div className="space-y-4 text-sm text-slate-400">
                    <div>
                        <div className="uppercase  font-bold text-blue-950">
                            Tải ứng dụng
                        </div>
                        <div className="mt-2 flex gap-3">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xs text-slate-500">
                                QR Apec Space
                            </div>
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xs text-slate-500">
                                QR GuardCam
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="uppercase  font-bold text-blue-950">
                            Kênh hỗ trợ 24/7
                        </div>
                        <ul className="mt-2 text-black">
                            <li>Hotline: <span>{hotlineInfo?.content}</span></li>
                            <li>Email: <span>{emailInfo?.content}</span></li>

                            
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
