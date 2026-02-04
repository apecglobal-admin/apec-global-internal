'use client';

import React from "react"

import { useState, useEffect, useRef } from "react";
import {
    Users,
    CheckCircle2,
    Search,
    Filter,
    X,
    UserCheck,
    Briefcase,
    Building,
    AlertCircle,
    Award,
} from "lucide-react";

interface TargetOption {
    id: number;
    type: "employee" | "position" | "department" | "level" | "custom";
    label: string;
    icon: React.ComponentType<any>;
    color: string;
}

interface Employee {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    department?: { name: string };
    position?: { name: string };
}

interface Item {
    id: number;
    name?: string;
    title?: string;
}

interface TaskTargetSelectorProps {
    enabledTargets?: ("employee" | "position" | "department" | "level")[];
    customTargets?: TargetOption[];
    employees?: Employee[];
    positions?: Item[];
    departments?: Item[];
    levels?: Item[];
    customData?: { [key: string]: Item[] };
    selectedTargetType: number;
    selectedValues: number[] | number | string;
    onTargetTypeChange: (type: number) => void;
    onSelectionChange: (values: number[] | number | string) => void;
    onFilterChangeUser?: (filters: {
        search?: string;
        position?: number | null;
        department?: number | null;
    }) => void;
    onFilterChangeDepartment?: (filters: {
        search?: string;
    }) => void;
    onFilterChangeLevel?: (filters: {
        search?: string;
    }) => void;
    error?: string;
    onErrorClear?: () => void;
    showSelectAll?: boolean;
    showFilters?: boolean;
    maxHeight?: string;
    placeholder?: string;
    allowMultiplePositions?: boolean;
    allowMultipleDepartments?: boolean;
    allowMultipleLevels?: boolean;
}

const defaultTargetOptions: TargetOption[] = [
    {
        id: 3,
        type: "employee",
        label: "Nhân viên",
        icon: UserCheck,
        color: "blue",
    },
    {
        id: 2,
        type: "position",
        label: "Vị trí",
        icon: Briefcase,
        color: "purple",
    },
    {
        id: 1,
        type: "department",
        label: "Phòng ban",
        icon: Building,
        color: "green",
    },
    {
        id: 4,
        type: "level",
        label: "Cấp bậc",
        icon: Award,
        color: "orange",
    },
];

