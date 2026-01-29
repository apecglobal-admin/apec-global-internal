import { uploadFileTask, uploadImageTask } from "@/src/features/task/api";
import { useProfileData } from "@/src/hooks/profileHook";
import { useTaskData } from "@/src/hooks/taskhook";
import {
  createRequestUser,
  listTypePersonal,
  personalRequest,
  getListStatusPersonal
} from "@/src/services/api";
import {
  AlertCircle,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Lightbulb,
  Plus,
  Target,
  XCircle,
  Filter,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Color map cho status
const colorMap: Record<string, string> = {
  "yellow": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "blue": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "green": "bg-green-500/20 text-green-400 border-green-500/30",
  "red": "bg-red-500/20 text-red-400 border-red-500/30",
  "emerald": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

// Helper function để lấy màu theo tên status
const getStatusColor = (statusName: string): string => {
  const lowerName = statusName.toLowerCase();
  
  if (lowerName.includes("chờ") || lowerName.includes("pending")) {
    return colorMap["blue"];
  }
  if (lowerName.includes("xem xét") || lowerName.includes("đang")) {
    return colorMap["blue"];
  }
  if (lowerName.includes("duyệt") || lowerName.includes("approved")) {
    return colorMap["green"];
  }
  if (lowerName.includes("hoàn thành") || lowerName.includes("completed")) {
    return colorMap["emerald"];
  }
  if (lowerName.includes("từ chối") || lowerName.includes("rejected")) {
    return colorMap["red"];
  }
  
  return colorMap["yellow"]; // Default
};

// Helper function để lấy icon theo tên status
const getStatusIcon = (statusName: string) => {
  const lowerName = statusName.toLowerCase();
  
  if (lowerName.includes("chờ") || lowerName.includes("đang")) {
    return Clock;
  }
  if (lowerName.includes("duyệt") || lowerName.includes("hoàn thành")) {
    return CheckCircle2;
  }
  if (lowerName.includes("từ chối")) {
    return XCircle;
  }
  
  return Clock; // Default
};

interface PersonalTabProps {
  userInfo?: any;
}

function PersonalTab({ userInfo }: PersonalTabProps) {
  const dispatch = useDispatch();
  const { typePersonal, personals, listStatusPersonal } = useProfileData();
  const { imageTask, fileTask } = useTaskData();

  
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [showProposalSubmenu, setShowProposalSubmenu] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Số items mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [uploadType, setUploadType] = useState<"image" | "document" | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedProve, setUploadedProve] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  

  useEffect(() => {
    dispatch(listTypePersonal() as any);
    dispatch(getListStatusPersonal() as any);
    const token = localStorage.getItem("userToken");
    if (token) {
      const payload = {
        page,
        limit,
        token,
      };
      dispatch(personalRequest(payload as any) as any);
    }
  }, [dispatch, page, limit]);
  
  // Cập nhật totalPages và totalItems khi nhận data
  useEffect(() => {
    if (personals) {
      // Giả sử API trả về: { data: [], total_items: 100, total_pages: 10 }
      setTotalItems(personals.total_items || personals.length || 0);
      setTotalPages(Math.ceil((personals.total_items || personals.length) / limit));
    }
  }, [personals, limit]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
  
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
  
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
  
      if (page <= 3) {
        endPage = 4;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - 3;
      }
  
      if (startPage > 2) {
        items.push("ellipsis-start");
      }
  
      for (let i = startPage; i <= endPage; i++) {
        items.push(i);
      }
  
      if (endPage < totalPages - 1) {
        items.push("ellipsis-end");
      }
  
      items.push(totalPages);
    }
  
    return items;
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (value: string, type: 'type' | 'status') => {
    if (type === 'type') {
      if (value === "all") {
        setSelectedTypes([]);
      } else {
        setSelectedTypes([value]);
      }
    } else {
      if (value === "all") {
        setSelectedStatuses([]);
      } else {
        setSelectedStatuses([value]);
      }
    }
    setPage(1); // Reset về trang 1
  };

  const getTypeIcon = (iconName: string) => {
    switch (iconName) {
      case "book-text":
        return <FileText size={18} />;
      case "dollar-sign":
        return <DollarSign size={18} />;
      case "lightbulb":
        return <Lightbulb size={18} />;
      case "arrow-left-right":
        return <ArrowRightLeft size={18} />;
      case "target":
        return <Target size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  const getTypeIconLarge = (typeName: string) => {
    switch (typeName) {
      case "Đề xuất":
        return FileText;
      case "Ứng lương":
        return DollarSign;
      case "Sáng kiến":
        return Lightbulb;
      case "Chuyển vị trí":
        return ArrowRightLeft;
      case "Mục tiêu":
        return Target;
      default:
        return FileText;
    }
  };

  const getTypeDescription = (typeName: string) => {
    switch (typeName) {
      case "Đề xuất":
        return "Đề xuất ý tưởng, cải tiến";
      case "Ứng lương":
        return "Yêu cầu xem xét mức lương";
      case "Sáng kiến":
        return "Đề xuất sáng kiến mới";
      case "Chuyển vị trí":
        return "Yêu cầu chuyển team/vị trí";
      case "Mục tiêu":
        return "Đặt mục tiêu cá nhân";
      default:
        return "";
    }
  };

  // Toggle filter
  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const toggleStatus = (statusName: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusName)
        ? prev.filter((name) => name !== statusName)
        : [...prev, statusName]
    );
  };

  // Combined filters - Sử dụng data từ API
  const allFilters = useMemo(() => {
    return [
      ...(typePersonal || []).map((type: any) => ({
        id: `type-${type.id}`,
        label: type.name,
        type: "type",
        value: String(type.id),
        icon: getTypeIconLarge(type.name),
        count: (personals || []).filter(
          (p: any) => String(p.type_requests?.id) === String(type.id)
        ).length,
      })),
      ...(listStatusPersonal || []).map((status: any) => {
        const Icon = getStatusIcon(status.name);
        const color = getStatusColor(status.name);
        
        return {
          id: `status-${status.id}`,
          label: status.name,
          type: "status",
          value: status.name,
          icon: Icon,
          color: color,
          count: (personals || []).filter(
            (p: any) => p.status_requests?.name === status.name
          ).length,
        };
      }),
    ];
  }, [typePersonal, listStatusPersonal, personals]);

  // Filter personals
  let filteredRequests = personals || [];

  if (selectedTypes.length > 0) {
    filteredRequests = filteredRequests.filter((p: any) =>
      selectedTypes.includes(String(p.type_requests?.id))
    );
  }

  if (selectedStatuses.length > 0) {
    filteredRequests = filteredRequests.filter((p: any) =>
      selectedStatuses.includes(p.status_requests?.name)
    );
  }

  // Sort by date
  const sortedRequests = [...filteredRequests].sort(
    (a, b) =>
      new Date(b.date_request).getTime() - new Date(a.date_request).getTime()
  );

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setPage(1);

  };

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      token: localStorage.getItem("userToken"),
      title: newRequest.title,
      description: newRequest.description,
      type_request_id: selectedType.id,
      prove: uploadedProve, // Thêm prove vào payload
    };
  
    try {
      const res = await dispatch(createRequestUser(payload as any) as any);
  
      if (res.payload.status == 200 || res.payload.status == 201) {
        toast.success("upload file thành công");
        await dispatch(personalRequest(payload as any) as any);
      }
    } catch (error) {
      console.error("Error creating request:", error);
    }
    
    // Reset form và đóng modal
    setNewRequest({ title: "", description: "" });
    setShowCreateModal(false);
    setSelectedType(null);
    setUploadType(null);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadedProve("");
  };

  const activeFilterCount = selectedTypes.length + selectedStatuses.length;

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

  // Phân loại các loại yêu cầu
  const proposalTypes = (typePersonal || []).filter((type: any) => 
    ["Đề xuất", "Chuyển vị trí", "Ứng lương"].includes(type.name)
  );
  
  const otherTypes = (typePersonal || []).filter((type: any) => 
    !["Đề xuất", "Chuyển vị trí", "Ứng lương"].includes(type.name)
  );

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




