import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Users, ArrowLeft, Send, Briefcase, Target, FileText, AlertCircle, Building, UserCheck } from "lucide-react";
import {     
  createTask,
  getTypeTask,
  getPriorityTask,
  getListProject,
  getChildKpi,
  getListEmployee,
  getStatusTask, 
  getListDepartment,
  getListPosition
} from "@/src/features/task/api";
import { useDispatch } from 'react-redux';
import { useTaskData } from '@/src/hooks/taskhook';
import { toast } from 'react-toastify';
import { useProfileData } from '@/src/hooks/profileHook';

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
}

interface ValidationErrors {
  name?: string;
  date_start?: string;
  date_end?: string;
  employees?: string;
  project_id?: string;
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
    listPosition
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
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(!statusTask){
      dispatch(getStatusTask() as any);
    }
    dispatch(getTypeTask() as any);
    dispatch(getPriorityTask() as any);
    dispatch(getListProject() as any);
    dispatch(getChildKpi() as any);
    dispatch(getListEmployee() as any);
    dispatch(getListPosition() as any);
    dispatch(getListDepartment() as any);
  }, [dispatch]);

  useEffect(() => {
    if (listProject && listProject.length > 0 && assignForm.project_id === 0) {
      setAssignForm(prev => ({ ...prev, project_id: listProject[0].id }));
    }
  }, [listProject]);

  useEffect(() => {
    if (childKpi && childKpi.length > 0 && assignForm.kpi_item_id === 0) {
      setAssignForm(prev => ({ ...prev, kpi_item_id: parseInt(childKpi[0].id) }));
    }
  }, [childKpi]);

  const toggleEmployeeSelection = (employeeId: number) => {
    if (assignForm.target_type !== 3) return;
    
    setAssignForm((prev) => {
      const currentEmployees = Array.isArray(prev.employees) ? prev.employees : [];
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
    
    if (assignForm.date_start && assignForm.date_end && assignForm.date_start > assignForm.date_end) {
      newErrors.date_end = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    
    if (!assignForm.project_id) {
      newErrors.project_id = "Vui lòng chọn dự án";
    }
    
    if (assignForm.target_type === 3) {
      if (!Array.isArray(assignForm.employees) || assignForm.employees.length === 0) {
        newErrors.employees = "Vui lòng chọn ít nhất 1 nhân viên";
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
      // Tạo object với 3 trường riêng biệt
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
        token
      };

      // Gán giá trị dựa trên target_type
      if (assignForm.target_type === 3) {
        // Nhân viên - array
        taskData.employees = assignForm.employees;
      } else if (assignForm.target_type === 2) {
        // Vị trí - single ID
        taskData.position_id = assignForm.employees;
      } else if (assignForm.target_type === 1) {
        // Phòng ban - single ID
        taskData.department_id = assignForm.employees;
      }

      
      const result = await dispatch(createTask(taskData) as any);
      

      if(result.payload.data.success){
        toast.success("Giao nhiệm vụ thành công!");
        setAssignForm({
          name: "",
          type_task: 1,
          date_start: "",
          date_end: "",
          task_priority: 1,
          project_id: listProject?.[0]?.id || 0,
          kpi_item_id: childKpi?.[0]?.id ? parseInt(childKpi[0].id) : 0,
          target_type: 3,
          process: 0,
          task_status: 1,
          employees: [],
        });
        setErrors({});
        
        onBack();
        // setShowAssignTask(false);
      }else{
        toast.error(result.payload.data.message);
  
      }


      
    } catch (error) {
      console.error("Error creating task:", error);
      setErrors({ name: "Có lỗi xảy ra khi tạo nhiệm vụ. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedCount = () => {
    if (assignForm.target_type === 3 && Array.isArray(assignForm.employees)) {
      return assignForm.employees.length;
    }
    if ((assignForm.target_type === 1 || assignForm.target_type === 2) && assignForm.employees) {
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
          <span className="text-sm sm:text-base font-medium">Quay lại danh sách</span>
        </button>

        <div className="bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Giao Nhiệm Vụ Mới</h2>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm">
              Tạo và phân công nhiệm vụ cho nhân viên
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-400 sm:w-5 sm:h-5" />
                <span>Thông tin nhiệm vụ</span>
              </h3>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Tên nhiệm vụ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={assignForm.name}
                  onChange={(e) => {
                    setAssignForm({ ...assignForm, name: e.target.value });
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }
                  }}
                  placeholder="Ví dụ: Xây dựng API login..."
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-blue-500"
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
                    onChange={(e) => setAssignForm({ ...assignForm, type_task: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {typeTask?.map((type: any) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Độ ưu tiên
                  </label>
                  <select
                    value={assignForm.task_priority}
                    onChange={(e) => setAssignForm({ ...assignForm, task_priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {priorityTask?.map((priority: any) => (
                      <option key={priority.id} value={priority.id}>{priority.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Dự án <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={assignForm.project_id}
                    onChange={(e) => {
                      setAssignForm({ ...assignForm, project_id: parseInt(e.target.value) });
                      if (errors.project_id) {
                        setErrors((prev) => ({ ...prev, project_id: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                      errors.project_id ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-blue-500"
                    }`}
                  >
                    <option value={0}>-- Chọn dự án --</option>
                    {listProject?.map((project: any) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  {errors.project_id && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.project_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Chỉ tiêu KPI
                  </label>
                  <select
                    value={assignForm.kpi_item_id}
                    onChange={(e) => setAssignForm({ ...assignForm, kpi_item_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {childKpi?.map((item: any) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Ngày bắt đầu <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="date"
                      value={assignForm.date_start}
                      onChange={(e) => {
                        setAssignForm({ ...assignForm, date_start: e.target.value });
                        if (errors.date_start) {
                          setErrors((prev) => ({ ...prev, date_start: undefined }));
                        }
                      }}
                      className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:pr-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                        errors.date_start ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-blue-500"
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
                    Ngày kết thúc <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="date"
                      value={assignForm.date_end}
                      onChange={(e) => {
                        setAssignForm({ ...assignForm, date_end: e.target.value });
                        if (errors.date_end) {
                          setErrors((prev) => ({ ...prev, date_end: undefined }));
                        }
                      }}
                      className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:pr-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                        errors.date_end ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-blue-500"
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
                    onChange={(e) => setAssignForm({ ...assignForm, task_status: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {statusTask?.map((status: any) => (
                      <option key={status.id} value={status.id}>{status.name}</option>
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
                    onChange={(e) => setAssignForm({ ...assignForm, process: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Users size={18} className="text-blue-400 sm:w-5 sm:h-5" />
                <span>Đối tượng nhận nhiệm vụ</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setAssignForm({ ...assignForm, target_type: 3, employees: [] })}
                  className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    assignForm.target_type === 3 ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <UserCheck size={24} className={assignForm.target_type === 3 ? "text-blue-400" : "text-slate-400"} />
                  <span className={`text-sm font-semibold ${assignForm.target_type === 3 ? "text-white" : "text-slate-400"}`}>
                    Nhân viên
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAssignForm({ ...assignForm, target_type: 2, employees: "" })}
                  className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    assignForm.target_type === 2 ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <Briefcase size={24} className={assignForm.target_type === 2 ? "text-blue-400" : "text-slate-400"} />
                  <span className={`text-sm font-semibold ${assignForm.target_type === 2 ? "text-white" : "text-slate-400"}`}>
                    Vị trí
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAssignForm({ ...assignForm, target_type: 1, employees: "" })}
                  className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    assignForm.target_type === 1 ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <Building size={24} className={assignForm.target_type === 1 ? "text-blue-400" : "text-slate-400"} />
                  <span className={`text-sm font-semibold ${assignForm.target_type === 1 ? "text-white" : "text-slate-400"}`}>
                    Phòng ban
                  </span>
                </button>
              </div>

              {errors.employees && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                    {errors.employees}
                  </p>
                </div>
              )}

              {assignForm.target_type === 3 && (
                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                  {listEmployee?.map((employee: any) => {
                    const isSelected = Array.isArray(assignForm.employees) && assignForm.employees.includes(employee.id);
                    return (
                      <div
                        key={employee.id}
                        onClick={() => toggleEmployeeSelection(employee.id)}
                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                        }`}>
                          {isSelected && <CheckCircle2 size={14} className="text-white sm:w-4 sm:h-4" />}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                          {employee.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold text-white truncate block">{employee.name}</span>
                          <span className="text-xs text-slate-400">ID: {employee.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {assignForm.target_type === 2 && (
                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                  {listPosition?.map((position: any) => {
                    const isSelected = assignForm.employees === position.id;
                    return (
                      <div
                        key={position.id}
                        onClick={() => selectPosition(position.id)}
                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold text-white truncate block">{position.title}</span>
                          <span className="text-xs text-slate-400">Vị trí ID: {position.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {assignForm.target_type === 1 && (
                <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                  {listDepartment?.map((department: any) => {
                    const isSelected = assignForm.employees === department.id;
                    return (
                      <div
                        key={department.id}
                        onClick={() => selectDepartment(department.id)}
                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20" : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                          <Building className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm sm:text-base font-semibold text-white truncate block">{department.name}</span>
                          <span className="text-xs text-slate-400">Phòng ban ID: {department.id}</span>
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
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>{isSubmitting ? "Đang tạo..." : `Giao nhiệm vụ (${getSelectedCount()})`}</span>
              </button>
            </div>
          </div>

          {getSelectedCount() > 0 && (
            <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Target className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
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
                        <span className="font-semibold text-white">
                          {getSelectedCount()}
                        </span>{" "}
                        nhân viên
                      </>
                    )}
                    {assignForm.target_type === 2 && (
                      <span className="font-semibold text-white">1 vị trí</span>
                    )}
                    {assignForm.target_type === 1 && (
                      <span className="font-semibold text-white">1 phòng ban</span>
                    )}
                    .
                    {assignForm.date_start && assignForm.date_end && (
                      <span>
                        {" "}
                        Thời gian:{" "}
                        <span className="font-semibold text-white">
                          {new Date(assignForm.date_start).toLocaleDateString("vi-VN")}
                        </span>
                        {" → "}
                        <span className="font-semibold text-white">
                          {new Date(assignForm.date_end).toLocaleDateString("vi-VN")}
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