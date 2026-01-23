import { useState, useEffect } from "react";
import {
    Calendar,
    CheckCircle2,
    Users,
    ArrowLeft,
    Send,
    Briefcase,
    Target,
    FileText,
    AlertCircle,
    Building,
    UserCheck,
    Search,
    Filter,
    X,
} from "lucide-react";
import {
    createTask,
    getTypeTask,
    getPriorityTask,
    getListProject,
    getChildKpi,
    getListEmployee,
    getStatusTask,
    getListDepartment,
    getListPosition,
} from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { useTaskData } from "@/src/hooks/taskhook";
import { toast } from "react-toastify";
import { useProfileData } from "@/src/hooks/profileHook";

interface AssignFormData {
    name: string;
    type_task: number;
    date_start: string;
    date_end: string;
    task_priority: number;
    project_id: number;
    kpi_item_id: number;
    target_type: number;
    process: number;
    task_status: number;
    employees: number[] | number | string;
    min_reject: number;
    max_reject: number;

}

interface ValidationErrors {
    name?: string;
    date_start?: string;
    date_end?: string;
    employees?: string;
    project_id?: string;
    reject?: string;
}

interface AssignTaskProps {
    onBack: () => void;
    onAssignSuccess?: (task: any) => void;
}

function AssignTask({ onBack, onAssignSuccess }: AssignTaskProps) {
    const dispatch = useDispatch();
    const {
        typeTask,
        priorityTask,
        childKpi,
        statusTask,
        listProject,
        listEmployee,
        listDepartment,
        listPosition,
    } = useTaskData();

    const { tasks } = useProfileData();

    const [assignForm, setAssignForm] = useState<AssignFormData>({
        name: "",
        type_task: 1,
        date_start: "",
        date_end: "",
        task_priority: 1,
        project_id: 0,
        kpi_item_id: 0,
        target_type: 3,
        process: 0,
        task_status: 1,
        employees: [],
        min_reject: 2,
        max_reject: 3,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Employee filter states
    const [searchText, setSearchText] = useState("");
    const [filterPosition, setFilterPosition] = useState<number | null>(null);
    const [filterDepartment, setFilterDepartment] = useState<number | null>(
        null
    );
    const [selectAllEmployees, setSelectAllEmployees] = useState(false);

    useEffect(() => {
        if (!statusTask) {
            dispatch(getStatusTask() as any);
        }
        dispatch(getTypeTask() as any);
        dispatch(getPriorityTask() as any);
        dispatch(getListProject() as any);
        dispatch(getChildKpi() as any);
        dispatch(getListPosition() as any);
        dispatch(getListDepartment() as any);

        // Load employees with initial filters
        dispatch(
            getListEmployee({
                position_id: null,
                department_id: null,
                filter: null,
            }) as any
        );
    }, [dispatch]);

    useEffect(() => {
        if (
            listProject &&
            listProject.length > 0 &&
            assignForm.project_id === 0
        ) {
            setAssignForm((prev) => ({
                ...prev,
                project_id: listProject[0].id,
            }));
            setSelectedProject(listProject[0]);
        }
    }, [listProject]);

    useEffect(() => {
        if (childKpi && childKpi.length > 0 && assignForm.kpi_item_id === 0) {
            setAssignForm((prev) => ({
                ...prev,
                kpi_item_id: parseInt(childKpi[0].id),
            }));
        }
    }, [childKpi]);

    // Fetch employees when filters change
    useEffect(() => {
        if (assignForm.target_type === 3) {
            const timer = setTimeout(() => {
                dispatch(
                    getListEmployee({
                        position_id: filterPosition,
                        department_id: filterDepartment,
                        filter: searchText || null,
                    }) as any
                );
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [
        searchText,
        filterPosition,
        filterDepartment,
        assignForm.target_type,
        dispatch,
    ]);

    // Handle select all employees
    useEffect(() => {
        if (
            selectAllEmployees &&
            listEmployee &&
            assignForm.target_type === 3
        ) {
            const allEmployeeIds = listEmployee.map((emp: any) => emp.id);
            setAssignForm((prev) => ({ ...prev, employees: allEmployeeIds }));
        } else if (!selectAllEmployees && assignForm.target_type === 3) {
            setAssignForm((prev) => ({ ...prev, employees: [] }));
        }
    }, [selectAllEmployees, listEmployee]);

    const handleProjectChange = (projectId: number) => {
      
      const project = listProject?.find((p: any) => p.id === projectId);
      setSelectedProject(project || null);
      
      setAssignForm((prev) => ({
          ...prev,
          project_id: projectId,
          date_start: project?.date_start || "",
          date_end: project?.date_end || "",
      }));

      if (errors.project_id) {
          setErrors((prev) => ({ ...prev, project_id: undefined }));
      }
    };

    const toggleEmployeeSelection = (employeeId: number) => {
        if (assignForm.target_type !== 3 || selectAllEmployees) return;

        setAssignForm((prev) => {
            const currentEmployees = Array.isArray(prev.employees)
                ? prev.employees
                : [];
            const isSelected = currentEmployees.includes(employeeId);
            return {
                ...prev,
                employees: isSelected
                    ? currentEmployees.filter((id) => id !== employeeId)
                    : [...currentEmployees, employeeId],
            };
        });

        if (errors.employees) {
            setErrors((prev) => ({ ...prev, employees: undefined }));
        }
    };

    const selectPosition = (positionId: number) => {
        setAssignForm({ ...assignForm, employees: positionId });
        if (errors.employees) {
            setErrors((prev) => ({ ...prev, employees: undefined }));
        }
    };

    const selectDepartment = (departmentId: number) => {
        setAssignForm({ ...assignForm, employees: departmentId });
        if (errors.employees) {
            setErrors((prev) => ({ ...prev, employees: undefined }));
        }
    };

    const clearFilters = () => {
        setSearchText("");
        setFilterPosition(null);
        setFilterDepartment(null);
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!assignForm.name.trim()) {
            newErrors.name = "Vui lòng nhập tên nhiệm vụ";
        }

        if (!assignForm.date_start) {
            newErrors.date_start = "Vui lòng chọn ngày bắt đầu";
        }

        if (!assignForm.date_end) {
            newErrors.date_end = "Vui lòng chọn ngày kết thúc";
        }

        if (
            assignForm.date_start &&
            assignForm.date_end &&
            assignForm.date_start > assignForm.date_end
        ) {
            newErrors.date_end = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        // Validate dates against project dates
        if (selectedProject && assignForm.project_id !== 0) {
            if (assignForm.date_start < selectedProject.date_start) {
                newErrors.date_start = `Ngày bắt đầu phải sau ngày bắt đầu dự án (${new Date(
                    selectedProject.date_start
                ).toLocaleDateString("vi-VN")})`;
            }
            if (assignForm.date_end > selectedProject.date_end) {
                newErrors.date_end = `Ngày kết thúc phải trước ngày kết thúc dự án (${new Date(
                    selectedProject.date_end
                ).toLocaleDateString("vi-VN")})`;
            }
        }

        if (!assignForm.project_id) {
            newErrors.project_id = "Vui lòng chọn dự án";
        }

        if(assignForm.min_reject > assignForm.max_reject){
            newErrors.reject = "số lần (min) không được lớn hơn (max)"
        }

        if (assignForm.target_type === 3) {
            if (
                !selectAllEmployees &&
                (!Array.isArray(assignForm.employees) ||
                    assignForm.employees.length === 0)
            ) {
                newErrors.employees =
                    "Vui lòng chọn ít nhất 1 nhân viên hoặc chọn tất cả";
            }
        } else if (assignForm.target_type === 1) {
            if (!assignForm.employees || assignForm.employees === "") {
                newErrors.employees = "Vui lòng chọn 1 phòng ban";
            }
        } else if (assignForm.target_type === 2) {
            if (!assignForm.employees || assignForm.employees === "") {
                newErrors.employees = "Vui lòng chọn 1 vị trí";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAssignTask = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("userToken");
            const taskData: any = {
                name: assignForm.name,
                type_task: parseInt(assignForm.type_task.toString()),
                date_start: assignForm.date_start,
                date_end: assignForm.date_end,
                task_priority: parseInt(assignForm.task_priority.toString()),
                project_id: parseInt(assignForm.project_id.toString()),
                kpi_item_id: parseInt(assignForm.kpi_item_id.toString()),
                target_type: parseInt(assignForm.target_type.toString()),
                process: assignForm.process,
                task_status: parseInt(assignForm.task_status.toString()),
                employees: null,
                position_id: null,
                department_id: null,
                token,
                min_count_reject: parseInt(assignForm.min_reject.toString()),
                max_count_reject: parseInt(assignForm.max_reject.toString()),
            };

            // Logic: 1 task chỉ cho 1 phòng ban HOẶC 1 vị trí HOẶC nhiều nhân viên
            if (assignForm.target_type === 3) {
                // Nhân viên
                if (selectAllEmployees) {
                    // Chọn tất cả nhân viên
                    taskData.employees =
                        listEmployee?.map((emp: any) => emp.id) || [];
                    taskData.position_id = null;
                    taskData.department_id = null;
                } else {
                    taskData.employees = assignForm.employees;
                    taskData.position_id = null;
                    taskData.department_id = null;
                }
            } else if (assignForm.target_type === 2) {
                // Vị trí - chỉ 1 vị trí
                taskData.position_id = assignForm.employees;
                taskData.employees = null;
                taskData.department_id = null;
            } else if (assignForm.target_type === 1) {
                // Phòng ban - chỉ 1 phòng ban
                taskData.department_id = assignForm.employees;
                taskData.employees = null;
                taskData.position_id = null;
            }


            const result = await dispatch(createTask(taskData) as any);

            if (result.payload.data.success) {
                toast.success("Giao nhiệm vụ thành công!");
                setAssignForm({
                    name: "",
                    type_task: 1,
                    date_start: "",
                    date_end: "",
                    task_priority: 1,
                    project_id: listProject?.[0]?.id || 0,
                    kpi_item_id: childKpi?.[0]?.id
                        ? parseInt(childKpi[0].id)
                        : 0,
                    target_type: 3,
                    process: 0,
                    task_status: 1,
                    employees: [],
                    min_reject: 2,
                    max_reject: 3,
                });
                setErrors({});
                setSelectAllEmployees(false);
                clearFilters();

                onBack();
            } else {
                toast.error(result.payload.data.message);
            }
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Có lỗi xảy ra khi tạo nhiệm vụ. Vui lòng thử lại.",);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedCount = () => {
        if (assignForm.target_type === 3) {
            if (selectAllEmployees) {
                return listEmployee?.length || 0;
            }
            return Array.isArray(assignForm.employees)
                ? assignForm.employees.length
                : 0;
        }
        if (
            (assignForm.target_type === 1 || assignForm.target_type === 2) &&
            assignForm.employees
        ) {
            return 1;
        }
        return 0;
    };
    
    return (
        <div className="min-h-screen bg-slate-900 p-3 sm:p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 sm:mb-6"
                >
                    <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-medium">
                        Quay lại danh sách
                    </span>
                </button>

                <div className="bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FileText className="text-white" size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                Giao Nhiệm Vụ Mới
                            </h2>
                        </div>
                        <p className="text-blue-100 text-xs sm:text-sm">
                            Tạo và phân công nhiệm vụ cho nhân viên
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                <FileText
                                    size={18}
                                    className="text-blue-400 sm:w-5 sm:h-5"
                                />
                                <span>Thông tin nhiệm vụ</span>
                            </h3>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                    Tên nhiệm vụ{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={assignForm.name}
                                    onChange={(e) => {
                                        setAssignForm({
                                            ...assignForm,
                                            name: e.target.value,
                                        });
                                        if (errors.name) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                name: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Ví dụ: Xây dựng API login..."
                                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition ${
                                        errors.name
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-700 focus:border-blue-500"
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Loại nhiệm vụ
                                    </label>
                                    <select
                                        value={assignForm.type_task}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                type_task: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                    >
                                        {typeTask?.map((type: any) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Độ ưu tiên
                                    </label>
                                    <select
                                        value={assignForm.task_priority}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                task_priority: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                    >
                                        {priorityTask?.map((priority: any) => (
                                            <option
                                                key={priority.id}
                                                value={priority.id}
                                            >
                                                {priority.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                    Dự án{" "}
                                    <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={assignForm.project_id}
                                    onChange={(e) =>
                                        handleProjectChange(
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                                        errors.project_id
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-700 focus:border-blue-500"
                                    }`}
                                >
                                    <option value={0}>-- Chọn dự án --</option>
                                    {listProject?.map((project: any) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.project_id && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.project_id}
                                    </p>
                                )}

                                {selectedProject && (
                                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                                            <Calendar
                                                size={14}
                                                className="text-blue-400"
                                            />
                                            <span>Thời gian dự án:</span>
                                            <span className="font-semibold text-white">
                                                {selectedProject.date_start && new Date(
                                                    selectedProject.date_start
                                                ).toLocaleDateString("vi-VN")}
                                                {!selectedProject.date_start && ("Chưa có ngày bắt đầu")}
                                            </span>
                                            <span className="text-slate-500">
                                                →
                                            </span>
                                            <span className="font-semibold text-white">
                                                {selectedProject.date_end && new Date(
                                                    selectedProject.date_end
                                                ).toLocaleDateString("vi-VN")}
                                                {!selectedProject.date_end && ("Chưa có ngày kết thúc")}

                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                    Chỉ tiêu KPI
                                </label>
                                <select
                                    value={assignForm.kpi_item_id}
                                    onChange={(e) =>
                                        setAssignForm({
                                            ...assignForm,
                                            kpi_item_id: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                >
                                    {childKpi?.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Ngày bắt đầu{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            size={16}
                                        />
                                        <input
                                            type="date"
                                            value={assignForm.date_start}
                                            min={selectedProject?.date_start}
                                            max={selectedProject?.date_end}
                                            onChange={(e) => {
                                                setAssignForm({
                                                    ...assignForm,
                                                    date_start: e.target.value,
                                                });
                                                if (errors.date_start) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        date_start: undefined,
                                                    }));
                                                }
                                            }}
                                            className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:pr-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                                                errors.date_start
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                        />
                                    </div>
                                    {errors.date_start && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.date_start}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Ngày kết thúc{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            size={16}
                                        />
                                        <input
                                            type="date"
                                            value={assignForm.date_end}
                                            min={selectedProject?.date_start}
                                            max={selectedProject?.date_end}
                                            onChange={(e) => {
                                                setAssignForm({
                                                    ...assignForm,
                                                    date_end: e.target.value,
                                                });
                                                if (errors.date_end) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        date_end: undefined,
                                                    }));
                                                }
                                            }}
                                            className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:pr-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                                                errors.date_end
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                        />
                                    </div>
                                    {errors.date_end && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.date_end}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={assignForm.task_status}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                task_status: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                    >
                                        {statusTask?.map((status: any) => (
                                            <option
                                                key={status.id}
                                                value={status.id}
                                            >
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Tiến độ (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={assignForm.process}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                process:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Số lần vi phạm (min)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={assignForm.min_reject}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                min_reject:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                        />

                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Số lần vi phạm (max)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={assignForm.max_reject}
                                        onChange={(e) =>
                                            setAssignForm({
                                                ...assignForm,
                                                max_reject:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                                        />

                                </div>
                                {errors.reject && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.reject}
                                        </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6 border-t border-slate-800">
                            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <Users
                                    size={18}
                                    className="text-blue-400 sm:w-5 sm:h-5"
                                />
                                <span>Đối tượng nhận nhiệm vụ</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAssignForm({
                                            ...assignForm,
                                            target_type: 3,
                                            employees: [],
                                        });
                                        setSelectAllEmployees(false);
                                        clearFilters();
                                    }}
                                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                                        assignForm.target_type === 3
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-slate-700 bg-slate-900 hover:border-slate-600"
                                    }`}
                                >
                                    <UserCheck
                                        size={24}
                                        className={
                                            assignForm.target_type === 3
                                                ? "text-blue-400"
                                                : "text-slate-400"
                                        }
                                    />
                                    <span
                                        className={`text-sm font-semibold ${
                                            assignForm.target_type === 3
                                                ? "text-white"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        Nhân viên
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssignForm({
                                            ...assignForm,
                                            target_type: 2,
                                            employees: "",
                                        })
                                    }
                                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                                        assignForm.target_type === 2
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-slate-700 bg-slate-900 hover:border-slate-600"
                                    }`}
                                >
                                    <Briefcase
                                        size={24}
                                        className={
                                            assignForm.target_type === 2
                                                ? "text-blue-400"
                                                : "text-slate-400"
                                        }
                                    />
                                    <span
                                        className={`text-sm font-semibold ${
                                            assignForm.target_type === 2
                                                ? "text-white"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        Vị trí
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssignForm({
                                            ...assignForm,
                                            target_type: 1,
                                            employees: "",
                                        })
                                    }
                                    className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                                        assignForm.target_type === 1
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-slate-700 bg-slate-900 hover:border-slate-600"
                                    }`}
                                >
                                    <Building
                                        size={24}
                                        className={
                                            assignForm.target_type === 1
                                                ? "text-blue-400"
                                                : "text-slate-400"
                                        }
                                    />
                                    <span
                                        className={`text-sm font-semibold ${
                                            assignForm.target_type === 1
                                                ? "text-white"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        Phòng ban
                                    </span>
                                </button>
                            </div>

                            {errors.employees && (
                                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
                                        <AlertCircle
                                            size={14}
                                            className="sm:w-4 sm:h-4"
                                        />
                                        {errors.employees}
                                    </p>
                                </div>
                            )}

                            {assignForm.target_type === 3 && (
                                <>
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-700 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="selectAll"
                                                checked={selectAllEmployees}
                                                onChange={(e) =>
                                                    setSelectAllEmployees(
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                                            />
                                            <label
                                                htmlFor="selectAll"
                                                className="text-sm font-semibold text-white cursor-pointer"
                                            >
                                                Chọn tất cả nhân viên (
                                                {listEmployee?.length || 0})
                                            </label>
                                        </div>

                                        {!selectAllEmployees && (
                                            <>
                                                <div className="relative">
                                                    <Search
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                                        size={16}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={searchText}
                                                        onChange={(e) =>
                                                            setSearchText(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Tìm theo tên, email, số điện thoại..."
                                                        className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                                                            <Filter size={12} />
                                                            Lọc theo vị trí
                                                        </label>
                                                        <select
                                                            value={
                                                                filterPosition ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setFilterPosition(
                                                                    e.target
                                                                        .value
                                                                        ? parseInt(
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          )
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                                        >
                                                            <option value="">
                                                                -- Tất cả vị trí
                                                                --
                                                            </option>
                                                            {listPosition?.map(
                                                                (
                                                                    position: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            position.id
                                                                        }
                                                                        value={
                                                                            position.id
                                                                        }
                                                                    >
                                                                        {
                                                                            position.title
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                                                            <Filter size={12} />
                                                            Lọc theo phòng ban
                                                        </label>
                                                        <select
                                                            value={
                                                                filterDepartment ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setFilterDepartment(
                                                                    e.target
                                                                        .value
                                                                        ? parseInt(
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          )
                                                                        : null
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                                        >
                                                            <option value="">
                                                                -- Tất cả phòng
                                                                ban --
                                                            </option>
                                                            {listDepartment?.map(
                                                                (
                                                                    department: any
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            department.id
                                                                        }
                                                                        value={
                                                                            department.id
                                                                        }
                                                                    >
                                                                        {
                                                                            department.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                {(searchText ||
                                                    filterPosition ||
                                                    filterDepartment) && (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
                                                    >
                                                        <X size={12} />
                                                        Xóa bộ lọc
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {!selectAllEmployees && (
                                        <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                                            {listEmployee &&
                                            listEmployee.length > 0 ? (
                                                listEmployee.map(
                                                    (employee: any) => {
                                                        const isSelected =
                                                            Array.isArray(
                                                                assignForm.employees
                                                            ) &&
                                                            assignForm.employees.includes(
                                                                employee.id
                                                            );
                                                        return (
                                                            <div
                                                                key={
                                                                    employee.id
                                                                }
                                                                onClick={() =>
                                                                    toggleEmployeeSelection(
                                                                        employee.id
                                                                    )
                                                                }
                                                                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                                                                    isSelected
                                                                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                                        : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                                                                        isSelected
                                                                            ? "border-blue-500 bg-blue-500"
                                                                            : "border-slate-600"
                                                                    }`}
                                                                >
                                                                    {isSelected && (
                                                                        <CheckCircle2
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-white sm:w-4 sm:h-4"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                                                                    {employee.name.charAt(
                                                                        0
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-sm sm:text-base font-semibold text-white truncate block">
                                                                        {
                                                                            employee.name
                                                                        }
                                                                    </span>
                                                                    <div className="flex flex-col gap-0.5 text-xs text-slate-400">
                                                                        {employee.email && (
                                                                            <span className="truncate">
                                                                                Email:{" "}
                                                                                {
                                                                                    employee.email
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        {employee.phone && (
                                                                            <span>
                                                                                SĐT:{" "}
                                                                                {
                                                                                    employee.phone
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-1 text-right text-xs flex-shrink-0">
                                                                    {employee.department && (
                                                                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                                            {
                                                                                employee
                                                                                    .department
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {employee.position && (
                                                                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                                            {
                                                                                employee
                                                                                    .position
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <div className="text-center py-8 text-slate-400">
                                                    <Users
                                                        size={32}
                                                        className="mx-auto mb-2 opacity-50"
                                                    />
                                                    <p className="text-sm">
                                                        Không tìm thấy nhân viên
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {assignForm.target_type === 2 && (
                                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                                    {listPosition?.map((position: any) => {
                                        const isSelected =
                                            assignForm.employees ===
                                            position.id;
                                        return (
                                            <div
                                                key={position.id}
                                                onClick={() =>
                                                    selectPosition(position.id)
                                                }
                                                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                        : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                                                }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-500"
                                                            : "border-slate-600"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                                                    )}
                                                </div>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                    <Briefcase
                                                        className="text-white"
                                                        size={20}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm sm:text-base font-semibold text-white truncate block">
                                                        {position.title}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Vị trí ID: {position.id}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {assignForm.target_type === 1 && (
                                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                                    {listDepartment?.map((department: any) => {
                                        const isSelected =
                                            assignForm.employees ===
                                            department.id;
                                        return (
                                            <div
                                                key={department.id}
                                                onClick={() =>
                                                    selectDepartment(
                                                        department.id
                                                    )
                                                }
                                                className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                        : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                                                }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-500"
                                                            : "border-slate-600"
                                                    }`}
                                                >
                                                    {isSelected && (
                                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                                                    )}
                                                </div>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                                    <Building
                                                        className="text-white"
                                                        size={20}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm sm:text-base font-semibold text-white truncate block">
                                                        {department.name}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Phòng ban ID:{" "}
                                                        {department.id}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800">
                            <button
                                onClick={onBack}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base font-semibold rounded-lg transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAssignTask}
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
                            >
                                <Send
                                    size={16}
                                    className="sm:w-[18px] sm:h-[18px]"
                                />
                                <span>
                                    {isSubmitting
                                        ? "Đang tạo..."
                                        : `Giao nhiệm vụ (${getSelectedCount()})`}
                                </span>
                            </button>
                        </div>
                    </div>

                    {getSelectedCount() > 0 && (
                        <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Target
                                    className="text-blue-400 flex-shrink-0 mt-0.5"
                                    size={18}
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-semibold text-blue-400 mb-1">
                                        Tóm tắt giao việc
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-300">
                                        Bạn đang giao nhiệm vụ{" "}
                                        <span className="font-semibold text-white">
                                            "{assignForm.name || "..."}"
                                        </span>{" "}
                                        cho{" "}
                                        {assignForm.target_type === 3 && (
                                            <>
                                                {selectAllEmployees ? (
                                                    <span className="font-semibold text-white">
                                                        tất cả nhân viên (
                                                        {getSelectedCount()})
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="font-semibold text-white">
                                                            {getSelectedCount()}
                                                        </span>{" "}
                                                        nhân viên
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {assignForm.target_type === 2 && (
                                            <span className="font-semibold text-white">
                                                1 vị trí
                                            </span>
                                        )}
                                        {assignForm.target_type === 1 && (
                                            <span className="font-semibold text-white">
                                                1 phòng ban
                                            </span>
                                        )}
                                        .
                                        {assignForm.date_start &&
                                            assignForm.date_end && (
                                                <span>
                                                    {" "}
                                                    Thời gian:{" "}
                                                    <span className="font-semibold text-white">
                                                        {new Date(
                                                            assignForm.date_start
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </span>
                                                    {" → "}
                                                    <span className="font-semibold text-white">
                                                        {new Date(
                                                            assignForm.date_end
                                                        ).toLocaleDateString(
                                                            "vi-VN"
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssignTask;
