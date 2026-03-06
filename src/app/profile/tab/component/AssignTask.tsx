import { useState, useEffect, useRef } from "react";
import {
    Calendar,
    ArrowLeft,
    Send,
    FileText,
    AlertCircle,
    Target,
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
    getDetailListTaskAssign,
} from "@/src/features/task/api";
import { useDispatch } from "react-redux";
import { useTaskData } from "@/src/hooks/taskhook";
import { toast } from "react-toastify";
import { useProfileData } from "@/src/hooks/profileHook";
import TaskTargetSelector from "@/components/TaskTargetSelector";
import FilterableSelector from "@/components/FilterableSelector";
import { getToday } from "@/src/utils/formatDate";

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
    target: Number;
    value: Number;
}

interface ValidationErrors {
    name?: string;
    date_start?: string;
    date_end?: string;
    employees?: string;
    project_id?: string;
    reject?: string;
    value?: any;
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
        date_start: getToday(),
        date_end: "",
        task_priority: 1,
        project_id: 0,
        kpi_item_id: 0,
        target_type: 3,
        process: 0,
        task_status: 2,
        employees: [],
        min_reject: 2,
        max_reject: 3,
        target: 0,
        value: 0
    });    
    

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [unit, setUnit] = useState<string>("%");

    const inputRefs = useRef<any>({});
    const errorRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const openPicker = (name: any) => {
        const input = inputRefs.current[name];
        input?.showPicker?.() || input?.focus();
    };

    const setErrorRef = (name: string) => (el: HTMLDivElement | null) => {
        errorRefs.current[name] = el;
    };

    const scrollToFirstError = (errorsObj: ValidationErrors) => {
        const firstErrorKey = Object.keys(errorsObj)[0];
      
        if (!firstErrorKey) return;
      
        const element = errorRefs.current[firstErrorKey];
      
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      
          const input = element.querySelector("input, select, textarea") as HTMLElement;
          input?.focus();
        }
      };

      useEffect(() => {
        const filter = childKpi?.find((data: any) => Number(data.id) === assignForm?.kpi_item_id)
        if(filter?.unit_name){
            setUnit(filter.unit_name)
            // Thêm dòng này:
            setAssignForm((prev) => ({
                ...prev,
                process: filter.unit_name === "%" ? 100 : 0,
            }));
        }
    }, [assignForm?.kpi_item_id]);

    

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (!statusTask) {
            dispatch(getStatusTask() as any);
        }
        if(!typeTask){
            dispatch(getTypeTask() as any);
        }
        if(!priorityTask){
            dispatch(getPriorityTask() as any);
        }
        if(!listProject){
            dispatch(getListProject({}) as any);
        }
        if(!childKpi){
            dispatch(getChildKpi() as any);
        }
        if(!listPosition){
            dispatch(getListPosition() as any);
        }
        if(!listDepartment){
            dispatch(getListDepartment({}) as any);
        }



        dispatch(
            getListEmployee({
                position_id: null,
                department_id: null,
                filter: null,
                token
            }) as any
        );
    }, [dispatch]);

    useEffect(() => {
        if (
            listProject &&
            listProject.length > 0 &&
            assignForm.project_id === 0
        ) {
            const firstProject = listProject[0];
    
            const { date_start, date_end, status } =
                calculateProjectDateInfo(firstProject);
    
            setSelectedProject({
                ...firstProject,
                projectStatus: status,
            });
    
            setAssignForm((prev) => ({
                ...prev,
                project_id: firstProject.id,
                date_start,
                date_end,
            }));
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

    const calculateProjectDateInfo = (project: any) => {
        const today = getToday();
      
        const start = project?.date_start || null;
        const end = project?.date_end || null;
      
        let date_start = today;
        let status: "active" | "upcoming" | "expired" = "active";
      
        if (end && today > end) {
            status = "expired";
            date_start = end;
        }
      
        if (start && today < start) {
            status = "upcoming";
            date_start = start;
        }
      
        return {
          date_start,
          date_end: end || "",
          status,
        };
    };
    
    const handleProjectChange = (projectId: any) => {
        if (!projectId) return;
      
        const project = listProject?.find((p: any) => p.id === projectId.id);
        if (!project) return;
      
        const { date_start, date_end, status } =
          calculateProjectDateInfo(project);
      
        setSelectedProject({
          ...project,
          projectStatus: status,
        });
      
        setAssignForm((prev) => ({
          ...prev,
          project_id: project.id,
          date_start,
          date_end,
        }));
      
        if (errors.project_id) {
          setErrors((prev) => ({ ...prev, project_id: undefined }));
        }
    };

    const handleFilterChange = (filter: any) => {
        dispatch(getListProject({filter}) as any);
    }

    const validateForm = (): ValidationErrors => {
        const newErrors: ValidationErrors = {};
    
        if (assignForm.process === 0 && unit !== "%") {
            newErrors.value = "Vui lòng nhập giá trị";
        }
    
        if (!assignForm.name.trim()) {
            newErrors.name = "Vui lòng nhập tên nhiệm vụ";
        }
    
        if (!assignForm.project_id) {
            newErrors.project_id = "Vui lòng chọn dự án";
        }
    
        if (selectedProject?.projectStatus === "expired") {
            newErrors.project_id = "Dự án đã kết thúc, không thể tạo nhiệm vụ";
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
    
        if (selectedProject && assignForm.project_id !== 0) {
            if (
                selectedProject.date_start &&
                assignForm.date_start < selectedProject.date_start
            ) {
                newErrors.date_start = `Ngày bắt đầu phải sau ngày bắt đầu dự án (${new Date(
                    selectedProject.date_start
                ).toLocaleDateString("vi-VN")})`;
            }
    
            if (
                selectedProject.date_end &&
                assignForm.date_end > selectedProject.date_end
            ) {
                newErrors.date_end = `Ngày kết thúc phải trước ngày kết thúc dự án (${new Date(
                    selectedProject.date_end
                ).toLocaleDateString("vi-VN")})`;
            }
        }
    
        if (assignForm.min_reject > assignForm.max_reject) {
            newErrors.reject = "Số lần (min) không được lớn hơn (max)";
        }
    
        if (assignForm.target_type === 3) {
            if (
                !Array.isArray(assignForm.employees) ||
                assignForm.employees.length === 0
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
        return newErrors;
    };

    const resetForm = () => {
        setAssignForm({
            name: "",
            type_task: 1,
            date_start: getToday(),
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
            target: 0,
            value: 0,
        });
    }

    const handleAssignTask = async () => {
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
          scrollToFirstError(validationErrors);
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
                target_value: assignForm.process,
                task_status: parseInt(assignForm.task_status.toString()),
                employees: null,
                position_id: null,
                department_id: null,
                token,
                min_count_reject: parseInt(assignForm.min_reject.toString()),
                max_count_reject: parseInt(assignForm.max_reject.toString()),
            };

            if (assignForm.target_type === 3) {
                taskData.employees = assignForm.employees;
                taskData.position_id = null;
                taskData.department_id = null;
            } else if (assignForm.target_type === 2) {
                taskData.position_id = assignForm.employees;
                taskData.employees = null;
                taskData.department_id = null;
            } else if (assignForm.target_type === 1) {
                taskData.department_id = assignForm.employees;
                taskData.employees = null;
                taskData.position_id = null;
            }



            const result = await dispatch(createTask(taskData) as any);

            if (result.payload.data.success) {
                toast.success("Giao nhiệm vụ thành công!");
                resetForm()
                dispatch(getDetailListTaskAssign({
                    token: token,
                    key: "listDetailTaskAssign"
                }) as any);
                setErrors({});
                onBack();
            } else {
                toast.error(result.payload.data.message);
            }
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Có lỗi xảy ra khi tạo nhiệm vụ. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const getSelectedCount = () => {
        if (assignForm.target_type === 3) {
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

    const formatNumber = (value: number) => {
        if (!value) return "";
        return new Intl.NumberFormat("en-US").format(value);
    };
      

    const handleProcessChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (unit === "%") return;
    
        const rawValue = e.target.value.replace(/,/g, "");
    
        let value = Number(rawValue);
        if (Number.isNaN(value)) value = 0;
    
        setAssignForm((prev) => ({
            ...prev,
            process: value,
        }));
    
        if (errors.value) {
            setErrors((prev) => ({
                ...prev,
                value: undefined,
            }));
        }
    };
      
    

    const getTargetLabel = () => {
        if (assignForm.target_type === 3) return "nhân viên";
        if (assignForm.target_type === 2) return "vị trí";
        if (assignForm.target_type === 1) return "phòng ban";
        return "";
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

                            <div ref={setErrorRef("name")}>
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

                            <div
                                ref={setErrorRef("project_id")}
                            >
                                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                    Dự án{" "}
                                    <span className="text-red-400">*</span>
                                </label>

                                <FilterableSelector
                                    data={listProject}
                                    onFilter={(filter) =>  handleFilterChange(filter)}
                                    onSelect={(filter) =>  handleProjectChange(filter)}
                                    value={selectedProject}
                                    placeholder="Chọn dự án"
                                    displayField="name"
                                    emptyMessage="Không có dự án"
                                    // isLoading={isLoading}
                                />
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
                                                {selectedProject.date_start &&
                                                    new Date(
                                                        selectedProject.date_start
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                {!selectedProject.date_start &&
                                                    "Chưa có ngày bắt đầu"}
                                            </span>
                                            <span className="text-slate-500">
                                                →
                                            </span>
                                            <span className="font-semibold text-white">
                                                {selectedProject.date_end &&
                                                    new Date(
                                                        selectedProject.date_end
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                {!selectedProject.date_end &&
                                                    "Chưa có ngày kết thúc"}
                                            </span>
                                        </div>
                                        {selectedProject.projectStatus === "expired" && (
                                            <div className="mt-2 text-red-400 text-xs font-medium">
                                                ⚠️ Dự án đã kết thúc
                                            </div>
                                        )}

                                        {selectedProject.projectStatus === "upcoming" && (
                                            <div className="mt-2 text-yellow-400 text-xs font-medium">
                                                ⏳ Dự án chưa bắt đầu
                                            </div>
                                        )}

                                        {selectedProject.projectStatus === "active" && (
                                            <div className="mt-2 text-green-400 text-xs font-medium">
                                                ✅ Dự án đang hoạt động
                                            </div>
                                        )}
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
                                            process: 0
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
                                <div
                                    ref={setErrorRef("date_start")}
                                >
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Ngày bắt đầu{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div 
                                        className="relative"
                                        onClick={() => openPicker("date_start")}
                                    >
                                        <Calendar
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 mr-5"
                                            size={16}
                                        />
                                        <input
                                            ref={(el) => {
                                                inputRefs.current["date_start"] = el;
                                            }}
                                            type="date"
                                            value={assignForm.date_start}
                                            min={selectedProject?.date_start || undefined}
                                            max={selectedProject?.date_end || undefined}
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

                                <div
                                    ref={setErrorRef("date_end")}
                                >
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Ngày kết thúc{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <div 
                                        className="relative"
                                        onClick={() => openPicker("date_end")}
                                    >
                                        <Calendar
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            size={16}
                                        />
                                        <input
                                            ref={(el) => {
                                                inputRefs.current["date_end"] = el;
                                            }}
                                            type="date"
                                            value={assignForm.date_end}
                                            min={selectedProject?.date_start || undefined}
                                            max={selectedProject?.date_end || undefined}
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

                                <div
                                    ref={setErrorRef("value")}
                                >
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                                        Mục tiêu cần đạt ({unit})
                                        <span className="text-red-400"> *</span>
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={unit === "%" ? 100 : formatNumber(assignForm.process)}
                                        onChange={handleProcessChange}
                                        disabled={unit === "%"}
                                        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3
                                            bg-slate-900 border rounded-lg
                                            text-sm sm:text-base text-white
                                            focus:outline-none
                                            ${
                                                errors.value
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-slate-700 focus:border-blue-500"
                                            }
                                            ${unit === "%" ? "opacity-60 cursor-not-allowed" : ""}
                                            transition`}
                                    />
                                    {errors.value && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.value}
                                        </p>
                                    )}

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
                            </div>
                            {errors.reject && (
                                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.reject}
                                </p>
                            )}
                        </div>

                        <div 
                            ref={setErrorRef("employees")}
                            className="pt-4 sm:pt-6 border-t border-slate-800"
                        >
                            <TaskTargetSelector
                                enabledTargets={["employee", "department"]}
                                employees={listEmployee}
                                departments={listDepartment}
                                selectedTargetType={assignForm.target_type}
                                selectedValues={assignForm.employees}
                                onTargetTypeChange={(type) => {
                                    setAssignForm({
                                        ...assignForm,
                                        target_type: type,
                                        employees: type === 3 ? [] : "",
                                    });
                                }}
                                onSelectionChange={(values) => {
                                    setAssignForm({
                                        ...assignForm,
                                        employees: values,
                                    });
                                }}
                                onFilterChangeUser={(filters) => {
                                    const token = localStorage.getItem("userToken");
                                    
                                    dispatch(
                                        getListEmployee({
                                            position_id: filters.position,
                                            department_id: filters.department,
                                            filter: filters.search || null,
                                            token
                                        }) as any
                                    );
                                }}
                                onFilterChangeDepartment={(filters) => {
                                    dispatch(getListDepartment({filter: filters.search}) as any);
                                }}
                                onFilterChangeLevel={(filters) => {
                                    dispatch(getListDepartment({filter: filters.search}) as any);
                                }}
                                error={errors.employees}
                                onErrorClear={() =>
                                    setErrors((prev) => ({
                                        ...prev,
                                        employees: undefined,
                                    }))
                                }
                                showSelectAll={true}
                                showFilters={true}
                                maxHeight="24rem"
                            />
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
                        <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Target
                                    className="text-blue-400 flex-shrink-0 mt-1"
                                    size={20}
                                />
                                <div className="flex-1 space-y-2">
                                    <h4 className="text-sm font-semibold text-blue-400">
                                        Tóm tắt giao việc
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300 space-y-1">

                                        <p>
                                            <span className="text-slate-400">Tên nhiệm vụ:</span>{" "}
                                            <span className="font-semibold text-white">
                                                {assignForm.name || "..."}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Dự án:</span>{" "}
                                            <span className="font-semibold text-white">
                                                {selectedProject?.name || "Chưa chọn"}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Thời gian:</span>{" "}
                                            {assignForm.date_start && assignForm.date_end ? (
                                                <span className="font-semibold text-white">
                                                    {new Date(assignForm.date_start).toLocaleDateString("vi-VN")}
                                                    {" → "}
                                                    {new Date(assignForm.date_end).toLocaleDateString("vi-VN")}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">Chưa đầy đủ</span>
                                            )}
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Loại nhiệm vụ:</span>{" "}
                                            <span className="text-white">
                                                {typeTask?.find((t: any) => Number(t.id) === Number(assignForm.type_task))?.name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Độ ưu tiên:</span>{" "}
                                            <span className="text-white">
                                                {priorityTask?.find((p: any) => Number(p.id) === Number(assignForm.task_priority))?.name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">KPI:</span>{" "}
                                            <span className="text-white">
                                                {childKpi?.find((k: any) => Number(k.id) === assignForm.kpi_item_id)?.name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Mục tiêu:</span>{" "}
                                            <span className="font-semibold text-white">
                                                {formatNumber(assignForm.process)} {unit}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Đối tượng giao:</span>{" "}
                                            <span className="font-semibold text-white">
                                                {getSelectedCount()} {getTargetLabel()}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Số lần vi phạm:</span>{" "}
                                            <span className="text-white">
                                                {assignForm.min_reject} → {assignForm.max_reject}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="text-slate-400">Trạng thái:</span>{" "}
                                            <span className="text-white">
                                                {statusTask?.find((s: any) => Number(s.id) === Number(assignForm.task_status))?.name}
                                            </span>
                                        </p>

                                    </div>
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