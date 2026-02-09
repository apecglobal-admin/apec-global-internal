import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';

interface TaskEditFormProps {
    task: any;
    typeTask: any[];
    priorityTask: any[];
    listProject: any[];
    childKpi: any[];
    listEmployee: any[];
    hasCompletedEmployee: boolean;
    onSave: (formData: any) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
    task,
    typeTask,
    priorityTask,
    listProject,
    childKpi,
    listEmployee,
    hasCompletedEmployee,
    onSave,
    onCancel,
    isLoading
}) => {
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type_task: 0,
        date_start: '',
        date_end: '',
        task_priority: 0,
        project_id: 0,
        kpi_item_id: 0,
        min_count_reject: 0,
        max_count_reject: 0,
        employees: [] as number[],
        value: 0,
    });

    const [dropdownStates, setDropdownStates] = useState({
        type_task: false,
        priority: false,
        project: false,
        kpi: false,
        employees: false,
    });
    
    useEffect(() => {
        if (task) {
            setFormData({
                name: task.name || '',
                description: task.description || '',
                type_task: task.type_task?.id || 0,
                date_start: task.date_start ? task.date_start.split('T')[0] : '',
                date_end: task.date_end ? task.date_end.split('T')[0] : '',
                task_priority: task.priority?.id || 0,
                project_id: task.project?.id || 0,
                kpi_item_id: task.kpi_item?.id || 0,
                min_count_reject: task.min_count_reject || 0,
                max_count_reject: task.max_count_reject || 0,
                employees: task.task_assignment?.map((a: any) => a.employee.id) || [],
                value: task.target_value,
            });
        }
    }, [task]);
    
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

    const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
        setDropdownStates(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if(field === 'kpi_item_id'){
            setFormData(prev => ({
                ...prev,
                value: 0,
            }));
        }
    };

    const handleProcessChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string,
    ) => {
        const unit = childKpi?.find((k: any) => Number(k.id) === Number(formData.kpi_item_id))?.unit_name
        // Bỏ hết dấu phẩy
        const rawValue = e.target.value.replace(/,/g, "");

        
        let value = Number(rawValue);
        if (Number.isNaN(value)) value = 0;
      
        if (unit === "%") {
          if (value > 100) value = 100;
          if (value < 0) value = 0;
        }
      
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEmployeeToggle = (employeeId: number) => {
        setFormData(prev => ({
            ...prev,
            employees: prev.employees.includes(employeeId)
                ? prev.employees.filter(id => id !== employeeId)
                : [...prev.employees, employeeId]
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Lấy dữ liệu gốc từ task
        const originalData = {
            name: task.name || '',
            description: task.description || '',
            type_task: task.type_task?.id || 0,
            date_start: task.date_start ? task.date_start.split('T')[0] : '',
            date_end: task.date_end ? task.date_end.split('T')[0] : '',
            task_priority: task.priority?.id || 0,
            project_id: task.project?.id || 0,
            kpi_item_id: task.kpi_item?.id || 0,
            min_count_reject: task.min_count_reject || 0,
            max_count_reject: task.max_count_reject || 0,
            employees: task.task_assignment?.map((a: any) => a.employee.id) || [],
            value: task.target_value,
        };

        if(formData.value === 0){
            toast.warning("Bạn chưa nhập mục tiêu đạt được")
            return
        }

        // So sánh và chỉ lấy những field thay đổi
        const changedData: any = {};
        
        if (formData.name !== originalData.name) {
            changedData.name = formData.name;
        }
        
        if (formData.description !== originalData.description) {
            changedData.description = formData.description;
        }
        
        if (!hasCompletedEmployee) {
            if (formData.type_task !== originalData.type_task) {
                changedData.type_task = formData.type_task;
            }
            
            if (formData.date_start !== originalData.date_start) {
                changedData.date_start = formData.date_start;
            }
            
            if (formData.date_end !== originalData.date_end) {
                changedData.date_end = formData.date_end;
            }
            
            if (formData.task_priority !== originalData.task_priority) {
                changedData.task_priority = formData.task_priority;
            }
            
            if (formData.project_id !== originalData.project_id) {
                changedData.project_id = formData.project_id;
            }
            
            if (formData.kpi_item_id !== originalData.kpi_item_id) {
                changedData.kpi_item_id = formData.kpi_item_id;
            }
            
            if (formData.min_count_reject !== originalData.min_count_reject) {
                changedData.min_count_reject = formData.min_count_reject;
            }
            
            if (formData.max_count_reject !== originalData.max_count_reject) {
                changedData.max_count_reject = formData.max_count_reject;
            }

            if (formData.value !== originalData.value) {
                changedData.target_value = formData.value;
            }
            
            // So sánh mảng employees
            const employeesChanged = 
                formData.employees.length !== originalData.employees.length ||
                formData.employees.some(id => !originalData.employees.includes(id)) ||
                originalData.employees.some((id: any) => !formData.employees.includes(id));
            
            if (employeesChanged) {
                changedData.employees = formData.employees;
            }
        }

        onSave(changedData);
    };

    const formatNumber = (value: number) => {
        if (!value) return "";
        return new Intl.NumberFormat("en-US").format(value);
    };
    
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
            {hasCompletedEmployee && (
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
                    ⚠️ Có nhân viên đã hoàn thành công việc (100%). Bạn chỉ có thể cập nhật Tên và Mô tả.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Tên công việc */}
                <div className="border-b border-slate-700 pb-4 mb-6">
                    <label className="text-sm font-semibold text-slate-400 block mb-2">Tên công việc</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full text-2xl font-bold text-white bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Tên công việc"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Cột trái */}
                    <div className="space-y-4">
                        {/* Dự án */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Dự án</label>
                            {!hasCompletedEmployee ? (
                                <div className="relative mt-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown('project')}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:border-blue-500"
                                    >
                                        <span>{listProject?.find((p: any) => p.id === formData.project_id)?.name || 'Chọn dự án'}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    {dropdownStates.project && (
                                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {listProject?.map((project: any, id: number) => (
                                                <div
                                                    key={id}
                                                    onClick={() => {
                                                        handleInputChange('project_id', project.id);
                                                        toggleDropdown('project');
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                >
                                                    {project.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white mt-1">{task.project.name}</p>
                            )}
                        </div>

                        {/* Loại công việc */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Loại công việc</label>
                            {!hasCompletedEmployee ? (
                                <div className="relative mt-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown('type_task')}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:border-blue-500"
                                    >
                                        <span>{typeTask?.find((t: any) => t.id === formData.type_task)?.name || 'Chọn loại'}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    {dropdownStates.type_task && (
                                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {typeTask?.map((type: any, id: number) => (
                                                <div
                                                    key={id}
                                                    onClick={() => {
                                                        handleInputChange('type_task', type.id);
                                                        toggleDropdown('type_task');
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                >
                                                    {type.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white mt-1">{task.type_task.name}</p>
                            )}
                        </div>

                        {/* KPI */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">KPI</label>
                            {!hasCompletedEmployee ? (
                                <div className="relative mt-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown('kpi')}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:border-blue-500"
                                    >
                                        <span>{childKpi?.find((k: any) => Number(k.id) === Number(formData.kpi_item_id))?.name || 'Chọn KPI'}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    {dropdownStates.kpi && (
                                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {childKpi?.map((kpi: any, id: number) => (
                                                <div
                                                    key={id}
                                                    onClick={() => {
                                                        handleInputChange('kpi_item_id', kpi.id);
                                                        toggleDropdown('kpi');
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                >
                                                    {kpi.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white mt-1">{task.kpi_item.name}</p>
                            )}
                        </div>

                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">
                                Mục tiêu ({childKpi?.find((k: any) => Number(k.id) === Number(formData.kpi_item_id))?.unit_name})
                            </label>
                            {!hasCompletedEmployee ? (
                                <input
                                type="text"
                                inputMode="numeric"
                                value={formatNumber(formData.value)}
                                onChange={(e) => handleProcessChange(e, 'value')}
                                className={`w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500`}
                            />
                            ) : (
                                <p className="text-white mt-1">{formatNumber(task.target_value)}</p>
                            )}
                        </div>

                        {/* Độ ưu tiên */}
                        {!hasCompletedEmployee && (
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <label className="text-sm font-semibold text-slate-400">Độ ưu tiên</label>
                                <div className="relative mt-1">
                                    <button
                                        type="button"
                                        onClick={() => toggleDropdown('priority')}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:border-blue-500"
                                    >
                                        <span>{priorityTask?.find((p: any) => p.id === formData.task_priority)?.name || 'Chọn độ ưu tiên'}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    {dropdownStates.priority && (
                                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {priorityTask?.map((priority: any, id: number) => (
                                                <div
                                                    key={id}
                                                    onClick={() => {
                                                        handleInputChange('task_priority', priority.id);
                                                        toggleDropdown('priority');
                                                    }}
                                                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                >
                                                    {priority.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-4">
                        {/* Ngày bắt đầu */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Ngày bắt đầu</label>
                            {!hasCompletedEmployee ? (
                                <input
                                    type="date"
                                    value={formData.date_start}
                                    onChange={(e) => handleInputChange('date_start', e.target.value)}
                                    className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            ) : (
                                <p className="text-white mt-1">{new Date(task.date_start).toLocaleDateString('vi-VN')}</p>
                            )}
                        </div>

                        {/* Ngày kết thúc */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Ngày kết thúc</label>
                            {!hasCompletedEmployee ? (
                                <input
                                    type="date"
                                    value={formData.date_end}
                                    onChange={(e) => handleInputChange('date_end', e.target.value)}
                                    className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                />
                            ) : (
                                <p className="text-white mt-1">{new Date(task.date_end).toLocaleDateString('vi-VN')}</p>
                            )}
                        </div>

                        {/* Số lần từ chối tối thiểu */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Số lần từ chối tối thiểu</label>
                            {!hasCompletedEmployee ? (
                                <input
                                    type="number"
                                    value={formData.min_count_reject}
                                    onChange={(e) => handleInputChange('min_count_reject', parseInt(e.target.value) || 0)}
                                    className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    min="0"
                                />
                            ) : (
                                <p className="text-white mt-1">{task.min_count_reject}</p>
                            )}
                        </div>

                        {/* Số lần từ chối tối đa */}
                        <div className="bg-slate-900/50 p-3 rounded-lg">
                            <label className="text-sm font-semibold text-slate-400">Số lần từ chối tối đa</label>
                            {!hasCompletedEmployee ? (
                                <input
                                    type="number"
                                    value={formData.max_count_reject}
                                    onChange={(e) => handleInputChange('max_count_reject', parseInt(e.target.value) || 0)}
                                    className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    min="0"
                                />
                            ) : (
                                <p className="text-white mt-1">{task.max_count_reject}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nhân viên thực hiện */}
                {!hasCompletedEmployee && (
                    <div className="bg-slate-900/50 p-4 rounded-lg mb-6">
                        <label className="text-sm font-semibold text-slate-400">Nhân viên thực hiện (chỉ thêm mới)</label>
                        <div className="relative mt-2">
                            <button
                                type="button"
                                onClick={() => toggleDropdown('employees')}
                                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 flex items-center justify-between focus:outline-none focus:border-blue-500"
                            >
                                <span>{formData.employees.length} nhân viên được chọn</span>
                                <ChevronDown size={16} />
                            </button>
                            {dropdownStates.employees && (
                                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {listEmployee?.map((employee: any, id: number) => (
                                        <div
                                            key={id}
                                            onClick={() => handleEmployeeToggle(employee.id)}
                                            className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-semibold">{employee.name}</div>
                                                <div className="text-xs text-slate-400">
                                                    {employee.department?.name} - {employee.position?.name}
                                                </div>
                                            </div>
                                            {formData.employees.includes(employee.id) && (
                                                <span className="text-green-400">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {formData.employees.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {formData.employees.map((empId, id: number) => {
                                    const emp = listEmployee?.find((e: any) => e.id === empId);
                                    return emp ? (
                                        <span key={id} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                                            {emp.name}
                                            <X 
                                                size={14} 
                                                className="cursor-pointer hover:text-red-400"
                                                onClick={() => handleEmployeeToggle(empId)}
                                            />
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Mô tả */}
                <div className="bg-slate-900/50 p-4 rounded-lg mb-6">
                    <label className="text-sm font-semibold text-slate-400">Mô tả</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full mt-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 min-h-[100px]"
                        placeholder="Mô tả công việc..."
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <X size={18} />
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
            {/* Danh sách người thực hiện */}
            {task.task_assignment && task.task_assignment.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Danh sách người thực hiện ({task.task_assignment.length})
                    </h2>
                    <div className="space-y-3">
                        {task.task_assignment.map((assignment: any) => (
                            <div key={assignment.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {assignment.employee.avatar ? (
                                            <img 
                                                src={assignment.employee.avatar} 
                                                alt={assignment.employee.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-600">
                                                {assignment.employee.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-white">{assignment.employee.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-lg ${getStatusColor(assignment.status.id)}`}>
                                                    {assignment.status.name}
                                                </span>
                                                {assignment.checked && (
                                                    <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
                                                        ✓ Đã kiểm tra
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-400">Tiến độ</p>
                                        <p className="font-bold text-blue-400 text-lg">{assignment.process}%</p>
                                        {assignment.completed_date && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                Hoàn thành: {formatDate(assignment.completed_date)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskEditForm;