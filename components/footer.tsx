"use client";

export default function Footer() {
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
                        <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-blue-950 ">
                            APEC GLOBAL
                        </div>
                        <div className="text-xs sm:text-sm uppercase tracking-[0.05em] font-semibold text-black">
                            Kiến tạo giá trị - Làm Chủ Tương Lai
                        </div>
                    </div>
                </a>
                    <h3 className="mt-2 text-2xl font-bold text-black">
                        © 2025 – Tập đoàn Hợp danh ApecGlobal. All rights
                        reserved.
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-black">
                        <a
                            href="#"
                            className="rounded-full bg-gray-200 shadow-lg/10 border border-gray-500 px-4 py-2 hover:border-blue-500 hover:text-white"
                        >
                            Chính sách
                        </a>
                        <a
                            href="#"
                            className="rounded-full bg-gray-200 shadow-lg/10 border border-gray-500 px-4 py-2 hover:border-blue-500 hover:text-white"
                        >
                            Quy chế
                        </a>
                        <a
                            href="#"
                            className="rounded-full bg-gray-200 shadow-lg/10 border border-gray-500 px-4 py-2 hover:border-blue-500 hover:text-white"
                        >
                            Trung tâm hỗ trợ
                        </a>
                        <a
                            href="#"
                            className="rounded-full bg-gray-200 shadow-lg/10 border border-gray-500 px-4 py-2 hover:border-blue-500 hover:text-white"
                        >
                            Liên hệ kỹ thuật
                        </a>
                    </div>
                </div>

                <div className="space-y-4 text-sm text-slate-400">
                    <div>
                        <div className="uppercase tracking-[0.3em] font-bold text-blue-950">
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
                        <div className="uppercase tracking-[0.3em] font-bold text-blue-950">
                            Kênh hỗ trợ 24/7
                        </div>
                        <p className="mt-2 text-black">
                            Zalo: @ApecTechSupport • Email:
                            support@apecglobal.internal • Hotline: 1900.555.886
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
