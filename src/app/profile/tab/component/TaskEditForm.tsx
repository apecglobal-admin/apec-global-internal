import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import FilterableSelector from '@/components/FilterableSelector';
import { useDispatch } from 'react-redux';
import { getListProject, getListCompanyTask } from '@/src/features/task/api';

interface TaskEditFormProps {
    task: any;
    typeTask: any[];
    priorityTask: any[];
    listProject: any[];
    listCompanyTask: any[];
    childKpi: any[];
    listEmployee: any[];
    hasCompletedEmployee: boolean;
    hasAllCompleted: boolean;
    isAdmin?: boolean;
    onSave: (formData: any) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
    task,
    typeTask,
    priorityTask,
    listProject,
    listCompanyTask,
    childKpi,
    listEmployee,
    hasCompletedEmployee,
    hasAllCompleted,
    isAdmin = true,
    onSave,
    onCancel,
    isLoading
}) => {
    console.log("ấd", task);
    
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type_task: 0,
        date_start: '',
        date_end: '',
        task_priority: 0,
        project_id: 0,
        projects: [] as any[],
        kpi_item_id: 0,
        min_count_reject: 0,
        max_count_reject: 0,
        employees: [] as number[],
        value: 0,
    });

    const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);

    const [dropdownStates, setDropdownStates] = useState({
        type_task: false,
        priority: false,
        project: false,
        kpi: false,
        employees: false,
    });

    useEffect(() => {
        
        if (task) {
            // Khởi tạo companies từ task nếu có
            if (task.companies && Array.isArray(task.companies)) {
                setSelectedCompanies(task.companies);
            }
            

            setFormData({
                name: task.name || '',
                description: task.description || '',
                type_task: task.type_task?.id || 0,
                date_start: toVNDate(task.date_start),
                date_end: toVNDate(task.date_end),
                task_priority: task.priority?.id || 0,
                project_id: task.project?.id || 0,
                // Nếu task có projects (mảng), dùng luôn; nếu chỉ có project đơn thì wrap lại
                projects: task.projects
                    ? task.projects
                    : task.project
                    ? [task.project]
                    : [],
                kpi_item_id: task.kpi_item?.id || 0,
                min_count_reject: task.min_count_reject || 0,
                max_count_reject: task.max_count_reject || 0,
                employees: task.task_assignment?.map((a: any) => a.employee.id) || [],
                value: task.target_value,
            });
        }
    }, [task]);

    const toVNDate = (dateString: string): string => {
        if (!dateString) return '';
        const d = new Date(dateString);
        d.setHours(d.getHours() + 7);
        return d.toISOString().split('T')[0];
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN');

    const formatNumber = (value: number) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-US').format(value);
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
        setDropdownStates(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'kpi_item_id') {
            setFormData(prev => ({ ...prev, value: 0 }));
        }
    };

    const handleProcessChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const unit = childKpi?.find((k: any) => Number(k.id) === Number(formData.kpi_item_id))?.unit_name;
        const rawValue = e.target.value.replace(/,/g, '');
        let value = Number(rawValue);
        if (Number.isNaN(value)) value = 0;
        if (unit === '%') {
            if (value > 100) value = 100;
            if (value < 0) value = 0;
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEmployeeToggle = (employeeId: number) => {
        setFormData(prev => ({
            ...prev,
            employees: prev.employees.includes(employeeId)
                ? prev.employees.filter(id => id !== employeeId)
                : [...prev.employees, employeeId],
        }));
    };

    const handleCompanyChange = (selected: any[]) => {
        setSelectedCompanies(selected);
        const companiesParam = selected.length > 0
            ? selected.map((c: any) => c.id).join(',')
            : null;
        dispatch(getListProject({ companies: companiesParam }) as any);
        // Reset projects khi đổi company
        setFormData(prev => ({ ...prev, projects: [], project_id: 0 }));
    };

    const handleProjectChange = (selected: any) => {
        if (!selected) {
            setFormData(prev => ({ ...prev, projects: [], project_id: 0 }));
            return;
        }
        const selectedArr = Array.isArray(selected) ? selected : [selected];
        setFormData(prev => ({
            ...prev,
            projects: selectedArr,
            project_id: selectedArr[0]?.id || 0,
        }));
    };

    const handleFilterCompany = (search: string) => {
        dispatch(getListCompanyTask({ search: search || null }) as any);
    };

    const handleFilterProject = (filter: any) => {
        const companiesParam = selectedCompanies.length > 0
            ? selectedCompanies.map((c: any) => c.id).join(',')
            : null;
        dispatch(getListProject({ filter, companies: companiesParam }) as any);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        const originalProjects = task.projects ?? (task.project ? [task.project] : []);
        const originalCompanies = task.companies ?? [];
    
        const originalData = {
            name: task.name || '',
            description: task.description || '',
            type_task: task.type_task?.id || 0,
            date_start: task.date_start ? task.date_start.split('T')[0] : '',
            date_end: task.date_end ? task.date_end.split('T')[0] : '',
            task_priority: task.priority?.id || 0,
            projects: originalProjects.map((p: any) => p.id),
            companies: originalCompanies.map((c: any) => c.id),
            kpi_item_id: task.kpi_item?.id || 0,
            min_count_reject: task.min_count_reject || 0,
            max_count_reject: task.max_count_reject || 0,
            employees: task.task_assignment?.map((a: any) => a.employee.id) || [],
            value: task.target_value,
        };
    
        if (formData.value === 0) {
            toast.warning('Bạn chưa nhập mục tiêu đạt được');
            return;
        }
        if (formData.date_start && formData.date_end) {
            if (new Date(formData.date_start) > new Date(formData.date_end)) {
                toast.warning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
                return;
            }
        }
    
        const currentProjects = formData.projects.map((p: any) => p.id);
        const currentCompanies = selectedCompanies.map((c: any) => c.id);
    
        // Build changed data — áp dụng cho cả admin và non-admin
        const changedData: any = {};
    
        // Các field luôn được phép thay đổi
        if (formData.name !== originalData.name) changedData.name = formData.name;
        if (formData.description !== originalData.description) changedData.description = formData.description;
        if (formData.date_start !== originalData.date_start) changedData.date_start = formData.date_start;
        if (formData.date_end !== originalData.date_end) changedData.date_end = formData.date_end;
    
        // Các field chỉ cho phép khi chưa có ai hoàn thành
        if (!hasCompletedEmployee) {
            if (formData.type_task !== originalData.type_task) changedData.type_task = formData.type_task;
            if (formData.task_priority !== originalData.task_priority) changedData.task_priority = formData.task_priority;
            if (formData.kpi_item_id !== originalData.kpi_item_id) changedData.kpi_item_id = formData.kpi_item_id;
            if (formData.min_count_reject !== originalData.min_count_reject) changedData.min_count_reject = formData.min_count_reject;
            if (formData.max_count_reject !== originalData.max_count_reject) changedData.max_count_reject = formData.max_count_reject;
            if (formData.value !== originalData.value) changedData.target_value = formData.value;
    
            const projectsChanged =
                currentProjects.length !== originalData.projects.length ||
                currentProjects.some((id: number) => !originalData.projects.includes(id));
            if (projectsChanged) changedData.projects = currentProjects;
    
            const companiesChanged =
                currentCompanies.length !== originalData.companies.length ||
                currentCompanies.some((id: number) => !originalData.companies.includes(id));
            if (companiesChanged) changedData.companies = currentCompanies;
    
            // employees chỉ admin mới được đổi
            if (isAdmin) {
                const employeesChanged =
                    formData.employees.length !== originalData.employees.length ||
                    formData.employees.some(id => !originalData.employees.includes(id)) ||
                    originalData.employees.some((id: any) => !formData.employees.includes(id));
                if (employeesChanged) changedData.employees = formData.employees;
            }
        }
    
        onSave(changedData);
    };
    const currentUnit = childKpi?.find(
        (k: any) => Number(k.id) === Number(formData.kpi_item_id)
    )?.unit_name;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
            {/* Header với nút quay lại */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex-shrink-0"
                >
                    <ArrowLeft/>
                </button>
                <div>
                    <h2 className="text-lg font-bold text-white">Chỉnh sửa công việc</h2>
                    <p className="text-blue-100 text-xs mt-0.5 truncate max-w-xs">{task?.name}</p>
                </div>
            </div>

            <div className="p-6">
                {hasAllCompleted && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                        🔒 Tất cả nhân viên đã hoàn thành. Bạn chỉ có thể cập nhật Tên và Mô tả.
                    </div>
                )}
                {!hasAllCompleted && hasCompletedEmployee && (
                    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
                        ⚠️ Có nhân viên đã hoàn thành. Bạn chỉ có thể cập nhật Tên, Mô tả, Ngày bắt đầu và Ngày kết thúc.
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

                    {/* Công ty */}
                    {!hasCompletedEmployee && (
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-slate-400 block mb-2">
                                Công ty <span className="text-red-400">*</span>
                            </label>
                            <FilterableSelector
                                data={listCompanyTask ?? []}
                                multi={true}
                                onFilter={handleFilterCompany}
                                onSelect={(selected) => {
                                    const arr = Array.isArray(selected)
                                        ? selected
                                        : selected
                                        ? [selected]
                                        : [];
                                    handleCompanyChange(arr);
                                }}
                                value={selectedCompanies}
                                placeholder="Chọn công ty"
                                displayField="name"
                                emptyMessage="Không có công ty"
                            />
                            {selectedCompanies.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedCompanies.map((c: any) => (
                                        <span
                                            key={c.id}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-xs text-purple-300"
                                        >
                                            {c.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCompanyChange(
                                                        selectedCompanies.filter((x: any) => x.id !== c.id)
                                                    )
                                                }
                                                className="text-purple-400 hover:text-white transition ml-0.5"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dự án — multi-select */}
                    {!hasCompletedEmployee && (
                        <div className="mb-6">
                            <label className="text-sm font-semibold text-slate-400 block mb-2">
                                Dự án <span className="text-red-400">*</span>
                            </label>
                            <FilterableSelector
                                data={listProject ?? []}
                                onFilter={handleFilterProject}
                                onSelect={(selected) => handleProjectChange(selected ? [selected] : [])}
                                value={formData.projects[0] ?? null}
                                placeholder="Chọn dự án"
                                displayField="name"
                                emptyMessage="Không có dự án"
                            />
                            {formData.projects.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.projects.map((p: any, idx: number) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-xs text-blue-300"
                                        >
                                            {p.name}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleProjectChange(
                                                        formData.projects.filter((x: any) => x.id !== p.id)
                                                    )
                                                }
                                                className="text-blue-400 hover:text-white transition ml-0.5"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Cột trái */}
                        <div className="space-y-4">
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
                                                        onClick={() => { handleInputChange('type_task', type.id); toggleDropdown('type_task'); }}
                                                        className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                    >
                                                        {type.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white mt-1">{task.type_task?.name}</p>
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
                                                        onClick={() => { handleInputChange('kpi_item_id', kpi.id); toggleDropdown('kpi'); }}
                                                        className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-white"
                                                    >
                                                        {kpi.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white mt-1">{task.kpi_item?.name}</p>
                                )}
                            </div>

                            {/* Mục tiêu */}
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <label className="text-sm font-semibold text-slate-400">
                                    Mục tiêu ({currentUnit})
                                </label>
                                {!hasCompletedEmployee ? (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatNumber(formData.value)}
                                        onChange={(e) => handleProcessChange(e, 'value')}
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
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
                                                        onClick={() => { handleInputChange('task_priority', priority.id); toggleDropdown('priority'); }}
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
                                {!hasAllCompleted ? (
                                    <input
                                        type="date"
                                        value={formData.date_start}
                                        onChange={(e) => handleInputChange('date_start', e.target.value)}
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-white mt-1">{formData.date_start}</p>
                                )}
                            </div>

                            {/* Ngày kết thúc */}
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <label className="text-sm font-semibold text-slate-400">Ngày kết thúc</label>
                                {!hasAllCompleted ? (
                                    <input
                                        type="date"
                                        value={formData.date_end}
                                        onChange={(e) => handleInputChange('date_end', e.target.value)}
                                        className="w-full mt-1 bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-white mt-1">{formData.date_end}</p>
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

                    {/* Nhân viên thực hiện — chỉ hiện khi isAdmin và chưa có ai hoàn thành */}
                    {isAdmin && !hasCompletedEmployee && (
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
                                                <X size={14} className="cursor-pointer hover:text-red-400" onClick={() => handleEmployeeToggle(empId)} />
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

                {/* Danh sách người thực hiện — chỉ hiện khi isAdmin */}
                {isAdmin && task.task_assignment && task.task_assignment.length > 0 && (
                    <div className="mt-6">
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
        </div>
    );
};

export default TaskEditForm;