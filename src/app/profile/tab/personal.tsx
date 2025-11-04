import { useState } from "react";

const FileText = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const DollarSign = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Lightbulb = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const ArrowRightLeft = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m16 3 4 4-4 4" />
    <path d="M20 7H4" />
    <path d="m8 21-4-4 4-4" />
    <path d="M4 17h16" />
  </svg>
);

const Target = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Plus = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Clock = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircle2 = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const XCircle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const Calendar = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AlertCircle = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

interface Request {
  id: number;
  type: string;
  title: string;
  category: string;
  date: string;
  status: string;
  description?: string;
  reason?: string;
  impact?: string;
  requestedAmount?: string;
  targetTeam?: string;
  targetDate?: string;
  progress?: number;
}

const mockRequests = {
  suggestions: [
    {
      id: 1,
      type: "suggestion",
      title: "Đề xuất cải thiện quy trình code review",
      category: "Process Improvement",
      date: "2024-10-28",
      status: "pending",
      description: "Đề xuất áp dụng automated code review tools để tăng hiệu quả",
    },
    {
      id: 2,
      type: "suggestion",
      title: "Đề xuất training về Cloud Architecture",
      category: "Training",
      date: "2024-10-15",
      status: "approved",
      description: "Tổ chức buổi training nội bộ về AWS/Azure best practices",
    },
  ],
  salaryReviews: [
    {
      id: 3,
      type: "salary",
      title: "Đề nghị xem xét tăng lương",
      requestedAmount: "20%",
      date: "2024-10-20",
      status: "under_review",
      reason: "Hoàn thành xuất sắc 3 dự án lớn trong Q3",
    },
  ],
  initiatives: [
    {
      id: 4,
      type: "initiative",
      title: "Sáng kiến xây dựng Internal Tool",
      category: "Innovation",
      date: "2024-10-25",
      status: "approved",
      description: "Phát triển tool tự động hóa deployment process",
      impact: "Tiết kiệm 10 giờ/tuần cho team",
    },
    {
      id: 5,
      type: "initiative",
      title: "Mentorship Program cho Junior Devs",
      category: "Team Development",
      date: "2024-10-10",
      status: "completed",
      description: "Xây dựng chương trình đào tạo có hệ thống",
      impact: "3 junior developers được đào tạo",
    },
  ],
  transfers: [
    {
      id: 6,
      type: "transfer",
      title: "Đề nghị chuyển sang Backend Team",
      targetTeam: "Backend Engineering",
      date: "2024-10-18",
      status: "rejected",
      reason: "Muốn phát triển kỹ năng backend và microservices",
    },
  ],
  goals: [
    {
      id: 7,
      type: "goal",
      title: "Nâng cao kỹ năng React Advanced Patterns",
      category: "Technical Skills",
      date: "2024-10-01",
      status: "under_review",
      description: "Học và áp dụng các pattern như Compound Components, Render Props",
      targetDate: "2024-12-31",
      progress: 60,
    },
    {
      id: 8,
      type: "goal",
      title: "Đạt Senior Developer trong Q4 2024",
      category: "Career Growth",
      date: "2024-09-15",
      status: "approved",
      description: "Hoàn thành các tiêu chí để thăng cấp lên Senior",
      targetDate: "2024-12-31",
      progress: 75,
    },
    {
      id: 9,
      type: "goal",
      title: "Cải thiện performance ứng dụng 30%",
      category: "Performance",
      date: "2024-10-20",
      status: "pending",
      description: "Tối ưu hóa bundle size và render performance",
      targetDate: "2024-11-30",
      progress: 40,
    },
  ],
};

