import { toast } from "@/components/ui/use-toast";
import {
  createRequestUser,
  listTypePersonal,
  personalRequest,
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const statusConfig = {
  "Chờ xử lý": {
    label: "Chờ xử lý",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
  },
  "Đang xem xét": {
    label: "Đang xem xét",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
  },
  "Đã duyệt": {
    label: "Đã duyệt",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  "Hoàn thành": {
    label: "Hoàn thành",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  "Từ chối": {
    label: "Từ chối",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

interface PersonalTabProps {
  userInfo?: any;
}

function PersonalTab({ userInfo }: PersonalTabProps) {
  const dispatch = useDispatch();
  const { typePersonal, personals } = useSelector((state: any) => state.user);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showNewRequestModal, setShowNewRequestModal] =
    useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
  });
  const [page] = useState(1);
  const [limit] = useState(100);

  useEffect(() => {
    dispatch(listTypePersonal() as any);
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

  // Combined filters
  const allFilters = [
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
    ...Object.keys(statusConfig).map((statusName) => {
      const config = statusConfig[statusName as keyof typeof statusConfig];
      return {
        id: `status-${statusName}`,
        label: statusName,
        type: "status",
        value: statusName,
        icon: config.icon,
        color: config.color,
        count: (personals || []).filter(
          (p: any) => (p.status_requests?.name || "Chờ xử lý") === statusName
        ).length,
      };
    }),
  ];

  // Filter personals
  let filteredRequests = personals || [];

  if (selectedTypes.length > 0) {
    filteredRequests = filteredRequests.filter((p: any) =>
      selectedTypes.includes(String(p.type_requests?.id))
    );
  }

  if (selectedStatuses.length > 0) {
    filteredRequests = filteredRequests.filter((p: any) =>
      selectedStatuses.includes(p.status_requests?.name || "Chờ xử lý")
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
  };

  const handleSubmitNewRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      token: localStorage.getItem("userToken"),
      title: newRequest.title,
      description: newRequest.description,
      type_request_id: selectedType.id,
    };

    try {
      const res = await dispatch(createRequestUser(payload as any) as any);
      console.log("res", res);

      if (res.payload.status == 200 || res.payload.status == 201) {
        toast(res.payload.data.message);
        await dispatch(personalRequest(payload as any) as any);
        console.log("thành công")
      }
    } catch (error) {
      console.log(error);
    }
    // Reset form và đóng modal
    setNewRequest({ title: "", description: "" });
    setShowCreateModal(false);
    setSelectedType(null);
  };

  const activeFilterCount = selectedTypes.length + selectedStatuses.length;

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
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-white transition hidden md:block"
              >
                Xóa tất cả
              </button>
            )}
            {/* Mobile filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition text-xs font-medium flex items-center gap-1.5"
            >
              <Filter size={14} />
              {showFilters ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        {/* Filters - Always show on desktop, toggle on mobile */}
        <div className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="flex flex-wrap gap-2">
            {allFilters.map((filter: any) => {
              const Icon = filter.icon;
              const isSelected =
                filter.type === "type"
                  ? selectedTypes.includes(filter.value)
                  : selectedStatuses.includes(filter.value);

              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    if (filter.type === "type") {
                      toggleType(filter.value);
                    } else {
                      toggleStatus(filter.value);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 border ${
                    isSelected
                      ? filter.color || "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-white/20 border-current"
                        : "border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <Icon size={14} />
                  {filter.label}
                  <span
                    className={`${isSelected ? "opacity-80" : "opacity-60"}`}
                  >
                    ({filter.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile clear filters button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="md:hidden w-full mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition text-xs font-medium"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-400">
        Hiển thị{" "}
        <span className="text-white font-medium">{sortedRequests.length}</span>{" "}
        / {(personals || []).length} yêu cầu
      </div>

      {/* List */}
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
          sortedRequests
          .map((request: any) => {
            const statusName = request.status_requests?.name || "Chờ xử lý";
            const status =
              statusConfig[statusName as keyof typeof statusConfig] ||
              statusConfig["Chờ xử lý"];
            const StatusIcon = status.icon;

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
                          {new Date(request.date_end).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      )}
                      {request.process !== null &&
                        request.process !== undefined && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-400">
                                Tiến độ
                              </span>
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
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        {new Date(request.date_request).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${status.color}`}
                  >
                    <StatusIcon size={14} />
                    {status.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Tạo yêu cầu mới
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(typePersonal || []).map((type: any) => {
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
      {showCreateModal && selectedType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Tạo yêu cầu {selectedType.name}
            </h3>

            <form onSubmit={handleSubmitNewRequest} className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Tiêu đề</label>
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
                <label className="text-sm text-slate-400">Mô tả</label>
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

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedType(null);
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
