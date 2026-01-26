import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTaskAssign, getDetailListTaskAssign } from '@/src/features/task/api';
import { useTaskData } from '@/src/hooks/taskhook';
import { XCircle } from 'lucide-react';
import PopupComponent, { usePopup } from "@/components/PopupComponent";
import { toast } from 'react-toastify';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import TaskDetailAssign from './TaskDetailAsign'; 

const TaskListAssign: React.FC = () => {
    const dispatch = useDispatch();
    const { listDetailTaskAssign, detailTaskAssign, loadingListDetailTaskAssign, errorListDetailTaskAssign } = useTaskData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const { isOpen, openPopup, closePopup, popupProps } = usePopup();
    
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        
        dispatch(getDetailListTaskAssign({
            page: currentPage,
            token: token,
            key: "listDetailTaskAssign"
        }) as any);
    }, [dispatch, currentPage]);
    
    const handleTaskClick = (taskId: string) => {
        const token = localStorage.getItem("userToken");

        setSelectedTaskId(taskId);
        dispatch(getDetailListTaskAssign({
            id: taskId,
            token: token,
            key: "detailTaskAssign"
        }) as any);
    };

    const handleBackToList = () => {
        setSelectedTaskId(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (statusId: number) => {
        const colors: { [key: number]: string } = {
            1: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
            2: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            4: 'bg-green-500/20 text-green-400 border border-green-500/30',
            3: 'bg-red-500/20 text-red-400 border border-red-500/30',
        };
        return colors[statusId] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    };

    const handleDeleteTask = async (e: React.MouseEvent, task: any) => {
        e.stopPropagation();
        
        const token = localStorage.getItem("userToken");
        const payload = {
            id: task.id,
            token
        }
        openPopup({
            type: "warning",
            title: "Nhiệm vụ này sẽ được xóa",
            confirmText: "Xác nhận",
            showActionButtons: true,
            onConfirm: async () => {
                const res = await dispatch(deleteTaskAssign(payload) as any);
                console.log(res);
                
                if(res.payload.data?.success){
                    dispatch(getDetailListTaskAssign({
                        page: currentPage,
                        token: token,
                        key: "listDetailTaskAssign"
                    }) as any);
                    toast.success(res.payload.data.message)

                    closePopup();
                }else{
                    toast.error(res.payload.message)
                    closePopup();
                }
                
            },
            onCancel: closePopup,
        });
    };

    const renderPaginationItems = () => {
        if (!listDetailTaskAssign?.pagination) return null;

        const totalPages = listDetailTaskAssign.pagination.totalPages;
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

    // Hiển thị chi tiết task
    if (selectedTaskId && detailTaskAssign) {
        return <TaskDetailAssign task={detailTaskAssign} onBack={handleBackToList} />;
    }

    // Hiển thị danh sách task
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Danh sách công việc được giao</h1>
            <PopupComponent isOpen={isOpen} onClose={closePopup} {...popupProps} />
            {loadingListDetailTaskAssign ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500"></div>
                </div>
            ) : errorListDetailTaskAssign ? (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    Có lỗi xảy ra khi tải danh sách công việc
                </div>
            ) : (
                <>
                    {listDetailTaskAssign && listDetailTaskAssign.data && listDetailTaskAssign.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listDetailTaskAssign.data.map((task: any) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleTaskClick(task.id)}
                                        className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer p-4 group"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-white flex-1 group-hover:text-blue-400 transition-colors">{task.name}</h3>
                                            <button
                                                onClick={(e) => handleDeleteTask(e,task)}
                                                className={`p-2 rounded-lg transition-all 
                                                bg-red-600 hover:bg-red-700 text-white cursor-pointer
                                                disabled:opacity-50`}
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-lg ${getStatusColor(task.status.id)}`}>
                                                {task.status.name}
                                            </span>
                                            <span className="text-xs text-slate-500">{task.target_type.name}</span>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Dự án:</span> {task.project.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Loại:</span> {task.type_task.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                <span className="font-semibold text-slate-300">Hạn:</span> {formatDate(task.date_end)}
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                                                <span>Tiến độ</span>
                                                <span className="font-bold text-blue-400">{task.process}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${task.process}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {listDetailTaskAssign.pagination && listDetailTaskAssign.pagination.totalPages > 1 && (
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
                                                        if (currentPage < listDetailTaskAssign.pagination.totalPages) {
                                                            handlePageChange(currentPage + 1);
                                                        }
                                                    }}
                                                    className={`cursor-pointer ${
                                                        currentPage === listDetailTaskAssign.pagination.totalPages
                                                            ? 'pointer-events-none opacity-50'
                                                            : ''
                                                    }`}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-lg">
                            <svg className="mx-auto h-16 w-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-4 text-lg text-slate-400">Chưa có công việc nào được giao</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TaskListAssign;