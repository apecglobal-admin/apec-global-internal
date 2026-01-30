'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { 
    createSupportTask, 
    getSupportTaskTypes, 
    getSupportTask, 
    getSupportTaskManager,
    getSupportTaskPending 
} from '@/src/features/task/api';
import {
    getListEmployee,
    getListDepartment,
} from "@/src/features/task/api";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

import SupportTaskList from './support/SupportTaskList';
import CreateSupportTaskForm, { SupportTaskFormData } from './support/CreateSupportTaskForm';
import ManagerSupportTaskList from './support/ManagerSupportTaskList';
import SupportTaskPending from './support/SupportTaskPending';

function Support() {
    const dispatch = useDispatch();
    const { 
        listEmployee, 
        listDepartment, 
        supportTaskTypes, 
        supportTask, 
        supportTaskManager,
        supportTaskPending,
} = useTaskData();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('need-support');
    
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            if (!supportTaskTypes) {
                dispatch(getSupportTaskTypes() as any);
            }
            
            dispatch(getSupportTaskManager({ token, key: "supportTaskManager", page: currentPage }) as any);
            dispatch(getSupportTask({ token, key: "supportTask", page: currentPage }) as any);
            dispatch(getSupportTaskPending({token, key: "supportTaskPending"}) as any)
            if (!listEmployee) {
                dispatch(getListEmployee({
                    position_id: null,
                    department_id: null,
                    filter: null,
                }) as any);
            }
            if (!listDepartment) {
                dispatch(getListDepartment() as any);
            }
        }
    }, [dispatch, currentPage]);

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

        // Nếu type_id = 1 thì phải có target_department_id
        if (parseInt(formData.type_id) === 1) {
            if (!formData.target_department_id) {
                alert('Vui lòng chọn phòng ban cần hỗ trợ');
                return;
            }
            payload.target_department_id = parseInt(formData.target_department_id);
        } else if (formData.target_department_id) {
            payload.target_department_id = parseInt(formData.target_department_id);
        }

        // Chỉ truyền employees hoặc departments
        if (formData.assigneeType === 'employees' && formData.selectedEmployees.length > 0) {
            payload.employees = formData.selectedEmployees;
        } else if (formData.assigneeType === 'departments' && formData.selectedDepartments.length > 0) {
            payload.departments = formData.selectedDepartments;
        }

        try {
            await dispatch(createSupportTask(payload) as any);
            setShowCreateForm(false);
            // Refresh list
            dispatch(getSupportTask({ token, key: "supportTask", page: 1 }) as any);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error creating support task:', error);
            throw error; // Re-throw để form có thể xử lý
        }
    };


    return (
        <div className="container mx-auto py-6 space-y-6">


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
                    <div className="flex justify-between items-center">
                        <TabsList className="bg-slate-800 rounded-lg p-1 flex gap-1 h-auto">
                            <TabsTrigger 
                                value="need-support"
                                className="flex-1 py-2 rounded-lg font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                            >
                                Hỗ trợ của tôi
                            </TabsTrigger>
                            <TabsTrigger 
                                value="supporting"
                                className="flex-1 py-2 rounded-lg font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                            >
                                Cần Hỗ trợ 
                            </TabsTrigger>
                            <TabsTrigger 
                                value="supported"
                                className="flex-1 py-2 rounded-lg font-semibold data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-700 data-[state=inactive]:bg-transparent"
                            >
                                Hoàn thành
                            </TabsTrigger>
                        </TabsList>
                        {!showCreateForm && (
                            <Button onClick={() => setShowCreateForm(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo yêu cầu hỗ trợ
                            </Button>
                        )}
                    </div>


                    <TabsContent value="need-support" className="space-y-4">
                        <SupportTaskList
                            tasks={supportTask?.data || []}
                            pagination={supportTask?.pagination}
                            onPageChange={handlePageChange}
                            onTaskDeleted={handleTaskSupportDeleted}
                        />
                    </TabsContent>

                    <TabsContent value="supporting" className="space-y-4">
                        <ManagerSupportTaskList 
                            tasks={supportTaskManager?.data || []}
                            pagination={supportTaskManager?.pagination}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value="supported" className="space-y-4">
                        <SupportTaskPending 
                            tasks={supportTaskPending?.rows || []}
                            pagination={supportTaskManager?.pagination}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}

export default Support;
