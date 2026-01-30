"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { ArrowLeft, FileText, Building, UserCheck } from "lucide-react";
import TaskTargetSelector from "@/components/TaskTargetSelector";
import { useDispatch } from "react-redux";
import { getListEmployee } from "@/src/features/task/api";

interface CreateSupportTaskFormProps {
	supportTaskTypes: any[];
	listEmployee: any[];
	listDepartment: any[];
	onCancel: () => void;
	onSubmit: (formData: SupportTaskFormData) => Promise<void>;
}

export interface SupportTaskFormData {
	name: string;
	description: string;
	type_id: string;
	target_department_id: string;
	assigneeType: "employees" | "departments";
	selectedEmployees: number[];
	selectedDepartments: number[];
}

// Map assigneeType to target type id for TaskTargetSelector
const TARGET_TYPE_MAP = {
	employees: 3, // employee type
	departments: 1, // department type
};

function CreateSupportTaskForm({
	supportTaskTypes,
	listEmployee,
	listDepartment,
	onCancel,
	onSubmit,
}: CreateSupportTaskFormProps) {
	const dispatch = useDispatch();
	const [formData, setFormData] = useState<SupportTaskFormData>({
		name: "",
		description: "",
		type_id: "",
		target_department_id: "",
		assigneeType: "employees",
		selectedEmployees: [],
		selectedDepartments: [],
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedType = supportTaskTypes?.find(
		(t: any) => t.id === parseInt(formData.type_id),
	);
	const requiresTargetDept = selectedType?.id === 1;

	// Get current target type id based on assigneeType
	const selectedTargetType = TARGET_TYPE_MAP[formData.assigneeType];

	// Get current selected values based on assigneeType
	const selectedValues =
		formData.assigneeType === "employees"
			? formData.selectedEmployees
			: formData.selectedDepartments;

	const handleTargetTypeChange = (targetTypeId: number) => {
		if (targetTypeId === 3) {
			setFormData((prev) => ({
				...prev,
				assigneeType: "employees",
				selectedDepartments: [],
			}));
		} else if (targetTypeId === 1) {
			setFormData((prev) => ({
				...prev,
				assigneeType: "departments",
				selectedEmployees: [],
			}));
		}
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



	const handleSelectionChange = (values: number[] | number | string) => {
		if (formData.assigneeType === "employees") {
			setFormData((prev) => ({
				...prev,
				selectedEmployees: Array.isArray(values) ? values : [],
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				selectedDepartments: Array.isArray(values) ? values : [],
			}));
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await onSubmit(formData);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid = () => {
		if (!formData.name || !formData.description || !formData.type_id) {
			return false;
		}

		if (requiresTargetDept && !formData.target_department_id) {
			return false;
		}

		if (
			formData.assigneeType === "employees" &&
			formData.selectedEmployees.length === 0
		) {
			return false;
		}

		if (
			formData.assigneeType === "departments" &&
			formData.selectedDepartments.length === 0
		) {
			return false;
		}

		return true;
	};

	// Transform employees for TaskTargetSelector
	const transformedEmployees = listEmployee?.map((emp: any) => ({
		id: emp.id,
		name: emp.name || emp.full_name || `Nhân viên ${emp.id}`,
		email: emp.email,
		phone: emp.phone,
		department: emp.department,
		position: emp.position,
	}));

	// Transform departments for TaskTargetSelector
	const transformedDepartments = listDepartment?.map((dept: any) => ({
		id: dept.id,
		name: dept.name,
	}));

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Title */}
				<div className="text-center pb-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    </div>
					<h1 className="text-2xl font-bold text-white">
						Tạo yêu cầu hỗ trợ mới
					</h1>
				</div>

				{/* Form Content */}
				<div className="space-y-6">
					{/* Basic Info Section */}
					<div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
						<h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
							<FileText size={20} className="text-emerald-400" />
							Thông tin cơ bản
						</h2>

						<div className="space-y-4">
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="text-sm font-semibold text-slate-300"
								>
									Tên yêu cầu <span className="text-red-400">*</span>
								</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Nhập tên yêu cầu hỗ trợ"
									disabled={isSubmitting}
									className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 "
								/>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="description"
									className="text-sm font-semibold text-slate-300"
								>
									Mô tả <span className="text-red-400">*</span>
								</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder="Mô tả chi tiết yêu cầu hỗ trợ"
									rows={4}
									disabled={isSubmitting}
									className="bg-slate-900 border-slate-700 text-white placeholder-slate-500  resize-none"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label
										htmlFor="type"
										className="text-sm font-semibold text-slate-300"
									>
										Loại yêu cầu <span className="text-red-400">*</span>
									</Label>
									<Select
										value={formData.type_id}
										onValueChange={(value) =>
											setFormData({ ...formData, type_id: value })
										}
										disabled={isSubmitting}
									>
										<SelectTrigger className="bg-slate-900 border-slate-700 text-white ">
											<SelectValue placeholder="Chọn loại yêu cầu" />
										</SelectTrigger>
										<SelectContent className="bg-slate-900 border-slate-700">
											{supportTaskTypes?.map((type: any) => (
												<SelectItem
													key={type.id}
													value={type.id.toString()}
													className="text-white hover:bg-slate-800 focus:bg-slate-800"
												>
													{type.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label
										htmlFor="target_dept"
										className="text-sm font-semibold text-slate-300"
									>
										Phòng ban cần hỗ trợ{" "}
										{requiresTargetDept && (
											<span className="text-red-400">*</span>
										)}
									</Label>
									<Select
										value={formData.target_department_id}
										onValueChange={(value) =>
											setFormData({ ...formData, target_department_id: value })
										}
										disabled={isSubmitting}
									>
										<SelectTrigger className="bg-slate-900 border-slate-700 text-white ">
											<SelectValue placeholder="Chọn phòng ban" />
										</SelectTrigger>
										<SelectContent className="bg-slate-900 border-slate-700">
											{listDepartment?.map((dept: any) => (
												<SelectItem
													key={dept.id}
													value={dept.id.toString()}
													className="text-white hover:bg-slate-800 focus:bg-slate-800"
												>
													{dept.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{requiresTargetDept && (
										<p className="text-xs text-red-500">
											Bắt buộc phải chọn phòng ban với loại yêu cầu này
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Assignment Section using TaskTargetSelector */}
					<div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
						<TaskTargetSelector
							enabledTargets={["employee", "department"]}
							employees={transformedEmployees || []}
							departments={transformedDepartments || []}
							positions={[]}
							levels={[]}
							selectedTargetType={selectedTargetType}
							selectedValues={selectedValues}
							onTargetTypeChange={handleTargetTypeChange}
							onSelectionChange={handleSelectionChange}
							onFilterChange={handleFilterChange}
							showSelectAll={true}
							showFilters={true}
							maxHeight="20rem"
							placeholder="Chọn đối tượng nhận yêu cầu..."
							allowMultipleDepartments={true}
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end gap-3 pt-2">
						<Button
							variant="outline"
							onClick={onCancel}
							disabled={isSubmitting}
							className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
						>
							Hủy
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={!isFormValid() || isSubmitting}
							className="bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							{isSubmitting ? "Đang tạo..." : "Tạo yêu cầu"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CreateSupportTaskForm;
