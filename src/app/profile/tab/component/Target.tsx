import React, { useEffect, useState } from 'react'
import { 
    personalRequestAssign, 
    personalRequestApply,
    personalRequestReject,
    personalTarget, 
} from "@/src/services/api";
import { useProfileData } from '@/src/hooks/profileHook';
import { useDispatch } from 'react-redux';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

import PopupComponent, { usePopup } from "@/components/PopupComponent";


// Component hiển thị chi tiết
const TargetDetail = ({ 
    request, 
    onBack, 
    onApply, 
    onReject 
}: { 
    request: any; 
    onBack: () => void; 
    onApply: (id: string) => void;
    onReject: (id: string) => void;
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();
    
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleApplyClick = async () => {
        openPopup({
            type: "info",
            title: "Áp dụng mục tiêu này",
            confirmText: "Xác nhận",
            showActionButtons: true,
            onConfirm: async () => {
                try {
                    await onApply(request.id);
                } finally {
                    setIsSubmitting(false);
                    closePopup();
                }                
            },
            onCancel: closePopup,
        });
    };

    const handleRejectClick = () => {
        openPopup({
            type: "warning",
            title: "Xác nhận xóa mục tiêu này",
            confirmText: "Xác nhận",
            showActionButtons: true,
            onConfirm: async () => {
                try {
                    await onReject(request.id);
                } finally {
                    setIsSubmitting(false);
                    closePopup();

                }                
            },
            onCancel: closePopup,
        });
    };


    // Kiểm tra trạng thái để hiển thị nút
    const canApproveOrReject = request.status?.id !== 5;
    const statusId = request.status?.id;
    const canApply = statusId === 4; // Chờ xử lý - hiện Apply và Reject
    const canHonor = statusId === 6; // Đã áp dụng - chỉ hiện Honor
    const hideButtons = statusId === 3 || statusId === 5; // Từ chối hoặc Vinh danh - không hiện gì



    const getFileInfo = (url: string) => {
        const extension = url.split('.').pop()?.toLowerCase() || '';
        const fileName = url.split('/').pop() || 'file';
        
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const isImage = imageExtensions.includes(extension);
        
        const fileIcons: Record<string, string> = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'xls': '📊',
            'xlsx': '📊',
            'ppt': '📊',
            'pptx': '📊',
            'txt': '📃',
            'zip': '🗜️',
            'rar': '🗜️',
        };
        
        return {
            isImage,
            extension: extension.toUpperCase(),
            fileName,
            icon: fileIcons[extension] || '📎'
        };
    };

    const renderFilePreview = (url?: string) => {
        if (!url) return null;
    
        const file = getFileInfo(url);
    
        if (file.isImage) {
            return (
                <img
                    src={url}
                    alt={file.fileName}
                    className="w-full h-32 object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition"
                    onClick={() => setPreviewImage(url)}
                />
            );
        }
    
        return (
            <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm text-slate-200"
        >
            <span className="text-lg">{file.icon}</span>
            <span className="truncate">{file.fileName}</span>
            <span className="ml-auto text-xs text-slate-400">
                {file.extension}
            </span>
        </a>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            className="text-slate-300 hover:text-white hover:bg-slate-800 px-2"
                        >
                            <ArrowLeft className="h-5 w-5 sm:mr-2" />
                            <span className="hidden sm:inline">Quay lại</span>
                        </Button>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Chi tiết yêu cầu
                        </h2>
                    </div>

                    {/* Action buttons - Icon only */}
                    {!hideButtons && (
                        <div className="flex items-center gap-2">
                            {canApply && (
                                <>
                                    <button
                                        onClick={handleApplyClick}
                                        className="
                                            w-10 h-10 sm:w-11 sm:h-11
                                            rounded-lg
                                            bg-blue-600 hover:bg-blue-700
                                            flex items-center justify-center
                                            transition-colors
                                            shadow-lg
                                        "
                                        title="Xác nhận"
                                    >
                                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </button>

                                    <button
                                        onClick={handleRejectClick}
                                        className="
                                            w-10 h-10 sm:w-11 sm:h-11
                                            rounded-lg
                                            bg-red-600 hover:bg-red-700
                                            flex items-center justify-center
                                            transition-colors
                                            shadow-lg
                                        "
                                        title="Từ chối"
                                    >
                                        <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="space-y-6">
                        {/* Employee */}
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
                            <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                                <AvatarImage src={request.employee?.avatar} />
                                <AvatarFallback className="bg-slate-700 text-white text-lg">
                                    {request.employee?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    Người tạo yêu cầu
                                </p>
                                <p className="font-semibold text-base sm:text-lg text-white">
                                    {request.employee?.name}
                                </p>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-1">
                                    Tiêu đề
                                </h3>
                                <p className="text-base sm:text-lg font-semibold text-white">
                                    {request.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-1">
                                    Mô tả
                                </h3>
                                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                                    {request.description}
                                </p>
                            </div>

                            {request.reason && (
                                <div>
                                    <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-1">
                                        Lý do
                                    </h3>
                                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                                        {request.reason}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Status & Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                    Loại yêu cầu
                                </p>
                                <Badge
                                    variant="outline"
                                    className="bg-blue-900/50 text-blue-300 border-blue-700 text-sm px-3 py-1"
                                >
                                    {request.type?.name}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-slate-400 mb-2">
                                    Trạng thái
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-900/50 text-amber-300 text-sm px-3 py-1"
                                >
                                    {request.status?.name}
                                </Badge>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-1">
                                    Ngày yêu cầu
                                </p>
                                <p className="text-white text-sm sm:font-medium">
                                    {formatDate(request.date_request)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-1">
                                    Ngày tạo
                                </p>
                                <p className="text-white text-sm sm:font-medium">
                                    {formatDateTime(request.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 mb-1">
                                    Cập nhật lần cuối
                                </p>
                                <p className="text-white text-sm sm:font-medium">
                                    {formatDateTime(request.updated_at)}
                                </p>
                            </div>
                        </div>

                        {request.document && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700">
                                <p className="text-xs text-slate-500 mb-1.5 sm:mb-2">Minh chứng:</p>
                                {renderFilePreview(request.document)}
                            </div>
                        )} 
                    </CardContent>
                </Card>
            </div>

            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-full rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

// Component chính
function Target() {
    const dispatch = useDispatch();
    const { 
        listPersonalTarget,
        detailPersonalTarget
    } = useProfileData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const limit = 6;

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(personalTarget({
                page: currentPage,
                limit,
                token: token,
                key: "listPersonalTarget"
            }) as any);
        }
    }, [currentPage, dispatch]);

    const handleViewDetail = (id: string) => {
        const token = localStorage.getItem("userToken");
        
        setSelectedId(id);
        dispatch(personalTarget({
            id: id,
            token: token,
            key: "detailPersonalTarget"
        }) as any);
    };

    const handleBackToList = () => {
        setSelectedId(null);
    };

    const handleApply = async (id: string) => {
        const token = localStorage.getItem("userToken");
        
        try {
            const result = await dispatch(personalRequestApply({
                id,
                token
            }) as any);

            if (result.payload?.data?.success) {
                toast.success('Xác nhận yêu cầu thành công!');
                
                // Refresh chi tiết
                dispatch(personalTarget({
                    id: id,
                    token: token,
                    key: "detailPersonalTarget"
                }) as any);
                
                // Refresh danh sách
                dispatch(personalTarget({
                    page: currentPage,
                    limit,
                    token: token,
                    key: "listPersonalTarget"
                }) as any);
            } else {
                
                toast.error(result.payload?.data?.message || result.payload?.message ||'Có lỗi xảy ra khi xác nhận');
            }
        } catch (error) {
            // toast.error('Có lỗi xảy ra khi xác nhận');
        }
    };

    const handleReject = async (id: string) => {
        const token = localStorage.getItem("userToken");
        
        try {
            const result = await dispatch(personalRequestReject({
                id,
                token
            }) as any);

            if (result.payload?.data?.success) {
                toast.success('Từ chối yêu cầu thành công!');
                
                // Refresh chi tiết
                dispatch(personalTarget({
                    id: id,
                    token: token,
                    key: "detailPersonalTarget"
                }) as any);
                
                // Refresh danh sách
                dispatch(personalTarget({
                    page: currentPage,
                    limit,
                    token: token,
                    key: "listPersonalTarget"
                }) as any);
            } else {
                toast.error(result.payload?.data?.message || result.payload?.message ||'Có lỗi xảy ra khi xác nhận');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi từ chối');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const renderPaginationItems = () => {
        if (!listPersonalTarget?.pagination) return null;

        const { totalPages } = listPersonalTarget.pagination;
        const items = [];
        const showEllipsisThreshold = 7;

        if (totalPages <= showEllipsisThreshold) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i);
                            }}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                        }}
                        isActive={currentPage === 1}
                        className="cursor-pointer"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) {
                items.push(<PaginationEllipsis key="ellipsis-start" />);
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i);
                            }}
                            isActive={currentPage === i}
                            className="cursor-pointer"
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) {
                items.push(<PaginationEllipsis key="ellipsis-end" />);
            }

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer"
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    // Hiển thị chi tiết request
    if (selectedId && detailPersonalTarget) {
        return (
            <TargetDetail 
                request={detailPersonalTarget} 
                onBack={handleBackToList} 
                onApply={handleApply}
                onReject={handleReject}
            />
        );
    }
    
    // Hiển thị danh sách request
    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                    Danh sách yêu cầu
                </h1>

                {/* Request List */}
                <div className="grid gap-4 mb-6">
                    {listPersonalTarget?.data?.map((request: any) => (
                        <Card
                            key={request.id}
                            onClick={() => handleViewDetail(request.id)}
                            className="
                                cursor-pointer 
                                transition-all 
                                bg-slate-800 
                                border-slate-700 
                                hover:border-blue-500/50 
                                hover:shadow-lg
                                active:scale-[0.99]
                            "
                        >
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    {/* Title & description */}
                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg font-semibold mb-1 text-white">
                                            {request.title}
                                        </h3>
                                        <p className="text-sm text-slate-300 line-clamp-2">
                                            {request.description}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 sm:ml-4">
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs"
                                        >
                                            {request.type?.name}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-amber-900/50 text-amber-300 text-xs"
                                        >
                                            {request.status?.name}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <div className="
                                    flex flex-col gap-1
                                    sm:flex-row sm:items-center sm:justify-between
                                    text-xs sm:text-sm text-slate-400
                                ">
                                    <span>
                                        Ngày yêu cầu: {formatDate(request.date_request)}
                                    </span>
                                    <span>
                                        Cập nhật: {formatDate(request.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty state */}
                    {listPersonalTarget?.data?.length === 0 && (
                        <div className="text-center py-12 sm:py-16 bg-slate-800 border border-slate-700 rounded-lg">
                            <svg
                                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="mt-4 text-base sm:text-lg text-slate-400">
                                Chưa có yêu cầu nào
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {listPersonalTarget?.pagination &&
                    listPersonalTarget.pagination.totalPages > 1 && (
                        <div className="mt-6 sm:mt-8 overflow-x-auto">
                            <Pagination>
                                <PaginationContent className="flex-nowrap">
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) {
                                                    handlePageChange(currentPage - 1);
                                                }
                                            }}
                                            className={`cursor-pointer ${
                                                currentPage === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }`}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (
                                                    currentPage <
                                                    listPersonalTarget.pagination.totalPages
                                                ) {
                                                    handlePageChange(currentPage + 1);
                                                }
                                            }}
                                            className={`cursor-pointer ${
                                                currentPage ===
                                                listPersonalTarget.pagination.totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default Target