const statusConfig = {
  pending: {
    label: "Chờ xử lý",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
  },
  under_review: {
    label: "Đang xem xét",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Clock,
  },
  approved: {
    label: "Đã duyệt",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Từ chối",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

interface PersonalTabProps {
  userInfo?: any;
}

function PersonalTab({ userInfo }: PersonalTabProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);

  const allRequests: Request[] = [
    ...mockRequests.suggestions.map((r) => ({ ...r, category: "Đề xuất" })),
    ...mockRequests.salaryReviews.map((r) => ({ ...r, category: "Ứng lương" })),
    ...mockRequests.initiatives.map((r) => ({ ...r, category: "Sáng kiến" })),
    ...mockRequests.transfers.map((r) => ({ ...r, category: "Chuyển vị trí" })),
    ...mockRequests.goals.map((r) => ({ ...r, category: "Mục tiêu" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredRequests = activeTab === "all" 
    ? allRequests 
    : allRequests.filter((r) => r.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "suggestion": return <FileText size={18} />;
      case "salary": return <DollarSign size={18} />;
      case "initiative": return <Lightbulb size={18} />;
      case "transfer": return <ArrowRightLeft size={18} />;
      case "goal": return <Target size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const stats = [
    { label: "Đề xuất", count: mockRequests.suggestions.length, type: "suggestion", icon: FileText },
    { label: "Ứng lương", count: mockRequests.salaryReviews.length, type: "salary", icon: DollarSign },
    { label: "Sáng kiến", count: mockRequests.initiatives.length, type: "initiative", icon: Lightbulb },
    { label: "Chuyển vị trí", count: mockRequests.transfers.length, type: "transfer", icon: ArrowRightLeft },
    { label: "Mục tiêu", count: mockRequests.goals.length, type: "goal", icon: Target },
  ];

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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Tất cả ({allRequests.length})
        </button>
        {stats.map((stat) => (
          <button
            key={stat.type}
            onClick={() => setActiveTab(stat.type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              activeTab === stat.type
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {stat.label} ({stat.count})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <AlertCircle size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Chưa có yêu cầu nào</p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const status = statusConfig[request.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <div
                key={request.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-slate-700/50 rounded-full flex-shrink-0">
                      {getTypeIcon(request.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-white">
                          {request.title}
                        </h3>
                        <span className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded">
                          {request.category}
                        </span>
                      </div>
                      {request.description && (
                        <p className="text-sm text-slate-400 mb-2">
                          {request.description}
                        </p>
                      )}
                      {request.reason && (
                        <p className="text-sm text-slate-400 mb-2">
                          <span className="font-medium text-slate-300">Lý do:</span> {request.reason}
                        </p>
                      )}
                      {request.impact && (
                        <p className="text-sm text-green-400 mb-2">
                          <span className="font-medium">Tác động:</span> {request.impact}
                        </p>
                      )}
                      {request.requestedAmount && (
                        <p className="text-sm text-blue-400 mb-2">
                          <span className="font-medium">Mức đề nghị:</span> +{request.requestedAmount}
                        </p>
                      )}
                      {request.targetTeam && (
                        <p className="text-sm text-purple-400 mb-2">
                          <span className="font-medium">Team mục tiêu:</span> {request.targetTeam}
                        </p>
                      )}
                      {request.targetDate && (
                        <p className="text-sm text-orange-400 mb-2">
                          <span className="font-medium">Thời hạn:</span> {new Date(request.targetDate).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                      {request.progress !== undefined && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">Tiến độ</span>
                            <span className="text-xs font-medium text-slate-300">{request.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                              style={{ width: `${request.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        {new Date(request.date).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 whitespace-nowrap ${status.color}`}>
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
            <h3 className="text-xl font-bold text-white mb-4">Tạo yêu cầu mới</h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <button
                    key={stat.type}
                    className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-lg transition text-left"
                  >
                    <Icon size={24} className="text-blue-400 mb-2" />
                    <p className="text-sm font-semibold text-white">{stat.label}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {stat.type === "suggestion" && "Đề xuất ý tưởng, cải tiến"}
                      {stat.type === "salary" && "Yêu cầu xem xét mức lương"}
                      {stat.type === "initiative" && "Đề xuất sáng kiến mới"}
                      {stat.type === "transfer" && "Yêu cầu chuyển team/vị trí"}
                      {stat.type === "goal" && "Đặt mục tiêu cá nhân"}
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
    </div>
  );
}

export default PersonalTab;