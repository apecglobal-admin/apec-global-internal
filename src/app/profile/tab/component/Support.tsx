'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { 
    createSupportTask, 
    getSupportTaskTypes, 
    getSupportTask, 
    getSupportTaskManager,
    getSupportTaskPending, 
    getListEmployeeSupport
} from '@/src/features/task/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import {
    getListEmployee,
    getListDepartment,
} from "@/src/features/task/api";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, X } from 'lucide-react';

import SupportTaskList from './support/SupportTaskList';
import CreateSupportTaskForm, { SupportTaskFormData } from './support/CreateSupportTaskForm';
import ManagerSupportTaskList from './support/ManagerSupportTaskList';
import SupportTaskPending from './support/SupportTaskPending';
import FilterableSelector from '@/components/FilterableSelector';

function Support() {
    const dispatch = useDispatch();
    const { 
        listEmployee, 
        listDepartment, 
        supportTaskTypes, 
        supportTask, 
        supportTaskManager,
        supportTaskPending,
        listEmployeeSupport
    } = useTaskData();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('need-support');
    const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [typesFilter , setTypesFilter ] = useState<string>("all");
    const [departmentFilter , setDepartmentFilter ] = useState<any>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("false");

    useEffect(() => {
        setCurrentPage(1);
    }, [typesFilter, departmentFilter, searchFilter, statusFilter]);
    
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        
        if (!token) return;
    
        // Load static data once
        if (!supportTaskTypes) {
            dispatch(getSupportTaskTypes() as any);
        }

        dispatch(getListEmployeeSupport({
            position_id: null,
            department_id: null,
            filter: null,
            token
        }) as any)

    
        // Debounce filter changes
        const timer = setTimeout(() => {
            const commonParams = {
                token,
                type_id: typesFilter === "all" ? null : typesFilter,
                department_id: departmentFilter?.id ? departmentFilter?.id : null,
                search: searchFilter === "" ? null : searchFilter,
            };
    
            if (activeTab === "need-support") {
                dispatch(getSupportTask({
                    ...commonParams,
                    key: "supportTask",
                    page: currentPage
                }) as any);
            }
    
            if (activeTab === "supporting") {
                dispatch(getSupportTaskManager({
                    ...commonParams,
                    key: "supportTaskManager",
                    page: currentPage
                }) as any);
            }
    
            if (activeTab === "supported") {
                dispatch(getSupportTaskPending({
                    ...commonParams,
                    key: "supportTaskPending",
                    checked: statusFilter
                }) as any);
            }
        }, 300);
    
        return () => clearTimeout(timer);
    }, [dispatch, currentPage, activeTab, typesFilter, departmentFilter, searchFilter, statusFilter]);



    useEffect(() => {
        setTypesFilter("all");
        setDepartmentFilter(null);
        setSearchFilter("");
        setStatusFilter("false");
        setCurrentPage(1);
    }, [activeTab]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTaskSupportDeleted = () => {
        const token = localStorage.getItem("userToken");
        dispatch(getSupportTask({ token, key: "supportTask", page: currentPage }) as any);
    }

    const handleCreateTask = async (formData: SupportTaskFormData) => {
        const token = localStorage.getItem("userToken");
        if (!token) return;

        const payload: any = {
            name: formData.name,
            description: formData.description,
            type_id: parseInt(formData.type_id),
            token,
        };

        if (parseInt(formData.type_id) === 1) {
            if (!formData.target_department_id) {
                alert('Vui lòng chọn phòng ban cần hỗ trợ');
                return;
            }
            payload.target_department_id = parseInt(formData.target_department_id);
        } else if (formData.target_department_id) {
            payload.target_department_id = parseInt(formData.target_department_id);
        }

        if (formData.assigneeType === 'employees' && formData.selectedEmployees.length > 0) {
            payload.employees = formData.selectedEmployees;
        } else if (formData.assigneeType === 'departments' && formData.selectedDepartments.length > 0) {
            payload.departments = formData.selectedDepartments;
        }

        try {
            await dispatch(createSupportTask(payload) as any);
            setShowCreateForm(false);
            dispatch(getSupportTask({ token, key: "supportTask", page: 1 }) as any);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error creating support task:', error);
            throw error; // Re-throw để form có thể xử lý
        }
    };

    const handleTypeFilterChange = (filter: string) => {
        setTypesFilter(filter);
    };

    const handleFilterTargetDept = (filter: string) => {
        dispatch(getListDepartment({filter}) as any);
    };

    const handleDepartmentFilterChange = (filter: any) => {
        setDepartmentFilter(filter);
    };
    const handleStatusFilterChange = (filter: string) => {
        setStatusFilter(filter);
    };

    const renderFilter = () => {
        return(
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                            Loại Hỗ trợ
                        </label>
                        <Select value={typesFilter} onValueChange={handleTypeFilterChange}>
                            <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                                <SelectValue placeholder="Chọn loại nhiệm vụ" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="all" className="text-white text-xs sm:text-sm">
                                    Tất cả
                                </SelectItem>
                                {supportTaskTypes &&
                                    Array.isArray(supportTaskTypes) &&
                                    supportTaskTypes.map((type: any) => (
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
    
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-xs sm:text-sm font-semibold text-slate-300">
                            Phòng ban
                        </label>
                        <FilterableSelector
                            data={listDepartment}
                            onFilter={handleFilterTargetDept}
                            onSelect={(value) => handleDepartmentFilterChange(value)}
                            value={departmentFilter}
                            placeholder="Chọn dự án"
                            displayField="name"
                            emptyMessage="Không có dự án"
                        />
                    </div>
    
                    {/* Thêm filter trạng thái chỉ khi tab là "supported" */}
                    {activeTab === "supported" && (
                        <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-slate-300">
                                Trạng thái
                            </label>

                            <Select
                                value={statusFilter}
                                onValueChange={handleStatusFilterChange}
                            >
                                <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                                <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>

                                <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem
                                    value="true"
                                    className="text-white text-xs sm:text-sm"
                                >
                                    Đã duyệt
                                </SelectItem>

                                <SelectItem
                                    value="false"
                                    className="text-white text-xs sm:text-sm"
                                >
                                    Chưa duyệt
                                </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
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
                        {searchFilter && (
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

    
    return (
        <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-4 space-y-4 sm:space-y-6">
            {showCreateForm ? (
                <CreateSupportTaskForm
                    supportTaskTypes={supportTaskTypes || []}
                    listEmployee={listEmployee || []}
                    listDepartment={listDepartment || []}
                    onCancel={() => setShowCreateForm(false)}
                    onSubmit={handleCreateTask}
                />
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    {/* Header with tabs and create button */}
                    <div className="flex flex-col gap-3 lg:gap-4">
                        {/* Mobile/Tablet: Stack vertically, Desktop: Horizontal */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                            {/* Tabs */}
                            <TabsList className="bg-slate-800 rounded-lg p-1 flex gap-1 h-auto w-full lg:w-auto overflow-x-auto">
                                <TabsTrigger 
                                    value="need-support"
                                    className="flex-1 lg:flex-initial py-2 px-3 lg:px-4 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                                >
                                    Hỗ trợ của tôi
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="supporting"
                                    className="flex-1 lg:flex-initial py-2 px-3 lg:px-4 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                                >
                                    Cần Hỗ trợ 
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="supported"
                                    className="flex-1 lg:flex-initial py-2 px-3 lg:px-4 rounded-lg text-xs lg:text-sm font-semibold whitespace-nowrap data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                                >
                                    Hoàn thành
                                </TabsTrigger>
                            </TabsList>
                            
                            {/* Create button */}
                            <Button 
                                onClick={() => setShowCreateForm(true)}
                                className="w-full lg:w-auto text-sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden lg:inline">Tạo yêu cầu hỗ trợ</span>
                                <span className="lg:hidden">Tạo yêu cầu</span>
                            </Button>
                        </div>
                    </div>

                    {renderFilter()}

                    {/* Tab Contents */}
                    <TabsContent value="need-support" className="space-y-4 mt-4">
                        <SupportTaskList
                            tasks={supportTask?.data || []}
                            listDepartment={listDepartment || []}
                            pagination={supportTask?.pagination}
                            onPageChange={handlePageChange}
                            onTaskDeleted={handleTaskSupportDeleted}
                        />
                    </TabsContent>

                    <TabsContent value="supporting" className="space-y-4 mt-4">
                        <ManagerSupportTaskList 
                            tasks={supportTaskManager?.data || []}
                            pagination={supportTaskManager?.pagination}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value="supported" className="space-y-4 mt-4">
                        <SupportTaskPending 
                            tasks={supportTaskPending?.rows || []}
                            pagination={supportTaskManager?.pagination}
                            onPageChange={handlePageChange}
                            statusFilter={statusFilter}
                        />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

export default Support;