import React, { useEffect, useState } from 'react';
import { getCaution } from "@/src/features/caution/api";
import { useDispatch } from 'react-redux';
import {
  AlertTriangle,
  UserX,
  Calendar,
  FileWarning,
  TrendingDown,
  AlertCircle,
  X,
  Search
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCautionData } from '@/src/hooks/cautionHook';

interface Caution {
  id: number;
  reason: string;
  prove?: string;
  created_at: string;
  assignee: {
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

function PersonalCautions() {
  const dispatch = useDispatch();
  const { caution, listCautionKPI } = useCautionData();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [cautions, setCautions] = useState<Caution[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    limit: 6,
    page: 1,
    totalPages: 1
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [kpiFilter, setKpiFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    loadPersonalCautions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (caution?.rows) {
      setCautions(caution.rows);
      if (caution.pagination) {
        setPagination(caution.pagination);
      }
    }
  }, [caution]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const token = localStorage.getItem("userToken");
      const payload = {
        token,
        kpi_item_id: kpiFilter === "all" ? null : kpiFilter,
        search: searchFilter === "" ? null : searchFilter
      };
      dispatch(getCaution(payload) as any);
    }, 300)
  return () => clearTimeout(timeout);
  }, [kpiFilter, searchFilter]);

  const loadPersonalCautions = async (page: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const payload = {
        token,
        page: page
      };
      const result = await dispatch(getCaution(payload) as any);

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
      console.error("Error loading personal cautions:", error);
      toast.error("Không thể tải danh sách nhắc nhở cá nhân");
    } finally {
      setIsLoading(false);
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

  const getFileInfo = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const fileName = url.split('/').pop() || 'file';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const isImage = imageExtensions.includes(extension);

    const fileIcons: Record<string, string> = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '📊',
      'pptx': '📊',
      'txt': '📃',
      'zip': '🗜️',
      'rar': '🗜️',
    };

    return {
      isImage,
      extension: extension.toUpperCase(),
      fileName,
      icon: fileIcons[extension] || '📎'
    };
  };

  const renderFilePreview = (url?: string) => {
    if (!url) return null;

    const file = getFileInfo(url);

    if (file.isImage) {
      return (
        <img
          src={url}
          alt={file.fileName}
          className="w-full h-32 object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition"
          onClick={() => setPreviewImage(url)}
        />
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition text-sm text-slate-200"
      >
        <span className="text-lg">{file.icon}</span>
        <span className="truncate">{file.fileName}</span>
        <span className="ml-auto text-xs text-slate-400">
          {file.extension}
        </span>
      </a>
    );
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


  const handleKpiFilterChange = (filter: string) => {
    setKpiFilter(filter)
  }

  const renderFilter = () => {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-300">
              Phân loại
            </label>
            <Select value={kpiFilter} onValueChange={handleKpiFilterChange}>
              <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Chọn loại sự kiện" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white text-xs sm:text-sm">
                  Tất cả
                </SelectItem>
                {listCautionKPI &&
                  Array.isArray(listCautionKPI) &&
                  listCautionKPI.map((type: any) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="text-white text-xs sm:text-sm"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value)
              }}
              placeholder={"Tìm kiếm theo tên, mô tả..."}
              className="
                    w-full rounded-md
                    bg-slate-900 border border-slate-700
                    pl-9 pr-8 py-2 text-sm text-white
                    placeholder:text-slate-500
                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-150
                    "
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => setSearchFilter("")}
                aria-label="Xóa tìm kiếm"
                className="
                        absolute right-2.5 top-1/2 -translate-y-1/2
                        text-slate-500 hover:text-white
                        transition-colors duration-150
                    "
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-red-400" size={32} />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Ghi nhận vi phạm
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Danh sách nhắc nhở dành cho bạn - Tổng: {pagination.total}
            </p>
          </div>

          {renderFilter()}

          {/* Loading State */}
          {isLoading && cautions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-red-500 rounded-full animate-spin"></div>
                <p className="text-slate-400">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : cautions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
              <FileWarning className="text-slate-500 mb-4" size={64} />
              <p className="text-slate-400 text-lg">Chưa có nhắc nhở nào</p>
              <p className="text-slate-500 text-sm mt-2">Bạn đang làm việc tốt! 🎉</p>
            </div>
          ) : (
            <>
              {/* Cautions List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {cautions.map((caution) => (
                  <div
                    key={caution.id}
                    className="bg-slate-800/50 border border-red-500/30 rounded-lg p-4 hover:border-red-500/50 transition-all shadow-lg hover:shadow-red-500/10"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        {caution.assignee.avatar ? (
                          <img
                            src={caution.assignee.avatar}
                            alt={caution.assignee.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center ring-2 ring-red-500/50">
                            <UserX className="text-red-400" size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-1">
                          {caution.assignee.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={14} />
                          <span>{formatDate(caution.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/40 flex items-center gap-1.5">
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
                        <AlertTriangle className="text-red-500" size={16} />
                        <span className="text-xs font-semibold text-red-400">
                          {caution.kpi_item.name}
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 mb-3">
                      <p className="text-sm text-red-300 leading-relaxed">
                        {caution.reason}
                      </p>
                    </div>

                    {/* Prove */}
                    {caution.prove && (
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-500 mb-2">Minh chứng:</p>
                        {renderFilePreview(caution.prove)}
                      </div>
                    )}
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
                        className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                          }`}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                        className={`cursor-pointer ${currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition z-10"
          >
            <X size={32} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default PersonalCautions;