import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
    getListInternalEvent, 
    getInternalTypeEvent, 
    getlevels,
    eventInternalRegister,
    updateEventInternal,
    deleteEventInternal,
    attendanceEventInternal
} from '@/src/features/event/api/api';
import {
    getListEmployee,
    getListDepartment,
    getListPosition,
} from "@/src/features/task/api";
import { useTaskData } from '@/src/hooks/taskhook';
import { useEventData } from '@/src/hooks/eventhook';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Calendar, Clock, MapPin, Plus, Users, ArrowLeft, Edit2, Trash2, X, Eye, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'react-toastify';
import TaskTargetSelector from '@/components/TaskTargetSelector';

function EventManager() {
    const dispatch = useDispatch();
    const { internalTypeEvent, listInternalEvent, levels, detailListInternalEvent } = useEventData();
    
    const { listEmployee, listDepartment, listPosition } = useTaskData();

    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [targetError, setTargetError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        internal_event_type_id: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
    });

    const [selectedTargetType, setSelectedTargetType] = useState<number>(3);
    const [selectedTargetValues, setSelectedTargetValues] = useState<number[] | number | string>([]);

    const limit = 6;

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(getListInternalEvent({ page: currentPage, limit, token, key: "listInternalEvent" }) as any);
            dispatch(getInternalTypeEvent() as any);
            dispatch(getlevels() as any);
            dispatch(getListPosition() as any);
            dispatch(getListDepartment() as any);
            dispatch(getListEmployee({
                position_id: null,
                department_id: null,
                filter: null,
            }) as any);
        }
    }, [dispatch, currentPage]);

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

    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    };

    const handleTargetTypeChange = (type: number) => {
        setSelectedTargetType(type);
        setTargetError('');
    };

    const handleSelectionChange = (values: number[] | number | string) => {
        setSelectedTargetValues(values);
        setTargetError('');
    };

    const handleFilterChange = (filters: {
        search?: string;
        position?: number | null;
        department?: number | null;
    }) => {
        const token = localStorage.getItem("userToken");
        if (token) {
            dispatch(getListEmployee({
                position_id: filters.position || null,
                department_id: filters.department || null,
                filter: filters.search || null,
            }) as any);
        }
    };

    const handleViewDetail = async (eventId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        try {
            const s = await dispatch(getListInternalEvent({ 
                id: eventId, 
                token, 
                key: "detailListInternalEvent" 
            }) as any);

            
            setShowDetailModal(true);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải chi tiết sự kiện');
        }
    };

    const handleAttendance = async (employeeId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token || !detailListInternalEvent) return;

        try {
            const result = await dispatch(attendanceEventInternal({
                id: detailListInternalEvent.id,
                employee_id: employeeId,
                token
            }) as any);

            if (result.payload?.status === 200) {
                toast.success('Điểm danh thành công!');
                // Reload chi tiết để cập nhật trạng thái
                await dispatch(getListInternalEvent({ 
                    id: detailListInternalEvent.id, 
                    token, 
                    key: "detailListInternalEvent" 
                }) as any);
            } else {
                toast.error(result.payload?.data?.message || 'Có lỗi xảy ra khi điểm danh');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi điểm danh');
        }
    };

    const handleEdit = (event: any) => {        
        setEditingEventId(event.id);
        setFormData({
            name: event.name,
            description: event.description || '',
            internal_event_type_id: event.internal_event_type.id.toString(),
            start_date: formatDateForInput(event.start_date),
            end_date: formatDateForInput(event.end_date),
            start_time: formatTime(event.start_time),
            end_time: formatTime(event.end_time),
            location: event.location,
        });

        if (event.department) {
            setSelectedTargetType(1);
            setSelectedTargetValues(event.department.id);
        } else if (event.position) {
            setSelectedTargetType(2);
            setSelectedTargetValues(event.position.id);
        } else if (event.level) {
            setSelectedTargetType(4);
            setSelectedTargetValues(event.level.id);
        } else {
            setSelectedTargetType(3);
            setSelectedTargetValues([]);
        }

        setShowEditForm(true);
    };

    const handleDeleteClick = (eventId: number) => {
        setDeletingEventId(eventId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem("userToken");
        if (!token || !deletingEventId) return;

        try {
            const result = await dispatch(deleteEventInternal({ 
                id: deletingEventId, 
                token 
            }) as any);

            if (result.payload?.status === 200) {
                toast.success('Xóa sự kiện thành công!');
                setShowDeleteModal(false);
                setDeletingEventId(null);
                dispatch(getListInternalEvent({ page: currentPage, limit, token, key: "listInternalEvent" }) as any);
            } else {
                toast.error(result.payload?.data?.message || 'Có lỗi xảy ra khi xóa');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa sự kiện');
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("userToken");

        if (!token) {
            toast.error('Vui lòng đăng nhập');
            return;
        }

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên sự kiện');
            return;
        }
        if (!formData.internal_event_type_id) {
            toast.error('Vui lòng chọn loại sự kiện');
            return;
        }
        if (!formData.location.trim()) {
            toast.error('Vui lòng nhập địa điểm');
            return;
        }
        if (!formData.start_date || !formData.end_date || !formData.start_time || !formData.end_time) {
            toast.error('Vui lòng nhập đầy đủ ngày giờ');
            return;
        }

        if (selectedTargetType === 3 && Array.isArray(selectedTargetValues) && selectedTargetValues.length === 0) {
            setTargetError('Vui lòng chọn ít nhất 1 nhân viên');
            return;
        }
        if ((selectedTargetType === 1 || selectedTargetType === 2 || selectedTargetType === 4) && !selectedTargetValues) {
            setTargetError('Vui lòng chọn đối tượng');
            return;
        }

        const targetMapping = {
            1: { department_id: selectedTargetValues as number, position_id: null, level_id: null, employees: null },
            2: { position_id: selectedTargetValues as number, department_id: null, level_id: null, employees: null },
            3: { employees: selectedTargetValues as number[], department_id: null, position_id: null, level_id: null },
            4: { level_id: selectedTargetValues as number, department_id: null, position_id: null, employees: null },
        };

        const payload = {
            ...formData,
            internal_event_type_id: Number(formData.internal_event_type_id),
            ...targetMapping[selectedTargetType as keyof typeof targetMapping],
            token
        };

        try {
            let result;
            if (showEditForm && editingEventId) {
                result = await dispatch(updateEventInternal({ 
                    ...payload, 
                    id: editingEventId 
                }) as any);
                
                if (result.payload?.status === 200) {
                    toast.success('Cập nhật sự kiện thành công!');
                    setShowEditForm(false);
                    setEditingEventId(null);
                    resetForm();
                    dispatch(getListInternalEvent({ page: currentPage, limit, token, key: "listInternalEvent" }) as any);
                } else {
                    toast.error(result.payload?.data?.message || 'Có lỗi xảy ra');
                }
            } else {
                result = await dispatch(eventInternalRegister(payload) as any);

                if (result.payload?.status === 200 || result.payload?.status === 201) {
                    toast.success('Tạo sự kiện thành công!');
                    setShowCreateForm(false);
                    resetForm();
                    dispatch(getListInternalEvent({ page: currentPage, limit, token, key: "listInternalEvent" }) as any);
                } else {
                    toast.error(result.payload?.data?.message || 'Có lỗi xảy ra');
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xử lý sự kiện');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            internal_event_type_id: '',
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            location: '',
        });
        setSelectedTargetType(3);
        setSelectedTargetValues([]);
        setTargetError('');
    };

    const handleCancel = () => {
        setShowCreateForm(false);
        setShowEditForm(false);
        setEditingEventId(null);
        resetForm();
    };

    const renderPaginationItems = () => {
        if (!listInternalEvent?.pagination) return null;

        const { totalPages } = listInternalEvent.pagination;
        const items = [];

        if (totalPages <= 7) {
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
                    <PaginationLink onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1} className="cursor-pointer">
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (currentPage > 3) items.push(<PaginationEllipsis key="ellipsis-start" />);

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i} className="cursor-pointer">
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < totalPages - 2) items.push(<PaginationEllipsis key="ellipsis-end" />);

            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages} className="cursor-pointer">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const getTargetInfo = (event: any) => {
        if (event.position) return { type: 'Chức vụ', name: event.position.name };
        if (event.department) return { type: 'Phòng ban', name: event.department.name };
        if (event.level) return { type: 'Cấp bậc', name: event.level.name };
        return { type: 'Nhân viên cụ thể', name: '' };
    };

    const isFormView = showCreateForm || showEditForm;

    return (
        <div className="min-h-screen bg-slate-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">
                        {showEditForm ? 'Chỉnh sửa sự kiện' : showCreateForm ? 'Tạo sự kiện mới' : 'Quản lý sự kiện nội bộ'}
                    </h1>
                    {!isFormView && (
                        <button 
                            onClick={() => setShowCreateForm(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            <Plus size={20} />
                            Tạo sự kiện mới
                        </button>
                    )}
                    {isFormView && (
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                        >
                            <ArrowLeft size={18} />
                            Quay lại
                        </button>
                    )}
                </div>

                {isFormView ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Tên sự kiện <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                        placeholder="Nhập tên sự kiện..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">Mô tả</label>
                                    <textarea 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                                        rows={3}
                                        placeholder="Nhập mô tả sự kiện..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Loại sự kiện <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        value={formData.internal_event_type_id} 
                                        onChange={(e) => setFormData({ ...formData, internal_event_type_id: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    >
                                        <option value="">Chọn loại sự kiện</option>
                                        {internalTypeEvent?.map((type: any) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Địa điểm <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.location} 
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                        placeholder="Nhập địa điểm..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Ngày bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={formData.start_date} 
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Ngày kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={formData.end_date} 
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Giờ bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="time" 
                                        value={formData.start_time} 
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">
                                        Giờ kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="time" 
                                        value={formData.end_time} 
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-6">
                                <TaskTargetSelector
                                    enabledTargets={['employee', 'position', 'department', 'level']}
                                    employees={listEmployee}
                                    positions={listPosition}
                                    departments={listDepartment}
                                    levels={levels}
                                    selectedTargetType={selectedTargetType}
                                    selectedValues={selectedTargetValues}
                                    onTargetTypeChange={handleTargetTypeChange}
                                    onSelectionChange={handleSelectionChange}
                                    onFilterChange={handleFilterChange}
                                    error={targetError}
                                    onErrorClear={() => setTargetError('')}
                                    showSelectAll={true}
                                    showFilters={true}
                                    maxHeight="20rem"
                                    placeholder="Chọn đối tượng tham gia..."
                                />
                            </div>

                            <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-700">
                                <button 
                                    type="button" 
                                    onClick={handleCancel} 
                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleSubmit} 
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                                >
                                    {showEditForm ? 'Cập nhật sự kiện' : 'Tạo sự kiện'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 mb-6">
                            {listInternalEvent?.data?.map((event: any) => {
                                const targetInfo = getTargetInfo(event);
                                return (
                                    <div key={event.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                                                <p className="text-slate-300 text-sm mb-3">{event.description}</p>
                                                <div className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                                                    {event.internal_event_type.name}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(event.id)}
                                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(event.id)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar size={16} />
                                                <div>
                                                    <div className="text-xs text-slate-500">Bắt đầu</div>
                                                    <div className="text-white">{formatDate(event.start_date)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar size={16} />
                                                <div>
                                                    <div className="text-xs text-slate-500">Kết thúc</div>
                                                    <div className="text-white">{formatDate(event.end_date)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={16} />
                                                <div>
                                                    <div className="text-xs text-slate-500">Thời gian</div>
                                                    <div className="text-white">{formatTime(event.start_time)} - {formatTime(event.end_time)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin size={16} />
                                                <div>
                                                    <div className="text-xs text-slate-500">Địa điểm</div>
                                                    <div className="text-white">{event.location}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-700">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users size={16} className="text-slate-400" />
                                                <span className="text-slate-500">Đối tượng:</span>
                                                <span className="text-white font-medium">
                                                    {targetInfo.type} {targetInfo.name && `- ${targetInfo.name}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {listInternalEvent?.data?.length === 0 && (
                                <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-lg">
                                    <Calendar className="mx-auto h-16 w-16 text-slate-600 mb-4" />
                                    <p className="text-lg text-slate-400">Chưa có sự kiện nào</p>
                                </div>
                            )}
                        </div>

                        {listInternalEvent?.pagination && listInternalEvent.pagination.totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }} className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`} />
                                        </PaginationItem>
                                        {renderPaginationItems()}
                                        <PaginationItem>
                                            <PaginationNext onClick={(e) => { e.preventDefault(); if (currentPage < listInternalEvent.pagination.totalPages) handlePageChange(currentPage + 1); }} className={`cursor-pointer ${currentPage === listInternalEvent.pagination.totalPages ? 'pointer-events-none opacity-50' : ''}`} />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}

                {/* Modal Chi tiết và Điểm danh */}
                {showDetailModal && detailListInternalEvent && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-6 border-b border-slate-700">
                                <h3 className="text-2xl font-bold text-white">{detailListInternalEvent.name}</h3>
                                <button 
                                    onClick={() => setShowDetailModal(false)} 
                                    className="text-slate-400 hover:text-white transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto p-6 space-y-6">
                                <div>
                                    <p className="text-slate-300 mb-4">{detailListInternalEvent.description}</p>
                                    <div className="inline-block px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm">
                                        {detailListInternalEvent.internal_event_type.name}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-blue-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">Ngày bắt đầu</div>
                                            <div className="text-white font-medium">{formatDate(detailListInternalEvent.start_date)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-blue-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">Ngày kết thúc</div>
                                            <div className="text-white font-medium">{formatDate(detailListInternalEvent.end_date)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-green-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">Thời gian</div>
                                            <div className="text-white font-medium">
                                                {formatTime(detailListInternalEvent.start_time)} - {formatTime(detailListInternalEvent.end_time)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-red-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">Địa điểm</div>
                                            <div className="text-white font-medium">{detailListInternalEvent.location}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Users size={20} className="text-blue-400" />
                                            Danh sách nhân viên ({detailListInternalEvent.employees?.length || 0})
                                        </h4>
                                        <div className="text-sm text-slate-400">
                                            Đã điểm danh: <span className="text-green-400 font-semibold">
                                                {detailListInternalEvent.employees?.filter((emp: any) => emp.checked)?.length || 0}
                                            </span>
                                            /{detailListInternalEvent.employees?.length || 0}
                                        </div>
                                    </div>

                                    {detailListInternalEvent.employees && detailListInternalEvent.employees.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {detailListInternalEvent.employees.map((employee: any) => (
                                                <div 
                                                    key={employee.id} 
                                                    className="flex items-center justify-between p-4 bg-slate-900 rounded-lg hover:bg-slate-900/70 transition"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {employee.avatar ? (
                                                            <img 
                                                                src={employee.avatar} 
                                                                alt={employee.name}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                                                                {employee.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-white font-medium">{employee.name}</div>
                                                            <div className="text-xs text-slate-400">ID: {employee.id}</div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleAttendance(employee.id)}
                                                        disabled={employee.checked}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                                            employee.checked 
                                                                ? 'bg-green-900/30 text-green-400 cursor-not-allowed' 
                                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                    >
                                                        {employee.checked ? (
                                                            <>
                                                                <CheckCircle2 size={16} />
                                                                Đã điểm danh
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Circle size={16} />
                                                                Điểm danh
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-slate-900 rounded-lg">
                                            <Users className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                                            <p className="text-slate-400">Không có nhân viên nào</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Xóa */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Xác nhận xóa</h3>
                                <button 
                                    onClick={() => setShowDeleteModal(false)} 
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <p className="text-slate-300 mb-6">
                                Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default EventManager;