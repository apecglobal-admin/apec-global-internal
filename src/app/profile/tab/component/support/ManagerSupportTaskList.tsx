import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ClipboardList, Building2, Check, X, Loader2, UserCircle2, 
    CheckSquare, Square, MousePointerClick, Ban, Tag
} from 'lucide-react';
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from '@/components/ui/pagination';
import PopupComponent, { usePopup } from "@/components/PopupComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDispatch } from 'react-redux';
import { getSupportTaskManager, supportTaskAccept, supportTaskReject } from '@/src/features/task/api';
import { toast } from 'react-toastify';

interface ManagerSupportTaskListProps {
    tasks: any[];
    pagination?: { page: number; totalPages: number; };
    onPageChange: (page: number) => void;
}

function ManagerSupportTaskList({ tasks, pagination, onPageChange }: ManagerSupportTaskListProps) {
    const dispatch = useDispatch();
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();

    // State quản lý chế độ chọn
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [currentAction, setCurrentAction] = useState<'accept' | 'reject' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    // Kích hoạt chế độ chọn
    const enterSelectMode = (action: 'accept' | 'reject') => {
        setIsSelectMode(true);
        setCurrentAction(action);
        setSelectedIds([]);
    };

    // Thoát chế độ chọn
    const exitSelectMode = () => {
        setIsSelectMode(false);
        setCurrentAction(null);
        setSelectedIds([]);
        setRejectReason('');
        setShowRejectForm(false);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // Thực thi API (Luôn gửi mảng)
    const handleCommitAction = async () => {
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một mục");
            return;
        }

        // Nếu là reject, hiển thị form nhập lý do
        if (currentAction === 'reject') {
            setShowRejectForm(true);
            return;
        }

        // Xử lý accept
        executeAction();
    };

    // Thực thi action với API
    const executeAction = async () => {
        if (currentAction === 'reject' && !rejectReason.trim()) {
            toast.warn("Vui lòng nhập lý do từ chối");
            return;
        }

        const token = localStorage.getItem("userToken");
        const apiCall = currentAction === 'accept' ? supportTaskAccept : supportTaskReject;
        const label = currentAction === 'accept' ? "Duyệt" : "Từ chối";

        const payload: any = { token, id: selectedIds };
        if (currentAction === 'reject') {
            payload.reason = rejectReason;
        }

        openPopup({
            type: currentAction === 'accept' ? "success" : "warning",
            title: `Xác nhận ${label} hàng loạt`,
            message: `Bạn có chắc chắn muốn ${label.toLowerCase()} ${selectedIds.length} mục đã chọn?${
                currentAction === 'reject' ? `\n\nLý do: ${rejectReason}` : ''
            }`,
            showActionButtons: true,
            confirmText: `Đồng ý ${label}`,
            onConfirm: async () => {
                setIsProcessing(true);
                try {
                    const response = await dispatch(apiCall(payload) as any);
                    if (response.payload.status === 200 || response.payload.status === 201) {
                        toast.success(`${label} thành công!`);
                        exitSelectMode();
                        dispatch(getSupportTaskManager({ token, key: "supportTaskManager", page: 1 }) as any);
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

    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/20 text-slate-400">
                <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
                <p>Không có dữ liệu yêu cầu hỗ trợ</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />

            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                {!isSelectMode ? (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <ClipboardList className="h-5 w-5 text-blue-500" />
                            </div>
                            <h2 className="font-bold text-white text-sm sm:text-base">
                                Danh sách yêu cầu hỗ trợ
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Button 
                                variant="outline" 
                                onClick={() => enterSelectMode('reject')}
                                className="w-full sm:w-auto border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white"
                            >
                                <Ban className="mr-2 h-4 w-4" /> 
                                <span className="text-sm">Từ chối nhiều</span>
                            </Button>
                            <Button 
                                onClick={() => enterSelectMode('accept')}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <CheckSquare className="mr-2 h-4 w-4" /> 
                                <span className="text-sm">Duyệt nhiều</span>
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <Badge className={currentAction === 'accept' ? "bg-emerald-500" : "bg-rose-500" }>
                                Đang chọn để {currentAction === 'accept' ? "Duyệt" : "Từ chối"}
                            </Badge>
                            <span className="md:text-md text-xs text-slate-300 font-medium ">
                                Đã chọn: <span className="text-white text-lg md:text-md text-sm">{selectedIds.length}</span>
                            </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="ghost" onClick={exitSelectMode} className="bg-black text-white hover:text-white">
                                Hủy bỏ
                            </Button>
                            <Button 
                                onClick={handleCommitAction}
                                disabled={selectedIds.length === 0 || isProcessing}
                                className={currentAction === 'accept' ? "md:text-md text-xs bg-emerald-600 hover:bg-emerald-700" : "md:text-md text-xs bg-rose-600 hover:bg-rose-700"}
                            >
                                {isProcessing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                Xác nhận {currentAction === 'accept' ? "Duyệt" : "Từ chối"} ({selectedIds.length})
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasks.map((task) => {
                    const isSelected = selectedIds.includes(String(task.id));
                    return (
                        <Card 
                            key={task.id}
                            onClick={() => isSelectMode && toggleSelect(String(task.id))}
                            className={`group py-4 flex flex-col h-full bg-slate-800 border-slate-700 hover:shadow-xl transition-all duration-300 relative ${
                                isSelected 
                                ? (currentAction === 'accept' ? 'ring-2 ring-emerald-500/20 border-emerald-500' : 'ring-2 ring-rose-500/20 border-rose-500') 
                                : ''
                            } ${isSelectMode ? 'cursor-pointer' : ''}`}
                        >
                            {isSelectMode && (
                                <div className="absolute top-4 left-4 z-10 scale-125">
                                    <Checkbox 
                                        checked={isSelected}
                                        onCheckedChange={() => toggleSelect(String(task.id))}
                                        className="border-slate-500 data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            )}

                            <CardHeader className={`space-y-2 text-white ${isSelectMode ? 'pl-12' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <Badge className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] w-fit">
                                            <Tag className="mr-1 h-3 w-3" />
                                            {task.type?.name}
                                        </Badge>
                                        {task.status?.name && (
                                            <Badge variant="outline" className="text-[9px] border-slate-500 text-slate-300">
                                                {task.status.name}
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    {!isSelectMode && (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); enterSelectMode('accept'); toggleSelect(String(task.id)); }}
                                                className="p-1 hover:text-emerald-500 text-slate-500 transition-colors"
                                                title="Duyệt"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-sm font-bold line-clamp-2 text-white pt-1">
                                    {task.support_task?.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className='flex items-start mb-3'>
                                    <span className='text-xs text-slate-400'>Mô tả:</span>
                                    <p className="text-xs text-slate-300 line-clamp-3 ml-2 leading-relaxed">
                                        {task.support_task?.description}
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    {task.target_department && (
                                        <div className="flex items-center text-[10px] font-medium text-slate-200 bg-slate-700/50 px-2 py-1.5 rounded-md">
                                            <Building2 className="mr-2 h-3 w-3 text-blue-400 shrink-0" />
                                            <span className="truncate">{task.target_department.name}</span>
                                        </div>
                                    )}
                                    {task.requester?.name && (
                                        <div className="flex items-center text-[10px] font-medium text-slate-200 bg-slate-700/50 px-2 py-1.5 rounded-md">
                                            <UserCircle2 className="mr-2 h-3 w-3 text-orange-400 shrink-0" />
                                            <span className="truncate">Tạo yêu cầu: {task.requester.name}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="border-t border-slate-700 pt-3">
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar className="h-8 w-8 ring-2 ring-slate-700">
                                        <AvatarImage src={task.employee?.avatar} />
                                        <AvatarFallback className="bg-slate-700 text-white text-[10px]">
                                            {task.employee?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-white truncate">
                                            {task.employee?.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400">Cần Hỗ trợ</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Form nhập lý do từ chối */}
            {showRejectForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl max-w-md w-full">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500/10 rounded-lg">
                                    <Ban className="h-5 w-5 text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Nhập lý do từ chối</h3>
                                    <p className="text-xs text-slate-400">Đang từ chối {selectedIds.length} mục</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reject-reason" className="text-sm text-slate-300">
                                    Lý do từ chối <span className="text-rose-500">*</span>
                                </Label>
                                <Textarea
                                    id="reject-reason"
                                    placeholder="Nhập lý do từ chối yêu cầu hỗ trợ..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-[120px] resize-none"
                                    autoFocus
                                />
                                <p className="text-xs text-slate-500">
                                    {rejectReason.length}/500 ký tự
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowRejectForm(false);
                                        setRejectReason('');
                                    }}
                                    className="flex-1 text-slate-400 hover:text-white hover:bg-slate-700"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    onClick={executeAction}
                                    disabled={!rejectReason.trim() || isProcessing}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Xác nhận từ chối
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {pagination && <PaginationComponent pagination={pagination} onPageChange={onPageChange} />}
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


export default ManagerSupportTaskList;