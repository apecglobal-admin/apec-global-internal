import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@/components/ui/pagination';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supportTaskChecked, getSupportTaskPending } from '@/src/features/task/api';
import { toast } from 'react-toastify';
import PopupComponent, { usePopup } from "@/components/PopupComponent";

import { 
    ClipboardList, 
    CheckCircle2, 
    Clock, 
    ChevronRight,
    Building2,
    FileText,
    Tag,
    User,
    ImageIcon,
    ExternalLink,
    Check,
    Loader2,
    CheckSquare,
    X
} from 'lucide-react';

interface SupportTaskPendingProps {
    tasks: any[];
    pagination?: { page: number; totalPages: number; };
    onPageChange: (page: number) => void;
}

function SupportTaskPending({ tasks, pagination, onPageChange }: SupportTaskPendingProps) {
    const dispatch = useDispatch();
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    

    const handleShowDetail = (task: any) => {
        if (!isSelectMode) {
            setSelectedTask(task);
            setIsModalOpen(true);
        }
    };

    // Kích hoạt chế độ chọn
    const enterSelectMode = () => {
        setIsSelectMode(true);
        setSelectedIds([]);
    };

    // Thoát chế độ chọn
    const exitSelectMode = () => {
        setIsSelectMode(false);
        setSelectedIds([]);
    };

    const toggleSelect = (id: string, task: any) => {
        // Không cho phép chọn task đã được checked
        if (task.checked) {
            toast.warn("Nhiệm vụ này đã được đánh dấu hoàn thành");
            return;
        }
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // Xử lý hoàn thành nhiều task
    const handleCompleteMultiple = async () => {
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một nhiệm vụ");
            return;
        }

        const token = localStorage.getItem("userToken");

        openPopup({
            type: "success",
            title: "Xác nhận hoàn thành",
            message: `Bạn có chắc chắn muốn đánh dấu hoàn thành ${selectedIds.length} nhiệm vụ đã chọn?`,
            showActionButtons: true,
            confirmText: "Đồng ý hoàn thành",
            onConfirm: async () => {
                setIsProcessing(true);
                try {
                    const response = await dispatch(supportTaskChecked({ 
                        token, 
                        id: selectedIds 
                    }) as any);
                    
                    if (response.payload.status === 200 || response.payload.status === 201) {
                        toast.success("Hoàn thành nhiệm vụ thành công!");
                        exitSelectMode();
                        // Reload danh sách
                        dispatch(getSupportTaskPending({ 
                            token, 
                            key: "supportTaskPending", 
                            page: pagination?.page || 1 
                        }) as any);
                    } else {
                        toast.error(response.payload.data?.message || "Thao tác thất bại");
                    }
                } catch (error) {
                    toast.error("Lỗi hệ thống");
                } finally {
                    setIsProcessing(false);
                    closePopup();
                }
            }
        });
    };

    const getStatusColor = (statusId: number) => {
        switch (statusId) {
            case 1: return "bg-yellow-100 text-yellow-700"; // Chờ xử lý
            case 2: return "bg-blue-100 text-blue-700"; // Đang xử lý
            case 3: return "bg-emerald-100 text-emerald-700"; // Đã hoàn thành
            case 4: return "bg-red-100 text-red-700"; // Từ chối
            default: return "bg-slate-100 text-slate-700";
        }
    };

    const isImageUrl = (url: string) => {
        if (!url) return false;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3 sm:mb-4">
                    <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-800 text-center">Chưa có nhiệm vụ chờ duyệt</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">Các nhiệm vụ chờ duyệt sẽ xuất hiện tại đây</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />

            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                {!isSelectMode ? (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h2 className="font-bold text-white">Nhiệm vụ chờ duyệt</h2>
                        </div>
                        <Button 
                            onClick={enterSelectMode}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <CheckSquare className="mr-2 h-4 w-4" /> Hoàn thành nhiều
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-emerald-500">
                                Đang chọn để hoàn thành
                            </Badge>
                            <span className="text-sm text-slate-300 font-medium">
                                Đã chọn: <span className="text-white text-lg">{selectedIds.length}</span>
                            </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="ghost" onClick={exitSelectMode} className="text-slate-400 hover:text-white">
                                Hủy bỏ
                            </Button>
                            <Button 
                                onClick={handleCompleteMultiple}
                                disabled={selectedIds.length === 0 || isProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isProcessing ? (
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Xác nhận hoàn thành ({selectedIds.length})
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Grid Layout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {tasks.map((task: any) => {
                    const isSelected = selectedIds.includes(String(task.id));
                    const isChecked = task.checked === true;
                    return (
                        <Card 
                            key={task.id} 
                            onClick={() => isSelectMode ? toggleSelect(String(task.id), task) : handleShowDetail(task)} 
                            className={`group flex flex-col h-full bg-slate-800 border-slate-800 hover:shadow-lg transition-all duration-300 overflow-hidden relative ${
                                isSelected ? 'ring-2 ring-emerald-500/20 border-emerald-500' : ''
                            } ${isChecked ? 'opacity-60 cursor-not-allowed' : (isSelectMode ? 'cursor-pointer' : 'cursor-pointer')}`}
                        >
                            {isSelectMode && (
                                <div className="absolute top-4 left-4 z-10 scale-125">
                                    <Checkbox 
                                        checked={isSelected}
                                        disabled={isChecked}
                                        onCheckedChange={() => toggleSelect(String(task.id), task)}
                                        className="border-slate-500 data-[state=checked]:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            )}

                            <CardHeader className={`space-y-0.5 md:space-y-2 p-3 sm:p-4 text-white ${isSelectMode ? 'pl-12' : ''}`}>
                                <div className="flex justify-between items-start gap-1.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <Badge className="bg-white text-slate-800 hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5">
                                            <Tag className="mr-1 h-2 w-2" />
                                            {task.type?.name || 'N/A'}
                                        </Badge>
                                        {isChecked && (
                                            <Badge className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5">
                                                <CheckCircle2 className="mr-1 h-2 w-2" />
                                                Đã hoàn thành
                                            </Badge>
                                        )}
                                    </div>
                                    {/* Nút hoàn thành đơn lẻ */}
                                    {!isSelectMode && !isChecked && (
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                enterSelectMode(); 
                                                toggleSelect(String(task.id), task); 
                                            }}
                                            className="p-1 hover:text-emerald-500 text-slate-500 transition-colors"
                                            title="Hoàn thành"
                                        >
                                            <CheckCircle2 className="h-6 w-6" color="green" />
                                        </button>
                                    )}
                                </div>
                                <CardTitle className="text-xs sm:text-sm font-bold line-clamp-2 text-white leading-tight">
                                    {task.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1 p-3 sm:p-4 pt-0">
                                <p className="text-[10px] sm:text-xs text-white/80 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                                    {task.description}
                                </p>
                                {task.target_department && (
                                    <div className="flex items-center text-[9px] sm:text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md w-fit">
                                        <Building2 className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500 shrink-0" />
                                        <span className="truncate max-w-[120px] sm:max-w-[140px]">{task.target_department.name}</span>
                                    </div>
                                )}
                                {/* Prove indicator */}
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

                            <CardFooter className="p-2.5 sm:p-3 pt-2 border-t border-slate-700 bg-slate-850 transition-colors">
                                <div className="flex items-center gap-2 w-full">
                                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-white shadow-sm shrink-0">
                                        <AvatarImage src={task.employee?.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-slate-800 text-white text-[9px] sm:text-[10px] font-bold">
                                            {task.employee?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                                        <span className="text-[10px] sm:text-xs font-semibold text-white truncate">{task.employee?.name}</span>
                                        <span className="text-[8px] sm:text-[9px] text-slate-400">Người thực hiện</span>
                                    </div>
                                    {!isSelectMode && (
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors shrink-0">
                                            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Pagination */}
            {pagination && <PaginationComponent pagination={pagination} onPageChange={onPageChange} />}

            {/* Modal Chi Tiết */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[96vw] sm:w-[90vw] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[92vh] sm:max-h-[88vh]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedTask?.name || "Chi tiết"}</DialogTitle>
                        <DialogDescription>Chi tiết nhiệm vụ hỗ trợ chờ duyệt</DialogDescription>
                    </DialogHeader>

                    {selectedTask ? (
                        <div className="flex flex-col max-h-[92vh] sm:max-h-[88vh]">
                            {/* Header Panel */}
                            <div className="p-3 sm:p-5 bg-slate-800 text-white shrink-0">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    {/* <Badge className="bg-white text-slate-800 hover:bg-slate-100 text-[9px] sm:text-xs font-bold">
                                        #{selectedTask.id}
                                    </Badge> */}
                                    {selectedTask.type?.name && (
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[9px] sm:text-xs">
                                            <Tag className="mr-1 h-2.5 w-2.5" />
                                            {selectedTask.type.name}
                                        </Badge>
                                    )}
                                    <Badge className={`${getStatusColor(selectedTask.status?.id)} text-[9px] sm:text-xs font-bold`}>
                                        {selectedTask.status?.id === 3 ? (
                                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                                        ) : (
                                            <Clock className="mr-1 h-2.5 w-2.5" />
                                        )}
                                        {selectedTask.status?.name}
                                    </Badge>
                                    {!selectedTask.checked && (
                                        <Badge className="bg-red-600 text-white text-[9px] sm:text-xs font-bold">
                                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                                            Chưa duyệt
                                        </Badge>
                                    )}
                                    {selectedTask.checked && (
                                        <Badge className="bg-emerald-600 text-white text-[9px] sm:text-xs font-bold">
                                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                                            Duyệt hoàn thành
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight mb-3 leading-tight text-balance">
                                    {selectedTask.name}
                                </h2>
                                
                                {/* Thông tin người thực hiện và phòng ban */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                                    <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-white/10 rounded-lg">
                                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-white/20 shrink-0">
                                            <AvatarImage src={selectedTask.employee?.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-white text-slate-800 font-bold text-xs">
                                                {selectedTask.employee?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] sm:text-[10px] text-white/70">Người thực hiện</p>
                                            <p className="text-xs sm:text-sm font-semibold truncate">{selectedTask.employee?.name}</p>
                                        </div>
                                        {selectedTask.accepted && (
                                            <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px] shrink-0">
                                                <CheckCircle2 className="mr-0.5 h-2 w-2" />
                                                Đã nhận
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-white/10 rounded-lg">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <Building2 className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] sm:text-[10px] text-white/70">Phòng ban cần hỗ trợ</p>
                                            <p className="text-xs sm:text-sm font-semibold truncate">{selectedTask.target_department?.name || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <ScrollArea className="flex-1 overflow-auto">
                                <div className="p-3 sm:p-5 bg-slate-800 space-y-3 sm:space-y-4">
                                    {/* Mô tả */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                                                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                            </div>
                                            <h4 className="text-xs sm:text-sm font-bold text-white">Mô tả</h4>
                                        </div>
                                        <div className="text-xs sm:text-sm text-black leading-relaxed bg-slate-50 p-3 sm:p-3.5 rounded-lg border border-slate-100 whitespace-pre-wrap">
                                            {selectedTask.description || "Không có mô tả"}
                                        </div>
                                    </section>

                                    {/* Minh chứng */}
                                    {selectedTask.prove && (
                                        <section>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                                    {isImageUrl(selectedTask.prove) ? (
                                                        <ImageIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                                    ) : (
                                                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                                    )}
                                                </div>
                                                <h4 className="text-xs sm:text-sm font-bold text-white">Minh chứng hoàn thành</h4>
                                            </div>
                                            <div className="bg-slate-700 p-3 sm:p-4 rounded-lg border border-slate-600">
                                                {isImageUrl(selectedTask.prove) ? (
                                                    <div className="space-y-3">
                                                        <img
                                                            src={selectedTask.prove || "/placeholder.svg"}
                                                            alt="Minh chứng"
                                                            onClick={() => setZoomedImage(selectedTask.prove)}
                                                            className="w-full max-h-64 object-contain rounded-lg border border-slate-600 cursor-zoom-in hover:opacity-90 transition-opacity"
                                                        />
                                                        <a
                                                            href={selectedTask.prove}
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
                                                        href={selectedTask.prove}
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
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="h-60 sm:h-80 flex flex-col items-center justify-center bg-slate-800">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 border-3 border-white/20 border-t-white rounded-full animate-spin mb-3" />
                            <p className="text-white/70 text-xs sm:text-sm font-medium">Đang tải dữ liệu...</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function PaginationComponent({
    pagination,
    onPageChange,
}: { pagination: { page: number; totalPages: number }; onPageChange: (p: number) => void }) {
    const { page, totalPages } = pagination;
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <div className="flex justify-center pt-3 sm:pt-4 border-t border-slate-200">
            <Pagination>
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => page > 1 && onPageChange(page - 1)}
                            className={`cursor-pointer h-7 sm:h-8 px-2 sm:px-2.5 text-[10px] sm:text-xs ${
                                page === 1
                                    ? "opacity-40 pointer-events-none"
                                    : "hover:bg-slate-800 hover:text-white"
                            }`}
                        />
                    </PaginationItem>

                    {/* Mobile: Show current/total */}
                    <div className="flex sm:hidden items-center px-2.5 text-xs font-medium text-slate-600">
                        {page} / {totalPages}
                    </div>

                    {/* Desktop: Full pagination */}
                    <div className="hidden sm:flex items-center gap-0.5">
                        {pages.map((pageNum, idx) => (
                            <PaginationItem key={idx}>
                                {pageNum === "..." ? (
                                    <PaginationEllipsis className="h-8 w-8" />
                                ) : (
                                    <PaginationLink
                                        onClick={() => onPageChange(pageNum as number)}
                                        isActive={pageNum === page}
                                        className={`cursor-pointer h-8 w-8 text-xs transition-all ${
                                            pageNum === page
                                                ? "bg-slate-800 text-white hover:bg-slate-700"
                                                : "hover:bg-slate-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                    </div>

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => page < totalPages && onPageChange(page + 1)}
                            className={`cursor-pointer h-7 sm:h-8 px-2 sm:px-2.5 text-[10px] sm:text-xs ${
                                page === totalPages
                                    ? "opacity-40 pointer-events-none"
                                    : "hover:bg-slate-800 hover:text-white"
                            }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default SupportTaskPending