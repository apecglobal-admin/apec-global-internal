import { useState } from 'react';
import { Calendar, CheckCircle2, Users, ArrowLeft, Send, Briefcase, Target, FileText, AlertCircle } from "lucide-react";

// Types
interface Department {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface Position {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department_id: number;
  position_id: number;
  manager_id: number | null;
  status: string;
  join_date: string;
  role: number;
  created_at: Date;
  updated_at: Date;
}

interface JobTaskCategory {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface KpiItem {
  id: number;
  kpi_id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

interface AssignFormData {
  title: string;
  description: string;
  job_task_category_id: number;
  kpi_item_id: number;
  due_date: string;
  assignee_ids: number[];
}

interface ValidationErrors {
  title?: string;
  due_date?: string;
  assignee_ids?: string;
}

interface NewTask {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee_id: number;
  job_task_category_id: number;
  kpi_item_id: number;
  due_date: string;
  completed_at: null;
  created_at: Date;
  updated_at: Date;
}

interface AssignTaskProps {
  onBack: () => void;
  onAssignSuccess?: (tasks: NewTask[]) => void;
}

// Fake Data
const fakeDepartments: Department[] = [
  { id: 1, name: "Phòng Kỹ Thuật", description: "Bộ phận phát triển", created_at: new Date(), updated_at: new Date() },
  { id: 2, name: "Phòng Kinh Doanh", description: "Bộ phận bán hàng", created_at: new Date(), updated_at: new Date() },
];

const fakePositions: Position[] = [
  { id: 1, name: "Giám Đốc", description: "Quản lý cấp cao", created_at: new Date(), updated_at: new Date() },
  { id: 2, name: "Trưởng Phòng", description: "Quản lý phòng ban", created_at: new Date(), updated_at: new Date() },
  { id: 3, name: "Nhân Viên", description: "Nhân viên thực hiện", created_at: new Date(), updated_at: new Date() },
];

const fakeEmployees: Employee[] = [
  {
    id: 1,
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@company.com",
    phone: "0901234567",
    department_id: 1,
    position_id: 2,
    manager_id: null,
    status: "active",
    join_date: "2020-01-01",
    role: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    full_name: "Trần Thị B",
    email: "tranthib@company.com",
    phone: "0902234567",
    department_id: 1,
    position_id: 3,
    manager_id: 1,
    status: "active",
    join_date: "2021-03-01",
    role: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    full_name: "Lê Văn C",
    email: "levanc@company.com",
    phone: "0903234567",
    department_id: 1,
    position_id: 3,
    manager_id: 1,
    status: "active",
    join_date: "2021-03-01",
    role: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    full_name: "Phạm Thị D",
    email: "phamthid@company.com",
    phone: "0904234567",
    department_id: 2,
    position_id: 3,
    manager_id: 1,
    status: "active",
    join_date: "2021-05-01",
    role: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    full_name: "Hoàng Văn E",
    email: "hoangvane@company.com",
    phone: "0905234567",
    department_id: 1,
    position_id: 3,
    manager_id: 1,
    status: "active",
    join_date: "2022-01-01",
    role: 3,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const fakeJobTaskCategories: JobTaskCategory[] = [
  { id: 1, name: "Phát triển", description: "Các task phát triển phần mềm", created_at: new Date(), updated_at: new Date() },
  { id: 2, name: "Thiết kế", description: "Các task thiết kế UI/UX", created_at: new Date(), updated_at: new Date() },
  { id: 3, name: "Testing", description: "Các task kiểm thử", created_at: new Date(), updated_at: new Date() },
];

const fakeKpiItems: KpiItem[] = [
  { id: 1, kpi_id: 1, name: "Hoàn thành đúng hạn", description: "Số lượng task hoàn thành đúng deadline", created_at: new Date(), updated_at: new Date() },
  { id: 2, kpi_id: 1, name: "Chất lượng công việc", description: "Đánh giá chất lượng output", created_at: new Date(), updated_at: new Date() },
];

function AssignTask({ onBack, onAssignSuccess }: AssignTaskProps) {
  const [currentUser] = useState<Employee>(fakeEmployees[0]);
  const [assignForm, setAssignForm] = useState<AssignFormData>({
    title: "",
    description: "",
    job_task_category_id: 1,
    kpi_item_id: 1,
    due_date: "",
    assignee_ids: [],
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const availableEmployees = fakeEmployees.filter((emp) => emp.id !== currentUser.id);

  const toggleEmployeeSelection = (employeeId: number) => {
    setAssignForm((prev) => {
      const isSelected = prev.assignee_ids.includes(employeeId);
      return {
        ...prev,
        assignee_ids: isSelected
          ? prev.assignee_ids.filter((id) => id !== employeeId)
          : [...prev.assignee_ids, employeeId],
      };
    });
    if (errors.assignee_ids) {
      setErrors((prev) => ({ ...prev, assignee_ids: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!assignForm.title.trim()) {
      newErrors.title = "Vui lòng nhập tên nhiệm vụ";
    }
    if (!assignForm.due_date) {
      newErrors.due_date = "Vui lòng chọn hạn chót";
    }
    if (assignForm.assignee_ids.length === 0) {
      newErrors.assignee_ids = "Vui lòng chọn ít nhất 1 nhân viên";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAssignTask = () => {
    if (!validateForm()) {
      return;
    }

    const newTasks: NewTask[] = assignForm.assignee_ids.map((assigneeId) => ({
      id: Date.now() + Math.random(),
      title: assignForm.title,
      description: assignForm.description,
      status: "pending",
      assignee_id: assigneeId,
      job_task_category_id: assignForm.job_task_category_id,
      kpi_item_id: assignForm.kpi_item_id,
      due_date: assignForm.due_date,
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (onAssignSuccess) {
      onAssignSuccess(newTasks);
    }

    setAssignForm({
      title: "",
      description: "",
      job_task_category_id: 1,
      kpi_item_id: 1,
      due_date: "",
      assignee_ids: [],
    });
    setErrors({});
  };

  const getDepartmentName = (deptId: number): string => {
    const dept = fakeDepartments.find((d) => d.id === deptId);
    return dept ? dept.name : "";
  };

  const getPositionName = (posId: number): string => {
    const pos = fakePositions.find((p) => p.id === posId);
    return pos ? pos.name : "";
  };

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 sm:mb-6"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-medium">Quay lại danh sách</span>
        </button>

        {/* Main Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
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

          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Task Information Section */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-400 sm:w-5 sm:h-5" />
                <span>Thông tin nhiệm vụ</span>
              </h3>

              {/* Task Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Tên nhiệm vụ <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={assignForm.title}
                  onChange={(e) => {
                    setAssignForm({ ...assignForm, title: e.target.value });
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="Ví dụ: Phát triển tính năng đăng nhập..."
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none transition ${
                    errors.title
                      ? "border-red-500 focus:border-red-500"
                      : "border-slate-700 focus:border-blue-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={assignForm.description}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về nhiệm vụ, yêu cầu cần thực hiện..."
                  rows={3}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Category and KPI - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                    Danh mục công việc
                  </label>
                  <select
                    value={assignForm.job_task_category_id}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        job_task_category_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {fakeJobTaskCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                        kpi_item_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    {fakeKpiItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                  Hạn chót <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={16}
                  />
                  <input
                    type="date"
                    value={assignForm.due_date}
                    onChange={(e) => {
                      setAssignForm({ ...assignForm, due_date: e.target.value });
                      if (errors.due_date) {
                        setErrors((prev) => ({ ...prev, due_date: undefined }));
                      }
                    }}
                    className={`w-full pl-10 sm:pl-11 pr-3 py-2.5 sm:pr-4 sm:py-3 bg-slate-900 border rounded-lg text-sm sm:text-base text-white focus:outline-none transition ${
                      errors.due_date
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-700 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.due_date && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.due_date}
                  </p>
                )}
              </div>
            </div>

            {/* Employee Selection Section */}
            <div className="pt-4 sm:pt-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-blue-400 sm:w-5 sm:h-5" />
                  <span>Chọn nhân viên</span>
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/30 w-fit">
                  Đã chọn: {assignForm.assignee_ids.length}
                </span>
              </div>

              {errors.assignee_ids && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                    {errors.assignee_ids}
                  </p>
                </div>
              )}

              {/* Employee List */}
              <div className="space-y-2 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
                {availableEmployees.map((employee) => {
                  const isSelected = assignForm.assignee_ids.includes(employee.id);
                  const department = getDepartmentName(employee.department_id);
                  const position = getPositionName(employee.position_id);

                  return (
                    <div
                      key={employee.id}
                      onClick={() => toggleEmployeeSelection(employee.id)}
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                          : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={14} className="text-white sm:w-4 sm:h-4" />}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                        {employee.full_name.charAt(0)}
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                          <span className="text-sm sm:text-base font-semibold text-white truncate">
                            {employee.full_name}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 sm:px-2 rounded bg-slate-800 text-slate-400 flex-shrink-0">
                            {position}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Briefcase size={11} className="sm:w-3 sm:h-3" />
                            <span className="truncate">{department}</span>
                          </span>
                          <span className="truncate sm:max-w-[200px]">{employee.email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-slate-800">
              <button
                onClick={onBack}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm sm:text-base font-semibold rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignTask}
                className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition shadow-lg shadow-blue-500/30"
              >
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Giao nhiệm vụ ({assignForm.assignee_ids.length})</span>
              </button>
            </div>
          </div>

          {/* Summary Section */}
          {assignForm.assignee_ids.length > 0 && (
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
                      "{assignForm.title || "..."}"
                    </span>{" "}
                    cho{" "}
                    <span className="font-semibold text-white">
                      {assignForm.assignee_ids.length}
                    </span>{" "}
                    nhân viên.
                    {assignForm.due_date && (
                      <span>
                        {" "}
                        Hạn chót:{" "}
                        <span className="font-semibold text-white">
                          {new Date(assignForm.due_date).toLocaleDateString("vi-VN")}
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