// Thêm các handler functions
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file);
    setUploadedProve("");

    if (uploadType === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }
};

const handleUploadTypeChange = (type: "image" | "document") => {
  if (uploadType === type) {
    setUploadType(null);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadedProve("");
  } else {
    setUploadType(type);
    setSelectedFile(null);
    setFilePreview(null);
    setUploadedProve("");
  }
};

const getAcceptedFileTypes = () => {
  if (uploadType === "image") {
    return "image/*";
  } else if (uploadType === "document") {
    return ".pdf,.doc,.docx,.xls,.xlsx,.txt";
  }
  return "";
};

// Placeholder upload functions - bạn cần implement logic upload thực tế
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

const handleUpload = async () => {
  if (!selectedFile) {
    return;
  }

  setIsUploading(true);
  try {
    let uploadedUrl = "";
    
    if (uploadType === "image") {
      const result = await dispatch(uploadImageTask({
        formData: (() => {
          const fd = new FormData();
          fd.append('file', selectedFile);
          return fd;
        })(),
        token: localStorage.getItem("userToken")
      }) as any);
      
      // Lấy URL trực tiếp từ response thay vì từ Redux state
      if (result?.payload?.data?.success && !result?.error) {
        uploadedUrl = result.payload.data.url || result.payload.data.data?.url || "";
        if (uploadedUrl) {
          setUploadedProve(uploadedUrl);
          toast.success("Tải ảnh thành công");
        } else {
          throw new Error("Không nhận được URL từ server");
        }
      } else {
        throw new Error("Upload failed");
      }
    } else if (uploadType === "document") {
      const result = await dispatch(uploadFileTask({
        formData: (() => {
          const fd = new FormData();
          fd.append('file', selectedFile);
          return fd;
        })(),
        token: localStorage.getItem("userToken")
      }) as any);
      
      // Lấy URL trực tiếp từ response thay vì từ Redux state
      if (result?.payload?.data?.success && !result?.error) {
        uploadedUrl = result.payload.data.url || result.payload.data.data?.url || "";
        if (uploadedUrl) {
          setUploadedProve(uploadedUrl);
          toast.success("Tải file thành công");
        } else {
          throw new Error("Không nhận được URL từ server");
        }
      } else {
        throw new Error("Upload failed");
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("Upload thất bại");
    setUploadedProve(""); // Reset về rỗng nếu lỗi
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Yêu cầu cá nhân</h2>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition text-sm font-medium"
        >
          <Plus size={16} />
          Tạo yêu cầu
        </button>
      </div>

      {/* Combined Filters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <h3 className="text-sm font-medium text-slate-400">Bộ lọc</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Type Filter Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Loại yêu cầu
            </label>
            <Select
              value={selectedTypes.length === 1 ? selectedTypes[0] : "all"}
              onValueChange={(value) => handleFilterChange(value, 'type')}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white text-sm h-10">
                <SelectValue placeholder="Tất cả loại yêu cầu" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white text-sm">
                  Tất cả ({(personals || []).length})
                </SelectItem>
                {(typePersonal || []).map((type: any) => {
                  const Icon = getTypeIconLarge(type.name);
                  const count = (personals || []).filter(
                    (p: any) => String(p.type_requests?.id) === String(type.id)
                  ).length;
                  
                  return (
                    <SelectItem
                      key={type.id}
                      value={String(type.id)}
                      className="text-white text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} />
                        <span>{type.name}</span>
                        <span className="text-slate-400">({count})</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Trạng thái
            </label>
            <Select
              value={selectedStatuses.length === 1 ? selectedStatuses[0] : "all"}
              onValueChange={(value) => handleFilterChange(value, 'status')}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white text-sm h-10">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white text-sm">
                  Tất cả ({(personals || []).length})
                </SelectItem>
                {(listStatusPersonal || []).map((status: any) => {
                  const Icon = getStatusIcon(status.name);
                  const count = (personals || []).filter(
                    (p: any) => p.status_requests?.name === status.name
                  ).length;
                  
                  return (
                    <SelectItem
                      key={status.id}
                      value={status.name}
                      className="text-white text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} />
                        <span>{status.name === "Đã duyệt" ? "Chưa tiếp nhận" : status.name}</span>
                        <span className="text-slate-400">({count})</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* List Pagination */}
      <div className="space-y-3">
        {sortedRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <AlertCircle size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Không tìm thấy yêu cầu nào</p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          sortedRequests.map((request: any) => {
            const statusName = request.status_requests?.name;
            const statusColor = statusName ? getStatusColor(statusName) : colorMap["blue"];
            const StatusIcon = statusName ? getStatusIcon(statusName) : Clock;

            return (
              <div
                key={request.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-slate-700/50 rounded-full flex-shrink-0">
                      {getTypeIcon(request.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-white">
                          {request.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
                          {request.type_requests?.name}
                        </span>
                      </div>
                      {request.description && (
                        <p className="text-sm text-slate-400 mb-2">
                          {request.description}
                        </p>
                      )}
                      {request.results && (
                        <p className="text-sm text-green-400 mb-2">
                          <span className="font-medium">Kết quả:</span>{" "}
                          {request.results}
                        </p>
                      )}
                      {request.rate && (
                        <p className="text-sm text-blue-400 mb-2">
                          <span className="font-medium">Mức đề nghị:</span> +
                          {request.rate}%
                        </p>
                      )}
                      {request.positions && (
                        <p className="text-sm text-purple-400 mb-2">
                          <span className="font-medium">Vị trí mục tiêu:</span>{" "}
                          {request.positions.name}
                        </p>
                      )}
                      {request.date_end && (
                        <p className="text-sm text-orange-400 mb-2">
                          <span className="font-medium">Thời hạn:</span>{" "}
                          {new Date(request.date_end).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                      {request.process !== null && request.process !== undefined && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Tiến độ</span>
                            <span className="text-xs font-medium text-slate-300">
                              {request.process}%
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                              style={{ width: `${request.process}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {request.document && (
                          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700">
                              <p className="text-xs text-slate-500 mb-1.5 sm:mb-2">Minh chứng:</p>
                              {renderFilePreview(request.document)}
                          </div>
                      )} 
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                        <Calendar size={14} />
                        {new Date(request.date_request).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${statusColor}`}
                  >
                    <StatusIcon size={14} />
                    {statusName === "Đã duyệt" ? "Chưa tiếp nhận" : statusName || "Không xác định"}
                  </div>

                </div>


              </div>
            );
          })
        )}
      </div>
      {previewImage && (
            <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4"
                onClick={() => setPreviewImage(null)}
            >
                <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full max-h-full rounded-lg shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-800 text-white"
                  }
                />
              </PaginationItem>

              {getPaginationItems().map((item, index) => {
                if (item === "ellipsis-start" || item === "ellipsis-end") {
                  return (
                    <PaginationItem key={`${item}-${index}`}>
                      <PaginationEllipsis className="text-slate-400" />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      onClick={() => handlePageChange(item as number)}
                      isActive={page === item}
                      className={`cursor-pointer ${
                        page === item
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-500"
                          : "text-white hover:bg-slate-800 border-slate-700"
                      }`}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:bg-slate-800 text-white"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Page info */}
          <div className="text-center text-sm text-slate-400">
            Trang {page} / {totalPages} - Hiển thị {sortedRequests.length} yêu cầu
          </div>
        </div>
      )}

      {/* Modal - Tạo yêu cầu mới - Main menu */}
      {showNewRequestModal && !showProposalSubmenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Tạo yêu cầu mới
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Các đề xuất - nhóm 3 loại */}
              <button
                onClick={() => setShowProposalSubmenu(true)}
                className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg transition text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <FileText size={24} className="text-blue-400" />
                  <ChevronRight size={20} className="text-slate-500 group-hover:text-blue-400 transition" />
                </div>
                <p className="text-sm font-semibold text-white">
                  Các đề xuất
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Đề xuất, chuyển vị trí, ứng lương
                </p>
              </button>

              {/* Các loại yêu cầu khác */}
              {otherTypes.map((type: any) => {
                const Icon = getTypeIconLarge(type.name);
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setShowNewRequestModal(false);
                      setShowCreateModal(true);
                    }}
                    className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg transition text-left"
                  >
                    <Icon size={24} className="text-blue-400 mb-2" />
                    <p className="text-sm font-semibold text-white">
                      {type.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {getTypeDescription(type.name)}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowNewRequestModal(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal - Submenu các đề xuất */}
      {showNewRequestModal && showProposalSubmenu && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowProposalSubmenu(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
              <h3 className="text-xl font-bold text-white">
                Chọn loại đề xuất
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {proposalTypes.map((type: any) => {
                const Icon = getTypeIconLarge(type.name);
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      setShowNewRequestModal(false);
                      setShowProposalSubmenu(false);
                      setShowCreateModal(true);
                    }}
                    className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg transition text-left flex items-center gap-4"
                  >
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Icon size={24} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {type.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {getTypeDescription(type.name)}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-500" />
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                setShowProposalSubmenu(false);
                setShowNewRequestModal(false);
              }}
              className="w-full mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal - Form tạo yêu cầu */}
      {showCreateModal && selectedType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Tạo yêu cầu {selectedType.name}
            </h3>

            <form onSubmit={handleSubmitNewRequest} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 font-semibold">Tiêu đề *</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, title: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 font-semibold">Mô tả</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) =>
                    setNewRequest({
                      ...newRequest,
                      description: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:border-blue-500 outline-none"
                  rows={3}
                />
              </div>

              {/* Upload Section */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">
                    Minh chứng (tùy chọn)
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">
                  Chọn loại minh chứng bạn muốn tải lên:
                </p>

                {/* Upload Type Selection */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => handleUploadTypeChange("image")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                      uploadType === "image"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <FileText size={20} />
                    <span className="text-xs font-semibold">Hình ảnh</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, GIF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUploadTypeChange("document")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                      uploadType === "document"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <FileText size={20} />
                    <span className="text-xs font-semibold">Tài liệu</span>
                    <span className="text-[10px] text-slate-500">PDF, DOC, XLS</span>
                  </button>
                </div>

                {/* File Upload Input */}
                {uploadType && (
                  <div>
                    <label className="block w-full cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-750 transition">
                        <FileText size={14} className="text-blue-400" />
                        <span className="text-xs text-slate-300 truncate">
                          {selectedFile
                            ? selectedFile.name
                            : `Chọn ${uploadType === "image" ? "hình ảnh" : "tài liệu"}`}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept={getAcceptedFileTypes()}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>

                    {/* Image Preview */}
                    {filePreview && uploadType === "image" && (
                      <div className="mt-3">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border border-slate-700"
                        />
                      </div>
                    )}

                    {/* File Info */}
                    {selectedFile && (
                      <div className="mt-3 p-2.5 bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText size={14} className="text-blue-400 flex-shrink-0" />
                            <span className="text-xs text-slate-300 truncate">
                              {selectedFile.name}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    {selectedFile && !uploadedProve && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
                      >
                        <FileText size={14} />
                        {isUploading ? "Đang tải lên..." : "Tải lên"}
                      </button>
                    )}

                    {/* Upload Success Message */}
                    {uploadedProve && (
                      <div className="mt-3 p-2.5 bg-green-900/30 border border-green-500/50 rounded-lg">
                        <p className="text-xs text-green-400 text-center">
                          ✓ Đã tải lên thành công!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedType(null);
                    setUploadType(null);
                    setSelectedFile(null);
                    setFilePreview(null);
                    setUploadedProve("");
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalTab;