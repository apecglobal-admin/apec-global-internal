"use client";

import {
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    Camera,
    Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

import SkillsTab from "./tab/skills";
import ProjectsTab from "./tab/project";
import AchievementsTab from "./tab/achievement";
import CareerTab from "./tab/career";
import TasksTab from "./tab/task";
import PersonalTab from "./tab/personal";
import TabNavigation from "./tab/tabNavigation";
import CardTab from "./tab/card";
import LinkTab from "./tab/link";
import { CircleMenu, CircleMenuItem } from "react-circular-menu";
import Flag from "react-flagkit";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUserInfo,
    listDepartments,
    listPositions,
    uploadAvatar,
} from "@/src/services/api";
import { useProfileData } from "@/src/hooks/profileHook";

function ProfilePage() {
    const dispatch = useDispatch();
    const { userInfo, departments, positions, isLoadingUser, isLoadingPositions, isLoadingDepartments} = useProfileData();
    const [currentImage, setCurrentImage] = useState(0);
    const [activeTab, setActiveTab] = useState("skills");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{
        avatar1?: File;
        avatar2?: File;
        avatar3?: File;
    }>({});
    const [previewUrls, setPreviewUrls] = useState<{
        avatar1?: string;
        avatar2?: string;
        avatar3?: string;
    }>({});


    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(fetchUserInfo(token as any) as any);
        }
        dispatch(listPositions() as any);
        dispatch(listDepartments() as any);
        
    }, [dispatch]);

    //console.log("isloading", isLoadingUser, isLoadingDepartments, isLoadingPositions)
    //console.log("userInfo", !userInfo, !departments, !positions)

    // Khởi tạo preview URLs từ avatar hiện tại khi mở modal
    useEffect(() => {
        if (showUploadModal && userInfo) {
            setPreviewUrls({
                avatar1: userInfo.avatar_url || undefined,
                avatar2: userInfo.second_avatar_url || undefined,
                avatar3: userInfo.third_avatar_url || undefined,
            });
        }
    }, [showUploadModal, userInfo]);

    // Show loading state if userInfo is not available
    //if (isLoadingUser == true || isLoadingDepartments == true || isLoadingPositions == true) {
    if (!userInfo || !positions || !departments) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Đang tải thông tin...</div>
            </div>
        );
    }

    const currentExp =
        typeof userInfo.exp === "string"
            ? parseFloat(userInfo.exp)
            : userInfo.exp;
    const currentLevel = userInfo.level;
    const expForNextLevel = currentLevel * userInfo.next_exp;
    const expProgress = (currentExp / expForNextLevel) * 100;
    const expRemaining = expForNextLevel - currentExp;

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const images = [
        userInfo.avatar_url,
        userInfo.second_avatar_url,
        userInfo.third_avatar_url,
    ].filter(Boolean);

    const formatDate = (dateString: any) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        avatarNum: number
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const avatarKey = `avatar${avatarNum}` as
                | "avatar1"
                | "avatar2"
                | "avatar3";

            setSelectedFiles((prev) => ({
                ...prev,
                [avatarKey]: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls((prev) => ({
                    ...prev,
                    [avatarKey]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (Object.keys(selectedFiles).length === 0) return;

        console.log("Uploading files:", selectedFiles);

        // ✅ Tạo FormData đúng key backend yêu cầu
        const formData = new FormData();
        if (selectedFiles.avatar1)
            formData.append("avatar_url", selectedFiles.avatar1);
        if (selectedFiles.avatar2)
            formData.append("second_avatar_url", selectedFiles.avatar2);
        if (selectedFiles.avatar3)
            formData.append("third_avatar_url", selectedFiles.avatar3);

        const token = localStorage.getItem("userToken");
        if (token) {
            const payload = { formData, token };
            dispatch(uploadAvatar(payload) as any);
        }

        // Reset UI sau khi upload
        setShowUploadModal(false);
        setSelectedFiles({});
        setPreviewUrls({});
    };

    const handleCancelUpload = () => {
        setShowUploadModal(false);
        setSelectedFiles({});
        // Reset preview URLs về empty thay vì giữ nguyên
        setPreviewUrls({});
    };

    const removeImage = (avatarNum: number) => {
        const avatarKey = `avatar${avatarNum}` as
            | "avatar1"
            | "avatar2"
            | "avatar3";

        // Xóa file đã chọn
        setSelectedFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[avatarKey];
            return newFiles;
        });

        // Xóa preview (cả ảnh mới và ảnh cũ)
        setPreviewUrls((prev) => {
            const newUrls = { ...prev };
            delete newUrls[avatarKey];
            return newUrls;
        });
    };

    return (
        <div className="h-screen bg-slate-950 p-0 flex flex-col">
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
            <div className="mt-0 mx-0 max-w-none mb-0 flex-1">
                <div className="relative h-full mb-0 rounded-none border-x-0 border-t-0 border border-slate-800 bg-gradient-to-tl from-[#0c2954] to-transparent p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row mb-12">
                        <div className="lg:w-1/5">
                            <div className="sticky top-8 space-y-6">
                                {/* Mobile: Avatar and Info side by side */}
                                <div className="lg:hidden space-y-3">
                                    <div className="flex gap-4">
                                        <div className="relative w-32 flex-shrink-0">
                                            <div className="relative w-full aspect-square">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                                                <div className="relative h-full w-full rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
                                                    {images.length > 0 ? (
                                                        <img
                                                            src={
                                                                images[
                                                                    currentImage
                                                                ]
                                                            }
                                                            alt="Profile"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-500">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Button - Mobile */}
                                                <button
                                                    onClick={() =>
                                                        setShowUploadModal(true)
                                                    }
                                                    className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white p-1.5 rounded-full border border-white-400 hover:border-white-300 transition-all duration-300 shadow-lg"
                                                >
                                                    <Camera size={14} />
                                                </button>

                                                {images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={prevImage}
                                                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-1 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                                                        >
                                                            <ChevronLeft
                                                                size={14}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={nextImage}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-1 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300"
                                                        >
                                                            <ChevronRight
                                                                size={14}
                                                            />
                                                        </button>

                                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                            {images.map(
                                                                (_, index) => (
                                                                    <button
                                                                        key={
                                                                            index
                                                                        }
                                                                        onClick={() =>
                                                                            setCurrentImage(
                                                                                index
                                                                            )
                                                                        }
                                                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                                                            currentImage ===
                                                                            index
                                                                                ? "bg-blue-400 w-4"
                                                                                : "bg-slate-700 hover:bg-slate-600 w-1.5"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mobile: User Info */}
                                        <div className="flex-1">
                                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3 h-full flex flex-col justify-center">
                                                <h2 className="text-lg font-bold text-slate-100 mb-1">
                                                    {userInfo.name}
                                                </h2>
                                                <p className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                                    {
                                                        positions.find(
                                                            (pos: any) =>
                                                                pos.id ===
                                                                userInfo?.position_id
                                                        )?.title
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile: EXP Bar */}
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-slate-300">
                                                Level {currentLevel}
                                            </span>
                                            <span className="text-xs font-bold text-blue-400">
                                                {currentExp.toFixed(0)}/
                                                {expForNextLevel}
                                            </span>
                                        </div>
                                        <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                                                style={{
                                                    width: `${expProgress}%`,
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {expRemaining.toFixed(0)} XP to next
                                            level
                                        </p>
                                    </div>
                                </div>

                                {/* Desktop: Original Layout */}
                                <div className="hidden lg:block relative">
                                    <div className="relative w-full aspect-square">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                                        <div className="relative h-full w-full rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
                                            {images.length > 0 ? (
                                                <img
                                                    src={images[currentImage]}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Button - Desktop */}
                                        <button
                                            onClick={() =>
                                                setShowUploadModal(true)
                                            }
                                            className="absolute top-3 right-3 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full border border-white-400 hover:border-white-300 transition-all duration-300 shadow-lg cursor-pointer"
                                        >
                                            <Camera size={18} />
                                        </button>

                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-2 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300 cursor-pointer"
                                                >
                                                    <ChevronLeft size={18} />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm hover:bg-blue-500/20 text-white p-2 rounded-full border border-slate-700 hover:border-blue-400 transition-all duration-300 cursor-pointer"
                                                >
                                                    <ChevronRight size={18} />
                                                </button>

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                                    {images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                setCurrentImage(
                                                                    index
                                                                )
                                                            }
                                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                                currentImage ===
                                                                index
                                                                    ? "bg-blue-400 w-6"
                                                                    : "bg-slate-700 hover:bg-slate-600 w-2"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="hidden lg:block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-300">
                                            Level {currentLevel}
                                        </span>
                                        <span className="text-xs font-bold text-blue-400">
                                            {currentExp.toFixed(0)}/
                                            {expForNextLevel}
                                        </span>
                                    </div>
                                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
                                            style={{ width: `${expProgress}%` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {expRemaining.toFixed(0)} XP to next
                                        level
                                    </p>
                                </div>

                                <div className="hidden lg:block space-y-4">
                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
                                        <h2 className="text-2xl font-bold text-slate-100 mb-1">
                                            {userInfo.name}
                                        </h2>
                                        <p className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            {
                                                positions.find(
                                                    (pos: any) =>
                                                        pos.id ===
                                                        userInfo?.position_id
                                                )?.title
                                            }
                                        </p>
                                    </div>

                                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                                            <Mail
                                                size={16}
                                                className="text-blue-400 flex-shrink-0"
                                            />
                                            <span className="text-xs truncate">
                                                {userInfo.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                                            <Briefcase
                                                size={16}
                                                className="text-blue-400 flex-shrink-0"
                                            />
                                            <span className="text-xs">
                                                {
                                                    departments.find(
                                                        (item: any) =>
                                                            item.id ===
                                                            userInfo?.department_id
                                                    )?.name
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                                            <MapPin
                                                size={16}
                                                className="text-blue-400 flex-shrink-0"
                                            />
                                            <span className="text-xs">
                                                {userInfo.address || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 hover:text-slate-100 transition-colors">
                                            <Calendar
                                                size={16}
                                                className="text-blue-400 flex-shrink-0"
                                            />
                                            <span className="text-xs">
                                                {formatDate(userInfo.join_date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 lg:w-4/5 flex flex-col">
                            <div className="flex-1 mb-6">
                                <TabNavigation
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                />

                                {activeTab === "skills" && (
                                    <SkillsTab userInfo={userInfo} />
                                )}
                                {activeTab === "projects" && (
                                    <ProjectsTab userInfo={userInfo} />
                                )}
                                {activeTab === "achievements" && (
                                    <AchievementsTab userInfo={userInfo} />
                                )}
                                {activeTab === "career" && (
                                    <CareerTab userInfo={userInfo} />
                                )}
                                {activeTab === "tasks" && <TasksTab />}
                                {activeTab === "personal" && (
                                    <PersonalTab userInfo={userInfo} />
                                )}
                                {activeTab === "card" && (
                                    <CardTab userInfo={userInfo} />
                                )}
                                {activeTab === "link" && (
                                    <LinkTab userInfo={userInfo} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">
                            Cập nhật ảnh đại diện
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Bạn có thể cập nhật 1, 2 hoặc cả 3 ảnh đại diện
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Avatar 1 */}
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-slate-200 font-semibold">
                                        Ảnh đại diện 1
                                    </h4>
                                    {previewUrls.avatar1 && (
                                        <button
                                            onClick={() => removeImage(1)}
                                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>

                                {previewUrls.avatar1 ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrls.avatar1}
                                            alt="Preview 1"
                                            className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                        />
                                        {selectedFiles.avatar1 && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                Mới
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors h-48 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileSelect(e, 1)
                                                }
                                                className="hidden"
                                            />
                                            <Upload
                                                className="mx-auto mb-2 text-blue-400"
                                                size={24}
                                            />
                                            <p className="text-slate-400 text-sm">
                                                Chọn ảnh 1
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {/* Avatar 2 */}
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-slate-200 font-semibold">
                                        Ảnh đại diện 2
                                    </h4>
                                    {previewUrls.avatar2 && (
                                        <button
                                            onClick={() => removeImage(2)}
                                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>

                                {previewUrls.avatar2 ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrls.avatar2}
                                            alt="Preview 2"
                                            className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                        />
                                        {selectedFiles.avatar2 && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                Mới
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors h-48 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileSelect(e, 2)
                                                }
                                                className="hidden"
                                            />
                                            <Upload
                                                className="mx-auto mb-2 text-blue-400"
                                                size={24}
                                            />
                                            <p className="text-slate-400 text-sm">
                                                Chọn ảnh 2
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>

                            {/* Avatar 3 */}
                            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-slate-200 font-semibold">
                                        Ảnh đại diện 3
                                    </h4>
                                    {previewUrls.avatar3 && (
                                        <button
                                            onClick={() => removeImage(3)}
                                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>

                                {previewUrls.avatar3 ? (
                                    <div className="relative">
                                        <img
                                            src={previewUrls.avatar3}
                                            alt="Preview 3"
                                            className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                        />
                                        {selectedFiles.avatar3 && (
                                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                Mới
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center transition-colors h-48 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileSelect(e, 3)
                                                }
                                                className="hidden"
                                            />
                                            <Upload
                                                className="mx-auto mb-2 text-blue-400"
                                                size={24}
                                            />
                                            <p className="text-slate-400 text-sm">
                                                Chọn ảnh 3
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelUpload}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={
                                    Object.keys(selectedFiles).length === 0
                                }
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg border border-blue-400 disabled:border-slate-600 transition-colors"
                            >
                                Tải lên ({Object.keys(selectedFiles).length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
