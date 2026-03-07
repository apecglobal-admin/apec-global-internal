"use client";

import { Mail, MapPin, Calendar, Briefcase, ChevronLeft, ChevronRight, Camera, Upload, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "./tab/tabNavigation";
import { useDispatch } from "react-redux";
import { fetchUserInfo, fetchUserKPI, listDepartments, listPositions, uploadAvatar } from "@/src/services/api";
import { useProfileData } from "@/src/hooks/profileHook";
import AIReportButton from "@/components/ai-report/aiReportButton";
import UserInfoModal from "./tab/component/UserInfoModal";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userInfo, departments, positions, userKPI } = useProfileData();

    const [currentImage, setCurrentImage] = useState(0);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ avatar1?: File; avatar2?: File; avatar3?: File }>({});
    const [previewUrls, setPreviewUrls] = useState<{ avatar1?: string; avatar2?: string; avatar3?: string }>({});
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) { router.replace("/"); return; }
        if (!userInfo) dispatch(fetchUserInfo(token as any) as any);
        if (!userKPI) dispatch(fetchUserKPI(token as any) as any);
        dispatch(listPositions() as any);
        dispatch(listDepartments() as any);
    }, []);

    useEffect(() => {
        if (showUploadModal && userInfo) {
            setPreviewUrls({
                avatar1: userInfo.avatar_url || undefined,
                avatar2: userInfo.second_avatar_url || undefined,
                avatar3: userInfo.third_avatar_url || undefined,
            });
        }
    }, [showUploadModal, userInfo]);

    if (!userInfo || !positions || !departments) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Đang tải thông tin...</div>
            </div>
        );
    }

    const { exp: currentExp, level_current: currentLevel, next_level: nextLevel, next_exp: nextExp, progress_percent: expProgress, remaining_exp: expRemaining } = userInfo;
    const images = [userInfo.avatar_url, userInfo.second_avatar_url, userInfo.third_avatar_url].filter(Boolean);
    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    const formatDate = (d: any) => d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, num: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const key = `avatar${num}` as "avatar1" | "avatar2" | "avatar3";
        setSelectedFiles((p) => ({ ...p, [key]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrls((p) => ({ ...p, [key]: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!Object.keys(selectedFiles).length) return;
        const formData = new FormData();
        if (selectedFiles.avatar1) formData.append("avatar_url", selectedFiles.avatar1);
        if (selectedFiles.avatar2) formData.append("second_avatar_url", selectedFiles.avatar2);
        if (selectedFiles.avatar3) formData.append("third_avatar_url", selectedFiles.avatar3);
        const token = localStorage.getItem("userToken");
        if (token) dispatch(uploadAvatar({ formData, token }) as any);
        setShowUploadModal(false);
        setSelectedFiles({});
        setPreviewUrls({});
    };

    const handleCancel = () => { setShowUploadModal(false); setSelectedFiles({}); setPreviewUrls({}); };

    const removeImage = (num: number) => {
        const key = `avatar${num}` as "avatar1" | "avatar2" | "avatar3";
        setSelectedFiles((p) => { const n = { ...p }; delete n[key]; return n; });
        setPreviewUrls((p) => { const n = { ...p }; delete n[key]; return n; });
    };

    const AvatarCarousel = ({ size = "desktop" }: { size?: "mobile" | "desktop" }) => {
        const isMobile = size === "mobile";
        return (
            <div className={`relative ${isMobile ? "w-32 flex-shrink-0" : "w-full"}`}>
                <div className={`relative ${isMobile ? "w-full aspect-square" : "w-full aspect-square"}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                    <div className="relative h-full w-full rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
                        {images.length > 0
                            ? <img src={images[currentImage]} alt="Profile" className="h-full w-full object-cover" />
                            : <div className="h-full w-full flex items-center justify-center text-slate-500">No Image</div>
                        }
                    </div>
                    <button onClick={() => setShowUploadModal(true)} className={`absolute ${isMobile ? "top-2 right-2 p-1.5" : "top-3 right-3 p-2"} bg-gray-500 hover:bg-gray-600 text-white rounded-full border border-white/20 transition-all duration-300 shadow-lg cursor-pointer`}>
                        <Camera size={isMobile ? 14 : 18} />
                    </button>
                    {images.length > 1 && (
                        <>
                            <button onClick={prevImage} className={`absolute left-${isMobile ? "1" : "2"} top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white ${isMobile ? "p-1" : "p-2"} rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300 cursor-pointer`}>
                                <ChevronLeft size={isMobile ? 14 : 18} />
                            </button>
                            <button onClick={nextImage} className={`absolute right-${isMobile ? "1" : "2"} top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white ${isMobile ? "p-1" : "p-2"} rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300 cursor-pointer`}>
                                <ChevronRight size={isMobile ? 14 : 18} />
                            </button>
                            <div className={`absolute ${isMobile ? "bottom-2" : "bottom-3"} left-1/2 -translate-x-1/2 flex gap-${isMobile ? "1" : "2"}`}>
                                {images.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentImage(i)}
                                        className={`${isMobile ? "h-1.5" : "h-2"} rounded-full transition-all duration-300 ${currentImage === i ? `bg-blue-400 ${isMobile ? "w-4" : "w-6"}` : `bg-slate-700 hover:bg-slate-600 ${isMobile ? "w-1.5" : "w-2"}`}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const ExpBar = ({ compact = false }: { compact?: boolean }) => (
        <div className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl ${compact ? "p-3" : "p-4"} hover:border-slate-700 transition-colors`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Lv.{currentLevel} → Lv.{nextLevel}</span>
                <span className="text-xs font-bold text-blue-400">{currentExp.toFixed(0)} / {nextExp} XP</span>
            </div>
            <div className={`relative w-full ${compact ? "h-2" : "h-2.5"} bg-slate-800 rounded-full overflow-hidden border border-slate-700`}>
                <div className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50" style={{ width: `${expProgress}%` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <p className={`text-xs text-slate-500 ${compact ? "mt-1" : "mt-2"}`}>Còn {expRemaining.toFixed(0)} XP để lên Lv.{nextLevel}</p>
        </div>
    );

    return (
        <div className="h-screen bg-slate-950 p-0 flex flex-col">
            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .animate-shimmer { animation: shimmer 2s infinite; }
            `}</style>

            <div className="mt-0 mx-0 max-w-none mb-0 flex-1">
                <div className="relative h-full mb-0 rounded-none border-x-0 border-t-0 border border-slate-800 bg-gradient-to-tl from-[#0c2954] to-transparent p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row mb-12">

                        {/* ── Sidebar ── */}
                        <div className="lg:w-1/5">
                            <div className="sticky top-8 space-y-6">

                                {/* Mobile */}
                                <div className="lg:hidden space-y-3">
                                    <div className="flex gap-4">
                                        <AvatarCarousel size="mobile" />
                                        <div className="flex-1">
                                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3 h-full flex flex-col justify-center">
                                                <div onClick={() => setShowInfoModal(true)} className="flex justify-between items-center cursor-pointer">
                                                    <h2 className="text-lg font-bold text-slate-100 mb-1">{userInfo.name}</h2>
                                                    <Info size={20} color="yellow" />
                                                </div>
                                                <p className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {positions.find((p: any) => p.id === userInfo?.position_id)?.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <ExpBar compact />
                                </div>

                                {/* Desktop */}
                                <div className="hidden lg:block">
                                    <AvatarCarousel size="desktop" />
                                </div>
                                <div className="hidden lg:block">
                                    <ExpBar />
                                </div>
                                <div className="hidden lg:block space-y-4">
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                                        <div onClick={() => setShowInfoModal(true)} className="flex justify-between items-center cursor-pointer">
                                            <h2 className="text-2xl font-bold text-slate-100 mb-1">{userInfo.name}</h2>
                                            <Info size={20} color="yellow" />
                                        </div>
                                        <p className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            {positions.find((p: any) => p.id === userInfo?.position_id)?.title}
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors">
                                        {[
                                            { icon: <Mail size={16} className="text-blue-400 flex-shrink-0" />, text: userInfo.email },
                                            { icon: <Briefcase size={16} className="text-blue-400 flex-shrink-0" />, text: departments.find((d: any) => d.id === userInfo?.department_id)?.name },
                                            { icon: <MapPin size={16} className="text-blue-400 flex-shrink-0" />, text: userInfo.address || "N/A" },
                                            { icon: <Calendar size={16} className="text-blue-400 flex-shrink-0" />, text: formatDate(userInfo.join_date) },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                                                {item.icon}
                                                <span className="text-xs truncate">{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Main content ── */}
                        <div className="flex-1 lg:w-4/5 flex flex-col">
                            <div className="flex-1 mb-6">
                                <TabNavigation />
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Upload Modal ── */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Cập nhật ảnh đại diện</h3>
                        <p className="text-slate-400 text-sm mb-6">Bạn có thể cập nhật 1, 2 hoặc cả 3 ảnh đại diện</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {([1, 2, 3] as const).map((num) => {
                                const key = `avatar${num}` as "avatar1" | "avatar2" | "avatar3";
                                return (
                                    <div key={num} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-slate-200 font-semibold">Ảnh đại diện {num}</h4>
                                            {previewUrls[key] && <button onClick={() => removeImage(num)} className="text-red-400 hover:text-red-300 text-sm transition-colors">Xóa</button>}
                                        </div>
                                        {previewUrls[key] ? (
                                            <div className="relative">
                                                <img src={previewUrls[key]} alt={`Preview ${num}`} className="w-full h-48 object-cover rounded-lg border border-slate-700" />
                                                {selectedFiles[key] && <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Mới</div>}
                                            </div>
                                        ) : (
                                            <label className="block cursor-pointer">
                                                <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors h-48 flex flex-col items-center justify-center">
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, num)} className="hidden" />
                                                    <Upload className="mx-auto mb-2 text-blue-400" size={24} />
                                                    <p className="text-slate-400 text-sm">Chọn ảnh {num}</p>
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">Hủy</button>
                            <button onClick={handleUpload} disabled={!Object.keys(selectedFiles).length} className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg border border-blue-400 disabled:border-slate-600 transition-colors">
                                Tải lên ({Object.keys(selectedFiles).length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <UserInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} userInfo={userInfo} departments={departments} positions={positions} />
            <AIReportButton />
        </div>
    );
}