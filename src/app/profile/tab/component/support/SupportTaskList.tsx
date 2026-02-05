import React, { useEffect, useState } from 'react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { getListDepartment, getSupportTask, getSupportTaskTypes, supportTaskDelete } from '@/src/features/task/api';
import PopupComponent, { usePopup } from "@/components/PopupComponent";
import { 
    CalendarDays, 
    ClipboardList, 
    CheckCircle2, 
    Clock, 
    ChevronRight,
    Building2,
    Users,
    FileText,
    Tag,
    Trash2,
    AlertTriangle,
    XCircle,
    Search,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';
import FilterableSelector from '@/components/FilterableSelector';

interface SupportTaskListProps {
    tasks: any[];
    listDepartment: any[];
    pagination?: {
        page: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onTaskDeleted?: () => void; // Callback để refresh danh sách sau khi xóa

}

function SupportTaskList({ tasks, listDepartment, pagination, onPageChange, onTaskDeleted }: SupportTaskListProps) {
    const dispatch = useDispatch();
    const { 
        detailSupportTask,            
        supportTaskTypes,
    } = useTaskData();
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();


    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleShowDetail = (id: number) => {
        const token = localStorage.getItem("userToken");
        dispatch(getSupportTask({ token, key: "detailSupportTask", id }) as any);
        setIsModalOpen(true);
    };



    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        
        const token = localStorage.getItem("userToken");
        openPopup({
            type: "warning",
            title: "Xác nhận xóa nhiệm vụ",
            message: "Bạn có chắc chắn muốn xóa nhiệm vụ này không? Hành động này không thể hoàn tác.",
            confirmText: "Xóa nhiệm vụ",
            cancelText: "Hủy",
            showActionButtons: true,
            onConfirm: async () => {
                try {
                    const res = await dispatch(
                        supportTaskDelete({ id, token }) as any
                    );
                    
                    if (res.payload?.data?.success) {
                        toast.success(res.payload.data.message || "Xóa nhiệm vụ thành công!");
                        if (onTaskDeleted) {
                            onTaskDeleted();
                        }
                        closePopup();
                    } else {
                        toast.error(res.payload?.message || res.payload?.data?.message || "Xóa nhiệm vụ thất bại!");
                        closePopup();
                    }
                } catch (error) {
                    toast.error("Có lỗi xảy ra khi xóa nhiệm vụ!");
                    console.error('Delete error:', error);
                    closePopup();
                }
            },
            onCancel: closePopup,
        });
    };

    if (!tasks || tasks.length === 0) {
        return (
            <>
                <div className="flex flex-col bg-slate-800 items-center justify-center py-8 sm:py-12 px-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3 sm:mb-4">
                        <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <p className="text-base sm:text-lg font-bold text-white text-center">Chưa có yêu cầu hỗ trợ nào</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">Các yêu cầu mới sẽ xuất hiện tại đây</p>
                </div>
            </>
        );
    }

    return (
        <div className="max-w-7xl mx-auto md:p-0">

            {/* Grid Layout Cards - More Compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                {tasks.map((task: any) => (
                    <Card 
                        key={task.id} 
                        onClick={() => handleShowDetail(Number(task.id))} 
                        className="group flex flex-col h-full cursor-pointer bg-slate-800 border-slate-800 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                        <CardHeader className="space-y-0.5 md:space-y-2 p-3 sm:p-4 text-white">
                            <div className="flex justify-between items-start gap-1.5">
                                <Badge className="bg-white text-slate-800 hover:bg-slate-100 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5">
                                    <Tag className="mr-1 h-2 w-2" />
                                    {task.type?.name || 'N/A'}
                                </Badge>
                                {/* Nút xóa nhiệm vụ */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => handleDeleteClick(e, task.id)}
                                    className="h-6 w-6 sm:h-7 sm:w-7 text-white bg-red-500 hover:bg-red-600 transition-colors rounded-md"
                                >
                                    <XCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </Button>
                            </div>
                            <CardTitle className="text-xs sm:text-sm font-bold line-clamp-2 text-white leading-tight">
                                Tiêu đề: {task.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 p-3 sm:p-4 pt-0">
                            <p className="text-[10px] sm:text-xs text-white line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                                Mô tả: {task.description}
                            </p>
                            {task.target_department && (
                                <div className="flex items-center text-[9px] sm:text-[10px] font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md w-fit">
                                    <Building2 className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500 shrink-0" />
                                    <span className="truncate max-w-[120px] sm:max-w-[140px]">{task.target_department.name}</span>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="p-2.5 sm:p-3 pt-2 border-t border-slate-700 bg-slate-850 transition-colors">
                            <div className="flex items-center gap-2 w-full">
                                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-white shadow-sm shrink-0">
                                    <AvatarImage src={task.requester?.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="bg-slate-800 text-white text-[9px] sm:text-[10px] font-bold">
                                        {task.requester?.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                                    <span className="text-[10px] sm:text-xs font-semibold text-white truncate">{task.requester?.name}</span>
                                    <span className="text-[8px] sm:text-[9px] text-slate-400">Người yêu cầu</span>
                                </div>
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors shrink-0">
                                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {pagination && <PaginationComponent pagination={pagination} onPageChange={onPageChange} />}

            {/* Popup Component */}
            <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />

            {/* Modal Chi Tiết */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-[96vw] sm:w-[90vw] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[92vh] sm:max-h-[88vh]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{detailSupportTask?.name || "Chi tiết"}</DialogTitle>
                        <DialogDescription>Chi tiết yêu cầu hỗ trợ hệ thống</DialogDescription>
                    </DialogHeader>

                    {detailSupportTask ? (
                        <div className="flex flex-col max-h-[92vh] sm:max-h-[88vh]">
                            {/* Header Panel - More Compact */}
                            <div className="p-3 sm:p-5 bg-slate-800 text-white shrink-0">
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    <Badge className="bg-white text-slate-800 hover:bg-slate-100 text-[9px] sm:text-xs font-bold">
                                        #{detailSupportTask.id}
                                    </Badge>
                                    {detailSupportTask.type?.name && (
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[9px] sm:text-xs">
                                            <Tag className="mr-1 h-2.5 w-2.5" />
                                            {detailSupportTask.type.name}
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight mb-3 leading-tight text-balance">
                                    {detailSupportTask.name}
                                </h2>
                                
                                {/* Thông tin người tạo và phòng ban */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                                    <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-white/10 rounded-lg">
                                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-white/20 shrink-0">
                                            <AvatarImage src={detailSupportTask.requester?.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-white text-slate-800 font-bold text-xs">
                                                {detailSupportTask.requester?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] sm:text-[10px] text-white/70">Người yêu cầu</p>
                                            <p className="text-xs sm:text-sm font-semibold truncate">{detailSupportTask.requester?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-white/10 rounded-lg">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                            <Building2 className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] sm:text-[10px] text-white/70">Phòng ban</p>
                                            <p className="text-xs sm:text-sm font-semibold truncate">{detailSupportTask.target_department?.name || "—"}</p>
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
                                            {detailSupportTask.description || "Không có mô tả"}
                                        </div>
                                    </section>

                                    {/* Nhân sự xử lý */}
                                    <section>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                                                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                                            </div>
                                            <h4 className="text-xs sm:text-sm font-bold text-white">
                                                Nhân sự xử lý
                                                <span className="ml-1.5 text-white/80 font-normal text-[10px] sm:text-xs">
                                                    ({detailSupportTask.assignment?.length || 0})
                                                </span>
                                            </h4>
                                        </div>
                                        
                                        {detailSupportTask.assignment && detailSupportTask.assignment.length > 0 ? (
                                            <div className="space-y-2">
                                                {detailSupportTask.assignment.map((item: any) => (
                                                    <div 
                                                        key={item.id} 
                                                        className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg border border-slate-600 bg-slate-700 hover:border-slate-500 hover:shadow-sm transition-all"
                                                    >
                                                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-slate-600 shrink-0">
                                                            <AvatarImage src={item.employee?.avatar || "/placeholder.svg"} />
                                                            <AvatarFallback className="bg-slate-800 text-white text-[10px] font-bold">
                                                                {item.employee?.name?.charAt(0) || 'E'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs sm:text-sm font-semibold text-white truncate">{item.employee?.name}</p>
                                                        </div>
                                                        {item.accepted ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shrink-0">
                                                                <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" /> 
                                                                {item.status?.name || "Đã nhận"}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-200 border-none text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 shrink-0">
                                                                <Clock className="mr-0.5 h-2.5 w-2.5" /> 
                                                                Chưa xác nhận
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mb-2">
                                                    <Users className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <p className="text-xs font-medium text-slate-500">Chưa có nhân sự được phân công</p>
                                            </div>
                                        )}
                                    </section>
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
    );
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
        <div className="flex justify-center pt-3 sm:pt-4 border-t border-slate-200 mt-4">
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

export default SupportTaskList;