import React, { useEffect, useState } from 'react'
import { 
    personalRequestAssign, 
    personalRequestHonor,   
    personalRequestApply,
    personalRequestReject,
    personalRequestStatus, 
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Check, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PopupComponent, { usePopup } from "@/components/PopupComponent";

// Component hiển thị chi tiết
const RequestDetail = ({ 
    request, 
    onBack, 
    onHonor, 
    onApply, 
    onReject 
}: { 
    request: any; 
    onBack: () => void; 
    onHonor: (id: string, reason: string) => void;
    onApply: (id: string) => void;
    onReject: (id: string) => void;
}) => {
    const [showHonorDialog, setShowHonorDialog] = useState(false);
    const [honorReason, setHonorReason] = useState('');
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

    const handleHonorClick = () => {
        setShowHonorDialog(true);
        setHonorReason('');
    };

    const handleHonorSubmit = async () => {
        if (!honorReason.trim()) {
            toast.error('Vui lòng nhập lý do vinh danh');
            return;
        }

        setIsSubmitting(true);
        try {
            await onHonor(request.id, honorReason);
            setShowHonorDialog(false);
            setHonorReason('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApplyClick = async () => {

        openPopup({
            type: "info",
            title: "Áp dụng thực hiện yêu cầu này",
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


    const handleRejectClick = async () => {
        openPopup({
            type: "warning",
            title: "Xác nhận xóa yêu cầu này",
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
    const canApproveOrReject = request.status_requests.id !== 5; // 5 là vinh danh - Không phải "Đã vinh danh"
    const statusId = request.status_requests.id;
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
            href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                url.replace("/fl_attachment", "")
                  )}`}
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
                <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />
                {/* Header */}
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

                            {canHonor && (
                                <button
                                    onClick={handleHonorClick}
                                    className="
                                        w-10 h-10 sm:w-11 sm:h-11
                                        rounded-lg
                                        bg-yellow-600 hover:bg-yellow-700
                                        flex items-center justify-center
                                        transition-colors
                                        shadow-lg
                                    "
                                    title="Vinh danh"
                                >
                                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </button>
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
                                    {request.type_requests?.name}
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
                                    {request.status_requests?.name}
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

            {/* Honor Dialog */}
            <Dialog open={showHonorDialog} onOpenChange={setShowHonorDialog}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white w-[95vw] sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Award className="h-6 w-6 text-yellow-500" />
                            Vinh danh yêu cầu
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm">
                            Nhập lý do vinh danh cho yêu cầu "{request.title}"
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-slate-300">
                                Lý do vinh danh <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="Nhập lý do vinh danh..."
                                value={honorReason}
                                onChange={(e) => setHonorReason(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setShowHonorDialog(false)}
                            disabled={isSubmitting}
                            className="text-slate-300 hover:text-white hover:bg-slate-700 w-full sm:w-auto"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleHonorSubmit}
                            disabled={isSubmitting || !honorReason.trim()}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white w-full sm:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Award className="h-4 w-4 mr-2" />
                                    Xác nhận vinh danh
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Component chính
function Request() {
    const dispatch = useDispatch();
    const { listPersonalRequestAssign, detailPersonalRequestAssign, listPersonalRequestStatus } = useProfileData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchFilter, setSearchFilter] = useState<string>("");


    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const timer = setTimeout(() => {
            if (token) {
                dispatch(personalRequestAssign({
                    token: token,
                    key: "listPersonalRequestAssign",
                    status_request_id: statusFilter === "all" ? null : statusFilter, 
                    search: searchFilter === "" ? null : searchFilter
                }) as any);
            }

        }, 300)

        return () => clearTimeout(timer);
        
    }, [statusFilter, searchFilter]);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if(!listPersonalRequestStatus){
            dispatch(personalRequestStatus() as any)
        }
        if (token) {
            dispatch(personalRequestAssign({
                page: currentPage,
                token: token,
                key: "listPersonalRequestAssign"
            }) as any);
        }
    }, [currentPage, dispatch]);

    const handleViewDetail = (id: string) => {
        const token = localStorage.getItem("userToken");
        
        setSelectedId(id);
        dispatch(personalRequestAssign({
            id: id,
            token: token,
            key: "detailPersonalRequestAssign"
        }) as any);
    };

    const handleBackToList = () => {
        setSelectedId(null);
    };

    const handleHonor = async (id: string, reason: string) => {
        const token = localStorage.getItem("userToken");
        
        try {
            const result = await dispatch(personalRequestHonor({
                id,
                reason,
                token
            }) as any);

            if (result.payload?.data?.success) {
                toast.success('Vinh danh thành công!');
                
                // Refresh chi tiết
                dispatch(personalRequestAssign({
                    id: id,
                    token: token,
                    key: "detailPersonalRequestAssign"
                }) as any);
                
                // Refresh danh sách
                dispatch(personalRequestAssign({
                    page: currentPage,
                    token: token,
                    key: "listPersonalRequestAssign"
                }) as any);
            } else {
                toast.error(result.payload?.data?.message || result.payload?.message ||'Có lỗi xảy ra khi vinh danh');
            }
        } catch (error) {
            // toast.error('Có lỗi xảy ra khi vinh danh');
        }
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
                dispatch(personalRequestAssign({
                    id: id,
                    token: token,
                    key: "detailPersonalRequestAssign"
                }) as any);
                
                // Refresh danh sách
                dispatch(personalRequestAssign({
                    page: currentPage,
                    token: token,
                    key: "listPersonalRequestAssign"
                }) as any);
            } else {
                
                toast.error(result.payload?.data?.message || result.payload?.message ||'Có lỗi xảy ra khi xác nhậnss');
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
                dispatch(personalRequestAssign({
                    id: id,
                    token: token,
                    key: "detailPersonalRequestAssign"
                }) as any);
                
                // Refresh danh sách
                dispatch(personalRequestAssign({
                    page: currentPage,
                    token: token,
                    key: "listPersonalRequestAssign"
                }) as any);
            } else {
                toast.error(result.payload?.data?.message || result.payload?.message ||'Có lỗi xảy ra khi từ chối');
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

    const handleStatusFilterChange = (filter: string) => {
        setStatusFilter(filter)
    }


    const renderFilter = () => {
        return(
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-slate-300">
                        Trạng thái
                    </label>
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                        <SelectValue placeholder="Chọn loại nhiệm vụ" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="all" className="text-white text-xs sm:text-sm">
                            Tất cả
                        </SelectItem>
                        {listPersonalRequestStatus &&
                            Array.isArray(listPersonalRequestStatus) &&
                            listPersonalRequestStatus.map((type: any) => (
                            <SelectItem 
                                key={type.id} 
                                value={type.id}
                                className="text-white text-xs sm:text-sm"
                            >
                                {type.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 mt-4">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value)
                        }}
                        placeholder={"Tìm kiếm tên..."}
                        className="
                        w-full rounded-md
                        bg-slate-900 border border-slate-700
                        pl-9 pr-8 py-2 text-sm text-white
                        placeholder:text-slate-500
                        focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors duration-150
                        "
                    />
                    {searchFilter  && (
                        <button
                        type="button"
                        onClick={() => setSearchFilter("")}
                        aria-label="Xóa tìm kiếm"
                        className="
                            absolute right-2.5 top-1/2 -translate-y-1/2
                            text-slate-500 hover:text-white
                            transition-colors duration-150
                        "
                        >
                        <X className="h-4 w-4" />
                        </button>
                    )}
                    </div>
                </div>
            </div>
        )
    }

    const renderPaginationItems = () => {
        if (!listPersonalRequestAssign?.pagination) return null;

        const { totalPages } = listPersonalRequestAssign.pagination;
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
    if (selectedId && detailPersonalRequestAssign) {
        return (
            <RequestDetail 
                request={detailPersonalRequestAssign} 
                onBack={handleBackToList} 
                onHonor={handleHonor}
                onApply={handleApply}
                onReject={handleReject}
            />
        );
    }

    // Hiển thị danh sách request
    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">
                    Danh sách yêu cầu
                </h1>

                {renderFilter()}

                {/* Request List */}
                <div className="grid gap-4 mb-6">
                    {listPersonalRequestAssign?.data?.map((request: any) => (
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
                                            {request.type_requests?.name}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-amber-900/50 text-amber-300 text-xs"
                                        >
                                            {request.status_requests?.name}
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
                    {listPersonalRequestAssign?.data?.length === 0 && (
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
                {listPersonalRequestAssign?.pagination &&
                    listPersonalRequestAssign.pagination.totalPages > 1 && (
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
                                                    listPersonalRequestAssign.pagination.totalPages
                                                ) {
                                                    handlePageChange(currentPage + 1);
                                                }
                                            }}
                                            className={`cursor-pointer ${
                                                currentPage ===
                                                listPersonalRequestAssign.pagination.totalPages
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

export default Request