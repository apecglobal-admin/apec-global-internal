'use client';

import React, { useEffect, useState } from 'react';
import { getSupportTaskEmployee, supportTaskConfirm, uploadImageTask, uploadFileTask } from '@/src/features/task/api';
import { useTaskData } from '@/src/hooks/taskhook';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ClipboardList,
    CheckCircle2,
    Clock,
    ChevronRight,
    Building2,
    FileText,
    Tag,
    User,
    Upload,
    ImageIcon,
    X,
    ExternalLink
} from 'lucide-react';


function Support() {
    
    const dispatch = useDispatch();
    const { supportTaskEmployee, detailSupportTaskEmployee, imageTask, fileTask } = useTaskData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    
    
    // Confirm Modal State
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [uploadType, setUploadType] = useState<"image" | "document" | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedProve, setUploadedProve] = useState<string>("");
    const [isConfirming, setIsConfirming] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        dispatch(getSupportTaskEmployee({ 
            token, 
            key: "supportTaskEmployee",
            page: currentPage,
            limit: 6 
        }) as any);
    }, [currentPage, dispatch]);

    const handleShowDetail = (id: number) => {
        const token = localStorage.getItem("userToken");
        dispatch(getSupportTaskEmployee({ 
            token, 
            key: "detailSupportTaskEmployee", 
            id 
        }) as any);
        setIsModalOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Upload and Confirm Functions
    const handleOpenConfirmModal = (e: React.MouseEvent, taskId: number) => {
        e.stopPropagation();
        setSelectedTaskId(taskId);
        setIsConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSelectedTaskId(null);
        setUploadType(null);
        setSelectedFile(null);
        setFilePreview(null);
        setUploadedProve("");
    };

    const handleUploadTypeChange = (type: "image" | "document") => {
        if (uploadType === type) {
            setUploadType(null);
            setSelectedFile(null);
            setFilePreview(null);
            setUploadedProve("");
        } else {
            setUploadType(type);
            setSelectedFile(null);
            setFilePreview(null);
            setUploadedProve("");
        }
    };

    const getAcceptedFileTypes = () => {
        if (uploadType === "image") {
            return "image/*";
        } else if (uploadType === "document") {
            return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
        }
        return "";
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUploadedProve("");

            if (uploadType === "image" && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.warning("Vui lòng chọn file để tải lên");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const token = localStorage.getItem("userToken");
            const payload = { formData, token };

            let uploadedUrl = "";
            if (uploadType === "image") {
                const result = await dispatch(uploadImageTask(payload) as any);
                if (result?.payload?.data?.success && !result?.error) {
                    uploadedUrl = imageTask || result?.payload?.data?.url || "";
                    setUploadedProve(uploadedUrl);
                    toast.success("Tải ảnh lên thành công!");
                } else {
                    toast.error("Tải ảnh thất bại");
                }
            } else if (uploadType === "document") {
                const result = await dispatch(uploadFileTask(payload) as any);
                if (result?.payload?.data?.success && !result?.error) {
                    uploadedUrl = fileTask || result?.payload?.data?.url || "";
                    setUploadedProve(uploadedUrl);
                    toast.success("Tải file lên thành công!");
                } else {
                    toast.error("Tải file thất bại");
                }
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Có lỗi xảy ra khi tải file");
        } finally {
            setIsUploading(false);
        }
    };

    const isImageUrl = (url: string) => {
        if (!url) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };


    const handleConfirmTask = async () => {
        if (!selectedTaskId) {
            toast.warning("Không tìm thấy nhiệm vụ");
            return;
        }

        if (!uploadedProve) {
            toast.warning("Vui lòng tải lên minh chứng hoàn thành");
            return;
        }

        setIsConfirming(true);
        try {
            const token = localStorage.getItem("userToken");
            const payload = {
                id: selectedTaskId,
                prove: uploadedProve,
                token
            };
            

            const result = await dispatch(supportTaskConfirm(payload) as any);

            if (result?.payload?.data?.success && !result?.error) {
                toast.success("Xác nhận hoàn thành nhiệm vụ thành công!");
                handleCloseConfirmModal();
                // Reload list
                dispatch(getSupportTaskEmployee({ 
                    token, 
                    key: "supportTaskEmployee",
                    page: currentPage,
                    limit: 6 
                }) as any);
            } else {
                toast.error(result?.payload?.message || "Xác nhận hoàn thành thất bại");
            }
        } catch (error) {
            console.error("Confirm error:", error);
            toast.error("Có lỗi xảy ra khi xác nhận hoàn thành");
        } finally {
            setIsConfirming(false);
        }
    };

    const renderPagination = () => {
        if (!supportTaskEmployee?.pagination) return null;
        
        const { page, totalPages } = supportTaskEmployee.pagination;
        const pages: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return (
            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => page > 1 && handlePageChange(page - 1)}
                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                    {pages.map((pageNum, idx) => (
                        <PaginationItem key={idx}>
                            {pageNum === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    onClick={() => handlePageChange(pageNum as number)}
                                    isActive={pageNum === page}
                                    className="cursor-pointer"
                                >
                                    {pageNum}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => page < totalPages && handlePageChange(page + 1)}
                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    };

    if (!supportTaskEmployee?.rows || supportTaskEmployee.rows.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                        <ClipboardList className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 text-center">Chưa có nhiệm vụ hỗ trợ nào</p>
                    <p className="text-sm text-slate-500 mt-2 text-center">Các nhiệm vụ được giao sẽ xuất hiện tại đây</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Nhiệm vụ hỗ trợ của tôi</h1>
                <p className="text-sm text-white mt-1">
                    Tổng số: {supportTaskEmployee.pagination?.total || 0} nhiệm vụ
                </p>
            </div>

            {/* Grid Layout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportTaskEmployee.rows.map((task: any) => {
                    const isChecked = task.checked === true;
                    return(
                        <Card 
                            key={task.id} 
                            onClick={() => handleShowDetail(Number(task.id))} 
                            className="group cursor-pointer bg-slate-800 hover:shadow-lg transition-all duration-300 py-0 pt-6"
                        >
                            <CardHeader className="space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs font-semibold">
                                        <Tag className="mr-1 h-3 w-3" />
                                        {task.type.name}
                                    </Badge>

                                    {isChecked && (
                                        <Badge className="bg-emerald-600 text-white text-[9px] text-xs font-bold px-1.5 py-0.5">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Đã xác nhận
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-base font-bold line-clamp-2 leading-tight">
                                    {task.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                    {task.description}
                                </p>
                                
                                {task.target_department && (
                                    <div className="flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md w-fit">
                                        <Building2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                                        <span className="truncate max-w-[180px]">{task.target_department.name}</span>
                                    </div>
                                )}

                                {task.status && (
                                    <Badge 
                                        variant="secondary"
                                        className={`text-sm px-4 py-2
                                            ${task.status.id === 4 ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' : ''}
                                            ${task.status.id === 5 ? 'bg-red-100 text-red-700 ring-1 ring-red-600/20' : ''}
                                            ${task.status.id !== 4 && task.status.id !== 5 ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20' : ''}
                                        `}
                                    >
                                        {task.status.name}
                                    </Badge>
                                )}

                                {task.prove && (
                                    <div className="flex items-center text-[9px] sm:text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md w-fit mt-2">
                                        {isImageUrl(task.prove) ? (
                                            <ImageIcon className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 shrink-0" />
                                        ) : (
                                            <FileText className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 shrink-0" />
                                        )}
                                        <span>Có minh chứng</span>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="py-3 border-t border-slate-200">
                                <div className="flex items-center gap-2 w-full">
                                    <Avatar className="h-8 w-8 ring-2 ring-slate-200">
                                        <AvatarImage src={task.requester?.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-semibold">
                                            {task.requester?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                                        <span className="text-xs font-semibold text-white truncate">
                                            {task.requester?.name}
                                        </span>
                                        <span className="text-xs text-slate-500">Người yêu cầu</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </CardFooter>
                                {task.status?.id !== 3 && (
                                    <button
                                        onClick={(e) => handleOpenConfirmModal(e, Number(task.id))}
                                        className="gap-1  px-2.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Xác nhận
                                    </button>
                                )}
                        </Card>
                    )
                })}
            </div>

            {/* Pagination */}
            {renderPagination()}

            {/* Modal Chi Tiết */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-slate-800">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{detailSupportTaskEmployee?.name || "Chi tiết nhiệm vụ"}</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về nhiệm vụ hỗ trợ</DialogDescription>
                    </DialogHeader>

                    {detailSupportTaskEmployee ? (
                        <div className="flex flex-col max-h-[85vh]">
                            {/* Header */}
                            <div className="py-5 text-white shrink-0 rounded-t-lg">
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <Badge className="bg-white text-blue-600 hover:bg-white text-xs font-bold">
                                        #{detailSupportTaskEmployee.id}
                                    </Badge>
                                    {detailSupportTaskEmployee.type?.name && (
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-xs">
                                            <Tag className="mr-1 h-3 w-3" />
                                            {detailSupportTaskEmployee.type.name}
                                        </Badge>
                                    )}
                                    {detailSupportTaskEmployee.accepted ? (
                                        <Badge className="bg-green-500 hover:bg-green-500 text-white border-none text-xs">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Đã nhận
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-slate-200 hover:bg-slate-200 text-slate-700 border-none text-xs">
                                            <Clock className="mr-1 h-3 w-3" />
                                            Chưa nhận
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold mb-4 leading-tight">
                                    {detailSupportTaskEmployee.name}
                                </h2>
                                
                                {/* Thông tin người tạo và phòng ban */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                                        <Avatar className="h-10 w-10 ring-2 ring-white/30">
                                            <AvatarImage src={detailSupportTaskEmployee.requester?.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-white text-blue-600 font-bold">
                                                {detailSupportTaskEmployee.requester?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-white/80">Người yêu cầu</p>
                                            <p className="text-sm font-semibold truncate">{detailSupportTaskEmployee.requester?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-white/80">Phòng ban</p>
                                            <p className="text-sm font-semibold truncate">
                                                {detailSupportTaskEmployee.target_department?.name || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <ScrollArea className="flex-1 overflow-auto">
                                <div className="py-5 space-y-5">
                                    {/* Mô tả */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <h4 className="text-sm font-bold text-white">Mô tả chi tiết</h4>
                                        </div>
                                        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap">
                                            {detailSupportTaskEmployee.description || "Không có mô tả"}
                                        </div>
                                    </section>

                                    {/* Trạng thái */}
                                    {detailSupportTaskEmployee.status && (
                                        <section className='flex justify-between'>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                                </div>
                                                <h4 className="text-sm font-bold text-white">Trạng thái xử lý</h4>
                                            </div>
                                            <Badge 
                                                className={`text-sm px-4 py-2
                                                    ${detailSupportTaskEmployee.status.id === 4 ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' : ''}
                                                    ${detailSupportTaskEmployee.status.id === 5 ? 'bg-red-100 text-red-700 ring-1 ring-red-600/20' : ''}
                                                    ${detailSupportTaskEmployee.status.id !== 4 && detailSupportTaskEmployee.status.id !== 5 ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20' : ''}
                                                `}
                                            >
                                                {detailSupportTaskEmployee.status.name}
                                            </Badge>
                                        </section>
                                    )}

                                    {/* Minh chứng */}
                                    {detailSupportTaskEmployee.prove && (
                                        <section>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                                    {isImageUrl(detailSupportTaskEmployee.prove) ? (
                                                        <ImageIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                                    ) : (
                                                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                                    )}
                                                </div>
                                                <h4 className="text-xs sm:text-sm font-bold text-white">Minh chứng hoàn thành</h4>
                                            </div>
                                            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg border border-slate-600">
                                                {isImageUrl(detailSupportTaskEmployee.prove) ? (
                                                    <div className="space-y-3">
                                                        <img
                                                            src={detailSupportTaskEmployee.prove || "/placeholder.svg"}
                                                            alt="Minh chứng"
                                                            onClick={() => setZoomedImage(detailSupportTaskEmployee.prove)}
                                                            className="w-full max-h-64 object-contain rounded-lg border border-slate-600 cursor-zoom-in hover:opacity-90 transition-opacity"
                                                        />
                                                        <a
                                                            href={detailSupportTaskEmployee.prove}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            Xem ảnh đầy đủ
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={detailSupportTaskEmployee.prove}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                                                    >
                                                        <FileText className="h-4 w-4 text-emerald-400" />
                                                        <span className="text-xs text-white font-medium">Xem tài liệu đính kèm</span>
                                                        <ExternalLink className="h-3 w-3 text-slate-400" />
                                                    </a>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </ScrollArea>
                            {zoomedImage && (
                                <div 
                                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                                    onClick={() => setZoomedImage(null)}
                                >
                                    <button
                                        onClick={() => setZoomedImage(null)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                    <img
                                        src={zoomedImage}
                                        alt="Ảnh phóng to"
                                        className="max-w-full max-h-full object-contain"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center">
                            <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                            <p className="text-slate-600 text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Task Modal */}
            <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
                <DialogContent className="max-w-lg bg-slate-900 border border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            </div>
                            Xác nhận hoàn thành nhiệm vụ
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Vui lòng tải lên minh chứng hoàn thành nhiệm vụ (hình ảnh hoặc tài liệu)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Upload Section */}
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <Upload size={16} className="text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-400">
                                    Minh chứng đã nộp *
                                </span>
                            </div>

                            <p className="text-xs text-slate-400 mb-3">
                                Chọn loại minh chứng bạn muốn tải lên:
                            </p>

                            {/* Upload Type Selection */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleUploadTypeChange("image")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                        uploadType === "image"
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                            : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                    }`}
                                >
                                    <ImageIcon size={24} />
                                    <span className="text-sm font-semibold">Hình ảnh</span>
                                    <span className="text-xs text-slate-500">JPG, PNG, GIF</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleUploadTypeChange("document")}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition ${
                                        uploadType === "document"
                                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                            : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                                    }`}
                                >
                                    <FileText size={24} />
                                    <span className="text-sm font-semibold">Tài liệu</span>
                                    <span className="text-xs text-slate-500">PDF, DOC, XLS</span>
                                </button>
                            </div>

                            {/* File Upload Input */}
                            {uploadType && (
                                <div>
                                    <label className="block w-full cursor-pointer">
                                        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 transition">
                                            <Upload size={16} className="text-emerald-400" />
                                            <span className="text-sm text-slate-300">
                                                {selectedFile
                                                    ? selectedFile.name
                                                    : `Chọn ${uploadType === "image" ? "hình ảnh" : "tài liệu"}`}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept={getAcceptedFileTypes()}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Image Preview */}
                                    {filePreview && uploadType === "image" && (
                                        <div className="mt-3">
                                            <img
                                                src={filePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                            />
                                        </div>
                                    )}

                                    {/* File Info */}
                                    {selectedFile && (
                                        <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {uploadType === "image" ? (
                                                        <ImageIcon size={16} className="text-emerald-400" />
                                                    ) : (
                                                        <FileText size={16} className="text-emerald-400" />
                                                    )}
                                                    <span className="text-xs text-slate-300 truncate max-w-[200px]">
                                                        {selectedFile.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    {selectedFile && !uploadedProve && (
                                        <button
                                            type="button"
                                            onClick={handleUpload}
                                            disabled={isUploading}
                                            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                                        >
                                            <Upload size={16} />
                                            {isUploading ? "Đang tải lên..." : "Tải lên"}
                                        </button>
                                    )}

                                    {/* Upload Success Message */}
                                    {uploadedProve && (
                                        <div className="mt-3 p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
                                            <p className="text-xs text-emerald-400 text-center">
                                                ✓ Đã tải lên thành công!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={handleCloseConfirmModal}
                            disabled={isConfirming}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-semibold rounded-lg transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmTask}
                            disabled={isConfirming || !uploadedProve}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                        >
                            <CheckCircle2 size={18} />
                            {isConfirming ? "Đang xử lý..." : "Xác nhận hoàn thành"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Support;