function TaskTargetSelector({
    enabledTargets = ["employee", "position", "department", "level"],
    customTargets = [],
    employees = [],
    positions = [],
    departments = [],
    levels = [],
    customData = {},
    selectedTargetType,
    selectedValues,
    onTargetTypeChange,
    onSelectionChange,
    onFilterChangeUser,
    onFilterChangeDepartment,
    onFilterChangeLevel,
    error,
    onErrorClear,
    showSelectAll = true,
    showFilters = true,
    maxHeight = "24rem",
    placeholder = "Chọn đối tượng...",
    allowMultiplePositions = false,
    allowMultipleDepartments = false,
    allowMultipleLevels = false,
}: TaskTargetSelectorProps) {
    const [searchText, setSearchText] = useState("");
    const [filterPosition, setFilterPosition] = useState<number | null>(null);
    const [filterDepartment, setFilterDepartment] = useState<number | null>(null);
    const [selectAllEmployees, setSelectAllEmployees] = useState(false);

    const [searchPosition, setSearchPosition] = useState("");
    const [searchDepartment, setSearchDepartment] = useState("");
    const [searchLevel, setSearchLevel] = useState("");
    
    const prevSelectAllRef = useRef(false);
    const isUpdatingRef = useRef(false);

    const availableTargets = [
        ...defaultTargetOptions.filter((opt) =>
            enabledTargets.includes(opt.type as any)
        ),
        ...customTargets,
    ];

    const currentTarget = availableTargets.find(
        (t) => t.id === selectedTargetType
    );

    const isMultipleAllowed = () => {
        if (currentTarget?.type === "employee") return true;
        if (currentTarget?.type === "position") return allowMultiplePositions;
        if (currentTarget?.type === "department") return allowMultipleDepartments;
        if (currentTarget?.type === "level") return allowMultipleLevels;
        return false;
    };

    // Filter cho Employee (giữ nguyên)
    useEffect(() => {
        if (
            currentTarget?.type === "employee" &&
            onFilterChangeUser &&
            !selectAllEmployees
        ) {
            const timer = setTimeout(() => {
                onFilterChangeUser({
                    search: searchText || undefined,
                    position: filterPosition,
                    department: filterDepartment,
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchText, filterPosition, filterDepartment, currentTarget?.type, selectAllEmployees]);

    // Filter cho Department
    useEffect(() => {
        if (
            currentTarget?.type === "department" &&
            onFilterChangeDepartment
        ) {
            const timer = setTimeout(() => {
                onFilterChangeDepartment({
                    search: searchDepartment || undefined,
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchDepartment, currentTarget?.type]);

    // Filter cho Level
    useEffect(() => {
        if (
            currentTarget?.type === "level" &&
            onFilterChangeLevel
        ) {
            const timer = setTimeout(() => {
                onFilterChangeLevel({
                    search: searchLevel || undefined,
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [searchLevel, currentTarget?.type]);

    useEffect(() => {
        if (prevSelectAllRef.current === selectAllEmployees) {
            return;
        }
        
        if (isUpdatingRef.current) {
            return;
        }
        
        prevSelectAllRef.current = selectAllEmployees;
        
        if (
            selectAllEmployees &&
            currentTarget?.type === "employee" &&
            employees.length > 0
        ) {
            isUpdatingRef.current = true;
            const allIds = employees.map((emp) => emp.id);
            onSelectionChange(allIds);
            requestAnimationFrame(() => {
                isUpdatingRef.current = false;
            });
        } else if (!selectAllEmployees && currentTarget?.type === "employee") {
            isUpdatingRef.current = true;
            onSelectionChange([]);
            requestAnimationFrame(() => {
                isUpdatingRef.current = false;
            });
        }
    }, [selectAllEmployees, currentTarget?.type, employees.length, onSelectionChange]);

    const handleTargetTypeChange = (targetId: number) => {
        if (targetId !== selectedTargetType) {
            clearFilters();
            setSelectAllEmployees(false);
        }
        
        onTargetTypeChange(targetId);
        onErrorClear?.();
    };

    const toggleEmployeeSelection = (employeeId: number) => {
        if (selectAllEmployees) return;

        const current = Array.isArray(selectedValues) ? selectedValues : [];
        const isSelected = current.includes(employeeId);
        
        onSelectionChange(
            isSelected
                ? current.filter((id) => id !== employeeId)
                : [...current, employeeId]
        );
        
        onErrorClear?.();
    };

    const selectItem = (itemId: number) => {
        onSelectionChange(itemId);
        onErrorClear?.();
    };

    const toggleItemSelection = (itemId: number) => {
        const current = Array.isArray(selectedValues) ? selectedValues : [];
        const isSelected = current.includes(itemId);
        
        onSelectionChange(
            isSelected
                ? current.filter((id) => id !== itemId)
                : [...current, itemId]
        );
        
        onErrorClear?.();
    };

    const clearFilters = () => {
        setSearchText("");
        setFilterPosition(null);
        setFilterDepartment(null);
        setSearchPosition("");
        setSearchDepartment("");
        setSearchLevel("");
    };

    const getSelectedCount = () => {
        if (currentTarget?.type === "employee") {
            if (selectAllEmployees) return employees.length;
            return Array.isArray(selectedValues) ? selectedValues.length : 0;
        }
        
        if (isMultipleAllowed()) {
            return Array.isArray(selectedValues) ? selectedValues.length : 0;
        } else {
            return selectedValues ? 1 : 0;
        }
    };

    const getColorClasses = (color: string, isActive: boolean) => {
        const colors: Record<string, any> = {
            blue: {
                border: isActive ? "border-blue-500" : "border-slate-700",
                bg: isActive ? "bg-blue-500/10" : "bg-slate-900",
                text: isActive ? "text-blue-400" : "text-slate-400",
                textActive: "text-white",
                hover: "hover:border-slate-600",
            },
            purple: {
                border: isActive ? "border-purple-500" : "border-slate-700",
                bg: isActive ? "bg-purple-500/10" : "bg-slate-900",
                text: isActive ? "text-purple-400" : "text-slate-400",
                textActive: "text-white",
                hover: "hover:border-slate-600",
            },
            green: {
                border: isActive ? "border-green-500" : "border-slate-700",
                bg: isActive ? "bg-green-500/10" : "bg-slate-900",
                text: isActive ? "text-green-400" : "text-slate-400",
                textActive: "text-white",
                hover: "hover:border-slate-600",
            },
            orange: {
                border: isActive ? "border-orange-500" : "border-slate-700",
                bg: isActive ? "bg-orange-500/10" : "bg-slate-900",
                text: isActive ? "text-orange-400" : "text-slate-400",
                textActive: "text-white",
                hover: "hover:border-slate-600",
            },
        };
        return colors[color] || colors.blue;
    };

    const renderEmployeeList = () => (
        <>
            {showSelectAll && (
                <div className="mb-4 space-y-3">
                    <div 
                        onClick={() => setSelectAllEmployees(!selectAllEmployees)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all md:p-4 ${
                            selectAllEmployees
                                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                : "border-slate-700 bg-slate-900 hover:border-slate-600"
                        }`}
                    >
                        <label
                            htmlFor="selectAll"
                            className="text-xs md:text-sm font-semibold text-white cursor-pointer"
                        >
                            Chọn tất cả nhân viên ({employees.length})
                        </label>
                    </div>

                    {!selectAllEmployees && showFilters && (
                        <>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                    size={14}
                                />
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    placeholder="Tìm theo tên..."
                                    className="w-full pl-10 pr-3 py-2 md:py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 md:mb-2 flex items-center gap-1">
                                        <Filter size={12} />
                                        Vị trí
                                    </label>
                                    <select
                                        value={filterPosition || ""}
                                        onChange={(e) =>
                                            setFilterPosition(
                                                e.target.value ? parseInt(e.target.value) : null
                                            )
                                        }
                                        className="w-full px-2.5 py-2 md:px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                    >
                                        <option value="">Tất cả</option>
                                        {positions.map((position) => (
                                            <option key={position.id} value={position.id}>
                                                {position.title || position.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 md:mb-2 flex items-center gap-1">
                                        <Filter size={12} />
                                        Phòng ban
                                    </label>
                                    <select
                                        value={filterDepartment || ""}
                                        onChange={(e) =>
                                            setFilterDepartment(
                                                e.target.value ? parseInt(e.target.value) : null
                                            )
                                        }
                                        className="w-full px-2.5 py-2 md:px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                    >
                                        <option value="">Tất cả</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name || department.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {(searchText || filterPosition || filterDepartment) && (
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
            )}

            {!selectAllEmployees && (
                <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight }}>
                    {employees.length > 0 ? (
                        employees.map((employee) => {
                            const isSelected =
                                Array.isArray(selectedValues) &&
                                selectedValues.includes(employee.id);
                            return (
                                <div
                                    key={employee.id}
                                    onClick={() => toggleEmployeeSelection(employee.id)}
                                    className={`p-2.5 md:p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                            : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                                    }`}
                                >
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="text-xs md:text-sm font-semibold text-white line-clamp-2">
                                                    {employee.name}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-blue-500 bg-blue-500 flex-shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 text-xs text-slate-400">
                                                {employee.department && (
                                                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                        {employee.department.name}
                                                    </span>
                                                )}
                                                {employee.position && employee.position?.name && (
                                                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                        {employee.position.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 md:py-8 text-slate-400">
                            <Users size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs md:text-sm">Không tìm thấy nhân viên</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    // THÊM MỚI: Render item list với search box
    const renderItemList = (
        items: Item[], 
        iconColor: string, 
        IconComponent: React.ComponentType<any>,
        searchValue: string,
        onSearchChange: (value: string) => void,
        placeholderText: string
    ) => {
        const multipleAllowed = isMultipleAllowed();
        
        return (
            <>
                {/* Search box */}
                {showFilters && (
                    <div className="mb-3 space-y-2">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                size={14}
                            />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={placeholderText}
                                className="w-full pl-10 pr-10 py-2 md:py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                            />
                            {searchValue && (
                                <button
                                    onClick={() => onSearchChange("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Item list */}
                <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight }}>
                    {items.length > 0 ? (
                        items.map((item) => {
                            const isSelected = multipleAllowed 
                                ? (Array.isArray(selectedValues) && selectedValues.includes(item.id))
                                : selectedValues === item.id;
                            const displayName = item.name || item.title || "Không rõ";
                            
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => multipleAllowed ? toggleItemSelection(item.id) : selectItem(item.id)}
                                    className={`p-2.5 md:p-3 rounded-lg border cursor-pointer transition-all ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                            : "border-slate-700 bg-slate-900 hover:border-slate-600 hover:bg-slate-800"
                                    }`}
                                >
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <div className={`hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br ${iconColor} items-center justify-center flex-shrink-0`}>
                                            <IconComponent className="text-white" size={18} />
                                        </div>
                                        <div className="flex-1 flex items-start justify-between gap-2">
                                            <span className="text-xs md:text-sm font-semibold text-white truncate flex-1 line-clamp-2">
                                                {displayName}
                                            </span>
                                            {isSelected && (
                                                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-blue-500 bg-blue-500 flex-shrink-0 mt-0.5" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 md:py-8 text-slate-400">
                            <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs md:text-sm">Không tìm thấy kết quả</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                <span>Đối tượng nhận nhiệm vụ</span>
            </h3>

            <div className={`grid gap-3 ${
                availableTargets.length === 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : availableTargets.length === 3 
                    ? 'grid-cols-1 sm:grid-cols-3' 
                    : availableTargets.length === 2 
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1'
            }`}>
                {availableTargets.map((target) => {
                    const isActive = selectedTargetType === target.id;
                    const colorClasses = getColorClasses(target.color, isActive);
                    const Icon = target.icon;

                    return (
                        <button
                            key={target.id}
                            type="button"
                            onClick={() => handleTargetTypeChange(target.id)}
                            className={`p-4 rounded-lg border-2 transition flex flex-col items-center gap-2 ${colorClasses.border} ${colorClasses.bg} ${!isActive && colorClasses.hover}`}
                        >
                            <Icon
                                size={24}
                                className={isActive ? colorClasses.text : "text-slate-400"}
                            />
                            <span
                                className={`text-sm font-semibold ${
                                    isActive ? colorClasses.textActive : "text-slate-400"
                                }`}
                            >
                                {target.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </p>
                </div>
            )}

            {currentTarget?.type === "employee" && renderEmployeeList()}
            
            {currentTarget?.type === "position" &&
                renderItemList(
                    positions, 
                    "from-purple-500 to-pink-500", 
                    Briefcase,
                    searchPosition,
                    setSearchPosition,
                    "Tìm theo tên vị trí..."
                )}
            
            {currentTarget?.type === "department" &&
                renderItemList(
                    departments, 
                    "from-green-500 to-teal-500", 
                    Building,
                    searchDepartment,
                    setSearchDepartment,
                    "Tìm theo tên phòng ban..."
                )}
            
            {currentTarget?.type === "level" &&
                renderItemList(
                    levels, 
                    "from-orange-500 to-amber-500", 
                    Award,
                    searchLevel,
                    setSearchLevel,
                    "Tìm theo cấp bậc..."
                )}
            
            {currentTarget?.type === "custom" && currentTarget.id && customData[currentTarget.id] &&
                renderItemList(
                    customData[currentTarget.id], 
                    "from-orange-500 to-red-500", 
                    currentTarget.icon,
                    "",
                    () => {},
                    "Tìm kiếm..."
                )}

            {getSelectedCount() > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-slate-300">
                        Đã chọn:{" "}
                        <span className="font-semibold text-white">
                            {getSelectedCount()} {currentTarget?.label.toLowerCase()}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default TaskTargetSelector;