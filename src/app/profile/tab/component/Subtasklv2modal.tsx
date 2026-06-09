"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { X, ChevronRight, Plus, AlertCircle, Clock, XCircle, Edit3, CheckCheck, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { useTaskData } from "@/src/hooks/taskhook";
import { getSubTaskLv2, deleteSubTask, updateProgressSubTask } from "@/src/features/task/api";
import { Task } from "@/src/services/interface";
import CreateSubTask from "./createSubTask";
import { ModalPortal } from "@/components/ModalPortal";
import UpdateSubTask from "./updateSubTask";
import { formatDate, formatDate2 } from "@/src/utils/formatDate";
import { formatNumber } from "@/src/utils/formatNumber";

interface SubTask {
    id: string;
    name: string;
    description?: string;
    process: number;
    target_value: number;
    value: number;
    exp_increase: number;
    status: { id: number; name: string };
    start_date: string;
    end_date: string;
    is_overdue: boolean;
}


interface Lv2CardProps {
    lv2: any;
    task: Task;
    isSelected: boolean;
    isEditing: boolean;
    isSelectMode: boolean;
    editingValue: number;
    isUpdatingSubtask: boolean;
    onToggleSelect: (id: string) => void;
    onStartEdit: (id: string) => void;
    onCancelEdit: () => void;
    onChangeValue: (v: number) => void;
    onSave: (id: number) => void;
    getTaskStatusBadge: any;
    formatNumber: (n: number) => string;
    formatDate: (d: string) => string;
}

interface SubTaskLv2ModalProps {
    task: Task;
    onClose: () => void;
    onSuccess?: (refreshTask?: boolean) => void;
    getTaskStatusBadge: any;
    subtask_id: any;
    subtasks: SubTask[];
    hasMoreLv1?: boolean;
    onLoadMoreLv1?: () => void;
    isLoadingMoreLv1?: boolean;
    statusTask: any;
    onRefreshLv1?: () => void; 
}


const LV2_LIMIT = 5;

function EditingValueInput({
    initialValue,
    onChange,
}: {
    initialValue: number;
    onChange: (val: number) => void;
}) {
    const [localValue, setLocalValue] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const selectionStart = input.selectionStart || 0;
        const rawValue = input.value;
        const numericString = rawValue.replace(/\./g, "").replace(/,/g, "");
        if (!/^\d*$/.test(numericString)) return;
        const value = Math.max(Number(numericString), 0);
        const formatted = formatNumber(value);
        const diff = formatted.length - rawValue.length;
        setLocalValue(value);
        onChange(value);
        setTimeout(() => {
            input.setSelectionRange(selectionStart + diff, selectionStart + diff);
        }, 0);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            value={formatNumber(localValue)}
            onChange={handleChange}
            className="w-20 px-2 py-1 bg-slate-900 border border-blue-500 rounded text-white text-xs focus:outline-none"
            autoFocus
        />
    );
}

function EditingPercentInput({
    value,
    onChange,
}: {
    value: number;
    onChange: (val: number) => void;
}) {
    return (
        <input
            type="number"
            min="0"
            max="100"
            value={value}
            onChange={(e) => {
                const v = Math.min(100, Math.max(0, Number(e.target.value)));
                onChange(v);
            }}
            className="w-14 px-2 py-1 bg-slate-800 border border-blue-500 rounded text-white text-xs focus:outline-none text-center"
            autoFocus
        />
    );
}

