import React, { useEffect, useState } from 'react';
import {     
  getListCaution,
  getCautionKPI,
  createCaution,
  getCaution
} from "@/src/features/caution/api";
import { getListEmployeeDepartment } from '@/src/services/api';
import { uploadImageTask, uploadFileTask } from "@/src/features/task/api";
import { useDispatch } from 'react-redux';
import { useProfileData } from '@/src/hooks/profileHook';
import { useTaskData } from '@/src/hooks/taskhook';
import { 
  AlertTriangle, 
  UserX, 
  Plus, 
  Calendar,
  FileWarning,
  TrendingDown
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCautionData } from '@/src/hooks/cautionHook';
import PersonalCautions from './component/PersonalCautions';
import CreateCautionModal from './component/Createcautionmodal'; 

interface Caution {
  id: number;
  reason: string;
  created_at: string;
  employee: {
    id: number;
    name: string;
    avatar: string | null;
  };
  kpi_item: {
    id: number;
    name: string;
    symbol: string;
    score: number;
  };
}

interface PaginationData {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

function Cautions() {
  const dispatch = useDispatch();
  const { listCaution, listCautionKPI, caution } = useCautionData();
  const { listEmployeeDepartment } = useProfileData();
  const { imageTask, fileTask } = useTaskData();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cautions, setCautions] = useState<Caution[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    limit: 6,
    page: 1,
    totalPages: 1
  });

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCautionKPIs();
    loadEmployees();
  }, []);

  useEffect(() => {
    loadCautions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (listCaution?.rows) {
      setCautions(listCaution.rows);
      if (listCaution.pagination) {
        setPagination(listCaution.pagination);
      }
    }
  }, [listCaution]);

  const loadCautions = async (page: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const payload = {
        token,
        page: page
      };
      const result = await dispatch(getListCaution(payload) as any);
      
      // Update state from result
      if (result?.payload?.data) {
        if (result.payload.data.rows) {
          setCautions(result.payload.data.rows);
        }
        if (result.payload.data.pagination) {
          setPagination(result.payload.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error loading cautions:", error);
      toast.error("Không thể tải danh sách nhắc nhở");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCautionKPIs = async () => {
    try {
      const token = localStorage.getItem("userToken");
      await dispatch(getCautionKPI(token) as any);
    } catch (error) {
      console.error("Error loading caution KPIs:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem("userToken") || null;
      await dispatch(getListEmployeeDepartment(token) as any);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem("userToken");
    const payload = {
      formData,
      token
    };

    const result = await dispatch(uploadImageTask(payload) as any);
    
    if (result?.payload?.data?.success && !result?.error) {
      return imageTask || "";
    } else {
      toast.error("Tải ảnh thất bại");
      throw new Error("Upload failed");
    }
  };

  const handleUploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem("userToken");
    const payload = {
      formData,
      token
    };

    const result = await dispatch(uploadFileTask(payload) as any);
    
    if (result?.payload?.data?.success && !result?.error) {
      return fileTask || "";
    } else {
      toast.error("Tải file thất bại");
      throw new Error("Upload failed");
    }
  };

  const handleCreateCaution = async (
    selectedEmployees: number[], 
    selectedKPIItem: string, 
    reason: string, 
    prove: string
  ) => {
    if (selectedEmployees.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một nhân viên");
      return;
    }

    if (!selectedKPIItem) {
      toast.warning("Vui lòng chọn loại nhắc nhở");
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("userToken") || null;
    
      const payload = {
        employees: selectedEmployees,
        kpi_item_id: parseInt(selectedKPIItem),
        reason: reason || "",
        prove: prove || "",
        token
      };


      const result = await dispatch(createCaution(payload) as any);

      if (result?.payload?.data?.success && !result?.error) {
        toast.success(`Đã nhắc nhở ${selectedEmployees.length} nhân viên`);
        setShowCreateModal(false);
        loadCautions(currentPage);
      } else {
        toast.error("Nhắc nhở thất bại");
      }
    } catch (error) {
      console.error("Error creating caution:", error);
      toast.error("Có lỗi xảy ra khi nhắc nhở");
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderPaginationItems = () => {
    const items = [];
    const { totalPages } = pagination;
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-yellow-400" size={32} />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Quản lý nhắc nhở
                </h1>
              </div>
              <p className="text-slate-400 text-sm sm:text-base">
                Danh sách nhân viên bị nhắc nhở - Tổng: {pagination.total}
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
            >
              <Plus size={20} />
              Nhắc nhở mới
            </button>
          </div>

          {/* Loading State */}
          {isLoading && cautions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-yellow-500 rounded-full animate-spin"></div>
                <p className="text-slate-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : cautions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
              <FileWarning className="text-slate-500 mb-4" size={64} />
              <p className="text-slate-400 text-lg">Chưa có nhắc nhở nào</p>
            </div>
          ) : (
            <>
              {/* Cautions List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {cautions.map((caution) => (
                  <div
                    key={caution.id}
                    className="bg-slate-800/50 border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-500/50 transition-all shadow-lg"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        {caution.employee.avatar ? (
                          <img
                            src={caution.employee.avatar}
                            alt={caution.employee.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-500/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center ring-2 ring-yellow-500/50">
                            <UserX className="text-yellow-400" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                          {caution.employee.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={14} />
                          <span>{formatDate(caution.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/40 flex items-center gap-1.5">
                          <TrendingDown size={14} />
                          <span className="text-xs font-bold">
                            {caution.kpi_item.symbol}{caution.kpi_item.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* KPI Item */}
                    <div className="mb-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="text-yellow-500" size={16} />
                        <span className="text-xs font-semibold text-yellow-400">
                          {caution.kpi_item.name}
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm text-red-300 leading-relaxed">
                        {caution.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={`cursor-pointer ${
                          currentPage === 1 ? "pointer-events-none opacity-50" : ""
                        }`}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        className={`cursor-pointer ${
                          currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Caution Modal */}
      <CreateCautionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCaution}
        listCautionKPI={listCautionKPI}
        listEmployeeDepartment={listEmployeeDepartment}
        isCreating={isCreating}
        onUploadImage={handleUploadImage}
        onUploadFile={handleUploadFile}
      />

    </>
  );
}

export default Cautions;