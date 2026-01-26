import React, { useEffect, useState } from 'react'
import { personalRequestAssign, personalRequestHonor } from "@/src/services/api";
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
import { ArrowLeft, Award } from 'lucide-react';
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

// Component hiển thị chi tiết
const RequestDetail = ({ request, onBack, onHonor }: { request: any; onBack: () => void; onHonor: (id: string, reason: string) => void }) => {
    const [showHonorDialog, setShowHonorDialog] = useState(false);
    const [honorReason, setHonorReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            className="text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Quay lại
                        </Button>
                        <h2 className="text-2xl font-bold text-white">Chi tiết yêu cầu</h2>
                    </div>
                    
                    {/* Honor Button */}
                    {request.status_requests.id !== 5 && (
                        <Button
                            onClick={handleHonorClick}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                        >
                            <Award className="h-5 w-5 mr-2" />
                            Vinh danh
                        </Button>

                    )}

                    {request.status_requests.id === 5 && (
                        <div
                            className="flex p-1 rounded bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                        >
                            <Award className="h-5 w-5 mr-2" />
                            <span>
                                Đã vinh danh


                            </span>
                        </div>

                    )}
                </div>

                {/* Content */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-6 space-y-6">
                        {/* Employee Info */}
                        <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={request.employee?.avatar} />
                                <AvatarFallback className="bg-slate-700 text-white text-xl">
                                    {request.employee?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg text-white">
                                    {request.employee?.name}
                                </p>
                                <p className="text-sm text-slate-400">Người tạo yêu cầu</p>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Tiêu đề</h3>
                                <p className="text-lg font-semibold text-white">
                                    {request.title}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-2">Mô tả</h3>
                                <p className="text-slate-200 leading-relaxed">
                                    {request.description}
                                </p>
                            </div>

                            {request.reason && (
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2">Lý do</h3>
                                    <p className="text-slate-200 leading-relaxed">
                                        {request.reason}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Status & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-2">Loại yêu cầu</p>
                                <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700 text-base px-4 py-1">
                                    {request.type_requests?.name}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-2">Trạng thái</p>
                                <Badge variant="secondary" className="bg-amber-900/50 text-amber-300 text-base px-4 py-1">
                                    {request.status_requests?.name}
                                </Badge>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Ngày yêu cầu</p>
                                <p className="text-white font-medium">
                                    {formatDate(request.date_request)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Ngày tạo</p>
                                <p className="text-white font-medium">
                                    {formatDateTime(request.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">Cập nhật lần cuối</p>
                                <p className="text-white font-medium">
                                    {formatDateTime(request.updated_at)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Honor Dialog */}
            <Dialog open={showHonorDialog} onOpenChange={setShowHonorDialog}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Award className="h-6 w-6 text-yellow-500" />
                            Vinh danh yêu cầu
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
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

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setShowHonorDialog(false)}
                            disabled={isSubmitting}
                            className="text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleHonorSubmit}
                            disabled={isSubmitting || !honorReason.trim()}
                            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
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
    const { listPersonalRequestAssign, detailPersonalRequestAssign } = useProfileData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const limit = 6;

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(personalRequestAssign({
                page: currentPage,
                limit,
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
                    limit,
                    token: token,
                    key: "listPersonalRequestAssign"
                }) as any);
            } else {
                toast.error(result.payload?.data?.message || 'Có lỗi xảy ra khi vinh danh');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi vinh danh');
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
        return <RequestDetail request={detailPersonalRequestAssign} onBack={handleBackToList} onHonor={handleHonor} />;
    }

    // Hiển thị danh sách request
    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Danh sách yêu cầu</h1>
                
                {/* Request List */}
                <div className="grid gap-4 mb-6">
                    {listPersonalRequestAssign?.data?.map((request: any) => (
                        <Card 
                            key={request.id}
                            className="cursor-pointer hover:shadow-lg transition-all bg-slate-800 border-slate-700 hover:border-blue-500/50 group"
                            onClick={() => handleViewDetail(request.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                            {request.title}
                                        </h3>
                                        <p className="text-sm text-slate-300 line-clamp-2">
                                            {request.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                                            {request.type_requests?.name}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-amber-900/50 text-amber-300">
                                            {request.status_requests?.name}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span>Ngày yêu cầu: {formatDate(request.date_request)}</span>
                                    <span>Cập nhật: {formatDate(request.updated_at)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {listPersonalRequestAssign?.data?.length === 0 && (
                        <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-lg">
                            <svg className="mx-auto h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-4 text-lg text-slate-400">Chưa có yêu cầu nào</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {listPersonalRequestAssign?.pagination && 
                 listPersonalRequestAssign.pagination.totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) {
                                                handlePageChange(currentPage - 1);
                                            }
                                        }}
                                        className={`cursor-pointer ${
                                            currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                        }`}
                                    />
                                </PaginationItem>

                                {renderPaginationItems()}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < listPersonalRequestAssign.pagination.totalPages) {
                                                handlePageChange(currentPage + 1);
                                            }
                                        }}
                                        className={`cursor-pointer ${
                                            currentPage === listPersonalRequestAssign.pagination.totalPages
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