const Lv2Card = memo(({
    lv2,
    task,
    isSelected,
    isEditing,
    isSelectMode,
    editingValue,
    isUpdatingSubtask,
    onToggleSelect,
    onStartEdit,
    onCancelEdit,
    onChangeValue,
    onSave,
    getTaskStatusBadge,
    formatNumber,
    formatDate,
}: Lv2CardProps) => {
    const progress = Number(lv2.target_value) > 0
        ? Math.min(100, (Number(lv2.value) / Number(lv2.target_value)) * 100)
        : 0;

    return (
        <div
            onClick={() => {
                if (isEditing) return;
                if (isSelectMode && lv2.status?.id !== 4) onToggleSelect(lv2.id);
            }}
            className={`bg-slate-900 border rounded-lg px-3 py-2.5 transition cursor-pointer
                ${isSelected ? "border-emerald-500/50" : "border-slate-800 hover:border-slate-700"}`}
        >
            <div className="flex items-start gap-2">
                {isSelectMode && lv2.status?.id !== 4 && (
                    <div className="pt-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(lv2.id)}
                            className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-700 cursor-pointer"
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-1">{lv2.name}</p>
                    {lv2.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{lv2.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 flex-wrap">
                        <span>Mục tiêu: <span className="text-blue-400 font-semibold">{formatNumber(Number(lv2.target_value))} {task.units?.name || "%"}</span></span>
                        {!isEditing && (
                            <span className="flex items-center gap-1">
                                Tiến độ: <span className="text-emerald-400 font-semibold">{formatNumber(Number(lv2.value))} {task.units?.name || "%"}</span>
                                {lv2.status?.id !== 4 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStartEdit(lv2.id);
                                        }}
                                        className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition ml-1"
                                        title="Cập nhật tiến độ"
                                    >
                                        <Edit3 size={12} />
                                    </button>
                                )}
                            </span>
                        )}
                    </div>

                    {isEditing && (
                        <div
                            className="mt-2 flex flex-col gap-2 text-xs"
                            onClick={e => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                            onMouseDown={e => e.stopPropagation()}
                        >
                            <span className="text-slate-500">Cập nhật tiến độ:</span>
                            {task.units?.name === "%" || task.units?.name === null ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={editingValue}
                                        onChange={(e) => onChangeValue(Number(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #2563eb, #a855f7 ${editingValue / 2}%, #ec4899 ${editingValue}%, #1e293b ${editingValue}%)`
                                        }}
                                    />
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-slate-400">0%</span>
                                        <div className="flex items-center gap-1.5">
                                            <EditingPercentInput
                                                value={editingValue}
                                                onChange={onChangeValue}
                                            />
                                            <span className="text-slate-400">%</span>
                                        </div>
                                        <span className="text-slate-400">100%</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-2.5 py-2 flex-wrap">
                                    <span className="text-slate-400 font-semibold">
                                        {formatNumber(Number(lv2.value))} {task.units?.name}
                                    </span>
                                    <span className="text-slate-500">+</span>
                                    <EditingValueInput
                                        initialValue={editingValue}
                                        onChange={onChangeValue}
                                    />
                                    <span className="text-slate-500">=</span>
                                    <span className="text-emerald-400 font-semibold">
                                        {formatNumber(Number(lv2.value) + Number(editingValue || 0))} {task.units?.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onSave(Number(lv2.id)); }}
                                    disabled={isUpdatingSubtask}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded text-white transition disabled:opacity-50 text-xs font-medium"
                                >
                                    <Save size={12} /> Lưu
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onCancelEdit(); }}
                                    disabled={isUpdatingSubtask}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-white transition text-xs font-medium"
                                >
                                    <X size={12} /> Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-slate-400 tabular-nums">{Math.round(progress)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                        <Clock size={9} />
                        <span>{formatDate(lv2.start_date)}</span>
                        <span className="text-slate-600">→</span>
                        <span>{formatDate(lv2.end_date)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {getTaskStatusBadge(lv2.status.id, null, true)}
                    {lv2.is_overdue && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                            Trễ hạn
                        </span>
                    )}
                    {Number(lv2.exp_increase) > 0 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                            +{lv2.exp_increase} XP
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});
Lv2Card.displayName = "Lv2Card";

export default function SubTaskLv2Modal({
    task,
    onClose,
    onSuccess,
    getTaskStatusBadge,
    subtask_id,
    subtasks,
    hasMoreLv1 = false,
    onLoadMoreLv1,
    isLoadingMoreLv1 = false,
    statusTask,
    onRefreshLv1,   
}: SubTaskLv2ModalProps) {
    const dispatch = useDispatch();

    const [selectedSubTask, setSelectedSubTask] = useState<SubTask | null>(null);
    const [showCreateSubTask, setShowCreateSubTask] = useState(false);
    
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<'accept' | 'reject' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // ── Lv2 local state ──
    const [allLv2, setAllLv2] = useState<SubTask[]>([]);
    const lv2OffsetRef = useRef(0);
    const [hasMoreLv2, setHasMoreLv2] = useState(true);
    const [isLoadingMoreLv2, setIsLoadingMoreLv2] = useState(false);
    const [isInitialLoadingLv2, setIsInitialLoadingLv2] = useState(false);
    const [showUpdateSubTask, setShowUpdateSubTask] = useState(false);
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<number>(0);
    const [isUpdatingSubtask, setIsUpdatingSubtask] = useState(false);

    // ── Scroll container refs (để check fill sau initial load) ──
    const lv1ContainerRef = useRef<HTMLDivElement>(null);
    const lv2ContainerRef = useRef<HTMLDivElement>(null);

    // ── Guard chống concurrent fetch ──
    const isFetchingLv2Ref = useRef(false);

    // ── Chọn subtask ban đầu ──
    useEffect(() => {
        if (!subtasks || subtasks.length === 0) return;
        const target = subtask_id
            ? subtasks.find((st: SubTask) => st.id === subtask_id)
            : null;
        setSelectedSubTask(target ?? subtasks[0]);

        
    }, [subtasks, subtask_id]);

    const handleSubtaskValueChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        lv2: any
    ) => {
        const input = e.target;
        const selectionStart = input.selectionStart || 0;
        const rawValue = input.value;
        const numericString = rawValue.replace(/\./g, "").replace(/,/g, "");
        if (!/^\d*$/.test(numericString)) return;
        const value = Number(numericString);
        const validatedValue = Math.max(value, 0);
        const formatted = formatNumber(validatedValue);
        const diff = formatted.length - rawValue.length;
        const caretPosition = selectionStart + diff;
        setEditingValue(validatedValue);
        setTimeout(() => {
            input.setSelectionRange(caretPosition, caretPosition);
        }, 0);
    };
    
    const handleUpdateSubtaskProgress = async (id: number) => {
        const token = localStorage.getItem("userToken");
        setIsUpdatingSubtask(true);
        try {
            const progressResult = await dispatch(
                updateProgressSubTask({ id, value: editingValue, token }) as any
            );
            if (progressResult?.payload?.data?.success) {
                toast.success("Cập nhật tiến độ thành công");
                setEditingSubtaskId(null);
                if (selectedSubTask) reloadLv2FromStart(selectedSubTask.id);
                onRefreshLv1?.();
            } else {
                toast.error(progressResult?.payload?.data?.message || "Cập nhật thất bại");
            }
        } catch {
            toast.error("Có lỗi xảy ra khi cập nhật tiến độ.");
        } finally {
            setIsUpdatingSubtask(false);
        }
    };


    // ── loadMoreLv2 — dùng useCallback để dùng trong effect ──
    const loadMoreLv2 = useCallback(async (selectedId: string) => {
        if (isFetchingLv2Ref.current || !selectedId) return;

        isFetchingLv2Ref.current = true;
        setIsLoadingMoreLv2(true);

        const newOffset = lv2OffsetRef.current + LV2_LIMIT;

        try {
            const token = localStorage.getItem("userToken");
            const result = await (dispatch(getSubTaskLv2({
                token,
                subtask_id: selectedId,
                limit: LV2_LIMIT,
                offset: newOffset,
            }) as any));

            const data: any[] = result?.payload?.data?.data ?? [];

            setAllLv2(prev => {
                const existingIds = new Set(prev.map((x: any) => x.id));
                return [...prev, ...data.filter((x: any) => !existingIds.has(x.id))];
            });

            if (data.length < LV2_LIMIT) {
                setHasMoreLv2(false);
            } else {
                lv2OffsetRef.current = newOffset;
            }
        } catch {
            // offset không tăng nếu thất bại → giữ nguyên lv2OffsetRef
        } finally {
            isFetchingLv2Ref.current = false;
            setIsLoadingMoreLv2(false);
        }
    }, [dispatch]);

    // ── Check sau khi render xem panel đã đầy chưa → auto-fetch nếu cần ──
    const checkAndFillLv2 = useCallback((selectedId: string, currentHasMore: boolean) => {
        if (!currentHasMore) return;
        // Dùng setTimeout để chờ DOM paint xong
        setTimeout(() => {
            const el = lv2ContainerRef.current;
            if (el && el.scrollHeight <= el.clientHeight && !isFetchingLv2Ref.current) {
                loadMoreLv2(selectedId);
            }
        }, 50);
    }, [loadMoreLv2]);

    const checkAndFillLv1 = useCallback(() => {
        if (!hasMoreLv1) return;
        setTimeout(() => {
            const el = lv1ContainerRef.current;
            if (el && el.scrollHeight <= el.clientHeight) {
                onLoadMoreLv1?.();
            }
        }, 50);
    }, [hasMoreLv1, onLoadMoreLv1]);

    // ── Load lv2 khi đổi selectedSubTask ──
    useEffect(() => {
        if (!selectedSubTask) return;

        // Cancel bất kỳ fetch đang chạy
        isFetchingLv2Ref.current = false;

        // Reset lv2 state
        setAllLv2([]);
        lv2OffsetRef.current = 0;
        setHasMoreLv2(true);
        setIsInitialLoadingLv2(true);
        setIsLoadingMoreLv2(false);

        const selectedId = selectedSubTask.id;
        const token = localStorage.getItem("userToken");

        (dispatch(getSubTaskLv2({
            token,
            subtask_id: selectedId,
            limit: LV2_LIMIT,
            offset: 0,
        }) as any)).then((result: any) => {
            const data: any[] = result?.payload?.data?.data ?? [];
            setAllLv2(data);

            const stillHasMore = data.length >= LV2_LIMIT;
            setHasMoreLv2(stillHasMore);
            setIsInitialLoadingLv2(false);

            // Sau khi render xong, kiểm tra panel có cần thêm data không
            if (stillHasMore) {
                checkAndFillLv2(selectedId, stillHasMore);
            }
        });
    }, [selectedSubTask?.id]);

    // ── Check lv1 fill sau khi subtasks thay đổi ──
    useEffect(() => {
        checkAndFillLv1();
    }, [subtasks]);

    // ── Scroll handlers ──
    const handleLv2Scroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!hasMoreLv2 || isLoadingMoreLv2 || !selectedSubTask) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 80) {
            loadMoreLv2(selectedSubTask.id);
        }
    };

    const handleLv1Scroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!hasMoreLv1 || isLoadingMoreLv1) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 80) {
            onLoadMoreLv1?.();
        }
    };

    const handleSelectLv1 = (subtask: SubTask) => {
        if (selectedSubTask?.id === subtask.id) return;
        setSelectedSubTask(subtask);
    };

    // ── Reload lv2 từ đầu (dùng sau khi tạo mới) ──
    const reloadLv2FromStart = useCallback((selectedId: string) => {
        isFetchingLv2Ref.current = false;
        setAllLv2([]);
        lv2OffsetRef.current = 0;
        setHasMoreLv2(true);
        setIsInitialLoadingLv2(true);
        setIsLoadingMoreLv2(false);

        const token = localStorage.getItem("userToken");
        (dispatch(getSubTaskLv2({
            token,
            subtask_id: selectedId,
            limit: LV2_LIMIT,
            offset: 0,
        }) as any)).then((result: any) => {
            const data: any[] = result?.payload?.data?.data ?? [];
            setAllLv2(data);
            const stillHasMore = data.length >= LV2_LIMIT;
            setHasMoreLv2(stillHasMore);
            setIsInitialLoadingLv2(false);
            if (stillHasMore) {
                checkAndFillLv2(selectedId, stillHasMore);
            }
        });
    }, [dispatch, checkAndFillLv2]);

    const handleCreateSuccess = (refresh?: boolean) => {
        setShowCreateSubTask(false);
        if (selectedSubTask) {
            reloadLv2FromStart(selectedSubTask.id);
        }
        onSuccess?.(refresh);
        onRefreshLv1?.(); 
    };

    const refreshSubTasks = useCallback((refreshTask: boolean = false) => {
        if (selectedSubTask) {
            reloadLv2FromStart(selectedSubTask.id);
        }
        onSuccess?.(refreshTask);
        onRefreshLv1?.(); 
    }, [selectedSubTask, reloadLv2FromStart, onSuccess]);


    const enterSelectMode = (action: 'accept' | 'reject') => {
        setIsSelectMode(true);
        setCurrentAction(action);
        setSelectedIds([]);
    };

    const exitSelectMode = () => {
        setIsSelectMode(false);
        setCurrentAction(null);
        setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleOptionTask = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIds.length === 0) {
            toast.warn("Vui lòng chọn ít nhất một nhiệm vụ");
            return;
        }
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("userToken");
            const res = await dispatch(deleteSubTask({
                token,
                ids: selectedIds,
                task_assignment_id: task.id
            }) as any);

            if (res.payload.data.success) {
                toast.success("Đã xóa thành công nhiệm vụ");
                exitSelectMode();
                if (selectedSubTask) reloadLv2FromStart(selectedSubTask.id);
                onSuccess?.(true);
                onRefreshLv1?.();
            } else {
                toast.error("Xóa nhiệm vụ thất bại");
            }
        } catch {
            toast.error("Có lỗi xảy ra khi xóa nhiệm vụ");
        } finally {
            setIsProcessing(false);
        }
    };



    // ────────────────────────────────────────────────────────
    const Lv1Card = ({ subtask }: { subtask: SubTask }) => {
        const isActive = selectedSubTask?.id === subtask.id;
        const progress = subtask.target_value > 0
            ? Math.min(100, (Number(subtask.value) / Number(subtask.target_value)) * 100)
            : 0;

        return (
            <div
                onClick={() => handleSelectLv1(subtask)}
                className={`relative flex items-start gap-2 rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 cursor-pointer transition-all border
                    ${isActive
                        ? "bg-blue-600/10 border-blue-500/40"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
            >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full bg-blue-500" />
                )}
                <div className="flex-1 min-w-0">
                    <p className={`text-[11px] sm:text-xs font-semibold line-clamp-2 leading-tight ${isActive ? "text-white" : "text-slate-200"}`}>
                        {subtask.name}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-[9px] text-green-400 tabular-nums flex-shrink-0">{Math.round(progress)}%</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        <span className="sm:hidden">
                            {getTaskStatusBadge(subtask.status.id, null, true, true)}
                        </span>
                        <span className="hidden sm:inline">
                            {getTaskStatusBadge(subtask.status.id, null, true)}
                        </span>
                        {subtask.is_overdue && (
                            <>
                                <span className="sm:hidden inline-flex w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Trễ hạn" />
                                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                                    Trễ hạn
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <ChevronRight
                    size={12}
                    className={`flex-shrink-0 mt-0.5 transition ${isActive ? "text-blue-400" : "text-slate-600"}`}
                />
            </div>
        );
    };


    const SpinnerRow = () => (
        <div className="flex items-center justify-center py-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
                <span>Đang tải thêm...</span>
            </div>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-800 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-5 rounded-full bg-blue-500" />
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white">Quản lý nhiệm vụ con</h3>
                                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{task.task?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Selected subtask summary */}
                    {selectedSubTask && (
                        <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500 text-xs">Nhiệm vụ:</span>
                                    <span className="text-sm text-green-400 tabular-nums">
                                        {Math.round(selectedSubTask.target_value > 0
                                            ? Math.min(100, (Number(selectedSubTask.value) / Number(selectedSubTask.target_value)) * 100)
                                            : 0)}%
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    {getTaskStatusBadge(selectedSubTask.status.id, null, true)}
                                    {selectedSubTask.is_overdue && (
                                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">
                                            Trễ hạn
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-md text-white truncate w-full">{selectedSubTask.name}</p>
                            <p className="text-xs text-slate-400 mt-1">Thời gian: {formatDate2(selectedSubTask?.start_date)} - {formatDate2(selectedSubTask?.end_date)}</p>
                        </div>
                    )}

                    {/* Body — FIX #1: overflow-hidden để các panel con có thể scroll độc lập */}
                    <div className="flex flex-1 min-h-0 overflow-hidden">

                        {/* LEFT — Lv1 */}
                        <div className="w-[35%] sm:w-[30%] border-r border-slate-800 flex flex-col min-h-0">
                            <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-slate-800/60 flex-shrink-0 flex items-center justify-between">
                                <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <span className="hidden sm:inline">Nhiệm vụ </span>
                                    <span className="text-blue-400">Cấp 1</span>
                                    <span className="ml-1.5 px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                                        {subtasks.length ?? 0}
                                    </span>
                                </p>
                            </div>

                            {/* FIX #2: ref gắn vào scroll container lv1 */}
                            <div
                                ref={lv1ContainerRef}
                                className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                                onScroll={handleLv1Scroll}
                            >
                                {!subtasks || subtasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <AlertCircle size={16} className="text-slate-500 mb-2" />
                                        <p className="text-[10px] text-slate-500">Chưa có</p>
                                    </div>
                                ) : (
                                    <>
                                        {subtasks.map((subtask: SubTask) => (
                                            <Lv1Card key={subtask.id} subtask={subtask} />
                                        ))}

                                        {isLoadingMoreLv1 && <SpinnerRow />}

                                        {!hasMoreLv1 && subtasks.length >= 5 && (
                                            <div className="py-2 text-center">
                                                <p className="text-[10px] text-slate-500">Đã hiển thị tất cả</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT — Lv2 */}
                        <div className="w-[65%] sm:w-[70%] flex flex-col min-h-0">
                            <div className="px-2 sm:px-4 py-2 sm:py-3 border-b border-slate-800/60 flex-shrink-0 flex items-center justify-between gap-2">
                                <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
                                    <span className="hidden sm:inline">Nhiệm vụ </span>
                                    <span className="text-emerald-400">Cấp 2</span>
                                    {!isInitialLoadingLv2 && (
                                        <span className="ml-1.5 px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                                            {allLv2.length}
                                        </span>
                                    )}
                                </p>

                                {!isSelectMode ? (
                                    <div className="flex gap-2">
                                        {selectedSubTask && allLv2.length > 0 && (
                                            <>
                                                <button
                                                    onClick={() => enterSelectMode('reject')}
                                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                                                    title="Xóa nhiều"
                                                >
                                                    <XCircle className="h-4 w-4 shrink-0" />
                                                    <span className="hidden sm:inline">Xóa nhiều</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowUpdateSubTask(true)}
                                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                                                    title="Cập nhật"
                                                >
                                                    <Edit3 size={14} className="shrink-0" />
                                                    <span className="hidden sm:inline">Cập nhật</span>
                                                </button>
                                            </>
                                        )}
                                        {selectedSubTask && selectedSubTask.status?.id === 2 && (
                                            <button
                                                onClick={() => setShowCreateSubTask(true)}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex-shrink-0"
                                                title="Tạo mới"
                                            >
                                                <Plus size={12} />
                                                <span className="hidden sm:inline text-xs font-semibold">Tạo mới</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-rose-500 font-semibold hidden sm:inline">
                                            Đang chọn Xóa
                                        </span>
                                        <button
                                            onClick={exitSelectMode}
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-xs"
                                        >
                                            <XCircle className="h-4 w-4 shrink-0" />
                                            <span className="hidden sm:inline">Hủy</span>
                                        </button>
                                        <button
                                            onClick={handleOptionTask}
                                            disabled={selectedIds.length === 0 || isProcessing}
                                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-xs font-semibold"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                                    <span className="hidden sm:inline">Đang xử lý...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCheck className="h-4 w-4 shrink-0" />
                                                    <span className="sm:hidden font-semibold">{selectedIds.length}</span>
                                                    <span className="hidden sm:inline">Xóa ({selectedIds.length})</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* FIX #3: ref gắn vào scroll container lv2 */}
                            <div
                                ref={lv2ContainerRef}
                                className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                                onScroll={handleLv2Scroll}
                            >
                                {/* Chưa chọn lv1 */}
                                {!selectedSubTask && (
                                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                                        <ChevronRight size={16} className="text-slate-500 mb-2" />
                                        <p className="text-[10px] sm:text-xs text-slate-500">Chọn nhiệm vụ cấp 1</p>
                                    </div>
                                )}

                                {/* Đang load lần đầu */}
                                {selectedSubTask && isInitialLoadingLv2 && (
                                    <div className="flex flex-col items-center justify-center h-full py-10">
                                        <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-2" />
                                        <p className="text-[10px] sm:text-xs text-slate-500">Đang tải...</p>
                                    </div>
                                )}

                                {/* Rỗng */}
                                {selectedSubTask && !isInitialLoadingLv2 && allLv2.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                                        <Plus size={16} className="text-slate-500 mb-2" />
                                        <p className="text-[10px] sm:text-xs text-slate-500 mb-3">Chưa có cấp 2</p>
                                        {selectedSubTask.status?.id === 2 ? (
                                            <button
                                                onClick={() => setShowCreateSubTask(true)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-600/30 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold transition"
                                            >
                                                <Plus size={11} />
                                                <span className="hidden sm:inline">Tạo ngay</span>
                                            </button>
                                        ) : (
                                            <p className="text-[10px] sm:text-xs text-amber-400/80 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                                Task đã 
                                                <span className="lowercase mx-1">
                                                {selectedSubTask.status.name}
                                                </span>
                                                 không thể thêm mới task
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Danh sách lv2 */}
                                {selectedSubTask && !isInitialLoadingLv2 && allLv2.length > 0 && (
                                    <>
                                        {allLv2.map((lv2: any) => (
                                            <Lv2Card
                                                key={lv2.id}
                                                lv2={lv2}
                                                task={task}
                                                isSelected={selectedIds.includes(lv2.id)}
                                                isEditing={editingSubtaskId === lv2.id}
                                                isSelectMode={isSelectMode}
                                                editingValue={editingValue}
                                                isUpdatingSubtask={isUpdatingSubtask}
                                                onToggleSelect={toggleSelect}
                                                onStartEdit={(id) => { setEditingSubtaskId(id); setEditingValue(0); }}
                                                onCancelEdit={() => setEditingSubtaskId(null)}
                                                onChangeValue={setEditingValue}
                                                onSave={handleUpdateSubtaskProgress}
                                                getTaskStatusBadge={getTaskStatusBadge}
                                                formatNumber={formatNumber}
                                                formatDate={formatDate}
                                            />
                                        ))}

                                        {isLoadingMoreLv2 && <SpinnerRow />}

                                        {!hasMoreLv2 && allLv2.length >= LV2_LIMIT && (
                                            <div className="py-2 text-center">
                                                <p className="text-[10px] text-slate-500">Đã hiển thị tất cả</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedSubTask && selectedSubTask.status?.id !== 2 && !isInitialLoadingLv2 && allLv2.length > 0 && (
                                    <div className="py-2 px-3 text-center">
                                        <p className="text-[10px] sm:text-xs text-amber-400/80 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            Task đã hoàn thành không thể thêm mới task
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showCreateSubTask && selectedSubTask && (
                <ModalPortal onClose={() => setShowCreateSubTask(false)}>
                    <CreateSubTask
                        taskInfo={{
                            task_id: task.task.id,          // task (Task gốc) vẫn được truyền vào modal
                            task_assignment_id: parseInt(task.id),
                            task_name: selectedSubTask.name, // hiển thị tên subtask lv1 làm "nhiệm vụ cha"
                            target_value: selectedSubTask.target_value,
                            unit_name: task.units?.name,
                            date_start: selectedSubTask.start_date,
                            date_end: selectedSubTask.end_date
                            
                        }}
                        subtask_id={selectedSubTask.id}
                        onClose={() => setShowCreateSubTask(false)}
                        onSuccess={handleCreateSuccess}
                    />
                </ModalPortal>
            )}

            {showUpdateSubTask && allLv2 && allLv2.length > 0 && (
                <ModalPortal onClose={() => setShowUpdateSubTask(false)}>
                    <UpdateSubTask
                        unit={task.units}
                        subtasks={allLv2}
                        taskAssignmentId={task.id}
                        statusTask={statusTask}
                        onClose={() => setShowUpdateSubTask(false)}
                        onSuccess={(refreshTask) => refreshSubTasks(refreshTask)}
                    />
                </ModalPortal>
            )}
        </>
    );
}