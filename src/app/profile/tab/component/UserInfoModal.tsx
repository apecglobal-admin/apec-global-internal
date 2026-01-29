// Component riêng cho modal thông tin nhân viên
import { updatePassword } from "@/src/services/api";
import { X, User, Mail, Phone, MapPin, Calendar, Briefcase, CreditCard, AlertCircle, Users, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo: any;
    departments: any[];
    positions: any[];
}

const UserInfoModal = ({ isOpen, onClose, userInfo, departments, positions }: UserInfoModalProps) => {
    const dispatch = useDispatch();
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errors, setErrors] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    if (!isOpen) return null;

    const formatDate = (dateString: any) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const getGender = (gen: number) => {
        return gen === 1 ? "Nam" : gen === 2 ? "Nữ" : "Khác";
    };

    const getStatus = (status: string) => {
        const statusMap: any = {
            active: { text: "Đang làm việc", color: "bg-green-500/20 text-green-400 border-green-500/30" },
            inactive: { text: "Nghỉ việc", color: "bg-red-500/20 text-red-400 border-red-500/30" },
            on_leave: { text: "Nghỉ phép", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
        };
        return statusMap[status] || { text: status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
    };

    const validateForm = () => {
        const newErrors = {
            old_password: "",
            new_password: "",
            confirm_password: ""
        };

        let isValid = true;

        // Validate old password
        if (!passwordData.old_password) {
            newErrors.old_password = "Vui lòng nhập mật khẩu cũ";
            isValid = false;
        }

        // Validate new password
        if (!passwordData.new_password) {
            newErrors.new_password = "Vui lòng nhập mật khẩu mới";
            isValid = false;
        } else if (passwordData.new_password.length < 6) {
            newErrors.new_password = "Mật khẩu mới phải có ít nhất 6 ký tự";
            isValid = false;
        }

        // Validate confirm password
        if (!passwordData.confirm_password) {
            newErrors.confirm_password = "Vui lòng xác nhận mật khẩu mới";
            isValid = false;
        } else if (passwordData.new_password !== passwordData.confirm_password) {
            newErrors.confirm_password = "Mật khẩu xác nhận không khớp";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePasswordChange = async () => {
        // Validation - hiển thị dưới field
        if (!validateForm()) {
            return;
        }

        setIsChangingPassword(true);
        try {
            const token = localStorage.getItem("userToken");
            const result: any = await dispatch(
                updatePassword({
                    old_password: passwordData.old_password,
                    new_password: passwordData.new_password,
                    token
                }) as any
            );

            // API response - dùng toast
            if (result.payload.status === 200 || result.payload.status === 201) {
                toast.success(result.payload.data.message || "Đổi mật khẩu thành công");
                setPasswordData({
                    old_password: "",
                    new_password: "",
                    confirm_password: ""
                });
                setErrors({
                    old_password: "",
                    new_password: "",
                    confirm_password: ""
                });
                setShowPasswordSection(false);
            } else {
                toast.error(result.payload.data.message || "Đổi mật khẩu thất bại");
            }
        } catch (error: any) {
            toast.error(error?.message || "Có lỗi xảy ra khi đổi mật khẩu");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setPasswordData({ ...passwordData, [field]: value });
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const statusInfo = getStatus(userInfo.status);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-500 rounded-lg">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                                Thông tin nhân viên
                            </h3>
                            <p className="text-sm text-slate-400">Chi tiết đầy đủ về nhân viên</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <User size={18} className="text-blue-400" />
                            Thông tin cơ bản
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<User size={16} />} label="Họ tên" value={userInfo.name} />
                            <InfoItem 
                                icon={<CreditCard size={16} />} 
                                label="Trạng thái" 
                                value={
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                        {statusInfo.text}
                                    </span>
                                }
                            />
                            <InfoItem icon={<Mail size={16} />} label="Email" value={userInfo.email} />
                            <InfoItem icon={<Phone size={16} />} label="Số điện thoại" value={userInfo.phone || "N/A"} />
                            <InfoItem 
                                icon={<Briefcase size={16} />} 
                                label="Vị trí" 
                                value={positions.find((pos: any) => pos.id === userInfo?.position_id)?.title || "N/A"} 
                            />
                            <InfoItem 
                                icon={<Briefcase size={16} />} 
                                label="Phòng ban" 
                                value={departments.find((dep: any) => dep.id === userInfo?.department_id)?.name || "N/A"} 
                            />
                            <InfoItem icon={<Calendar size={16} />} label="Ngày sinh" value={formatDate(userInfo.birthday)} />
                            <InfoItem icon={<User size={16} />} label="Giới tính" value={getGender(userInfo.gen)} />
                        </div>
                    </div>

                    {/* Thông tin công việc */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-400" />
                            Thông tin công việc
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<Calendar size={16} />} label="Ngày vào làm" value={formatDate(userInfo.join_date)} />
                            <InfoItem 
                                icon={<Users size={16} />} 
                                label="Mã nhân viên" 
                                value={`#${userInfo.id}`} 
                            />
                            <InfoItem 
                                icon={<CreditCard size={16} />} 
                                label="Level" 
                                value={userInfo.level || "N/A"} 
                            />
                            <InfoItem 
                                icon={<CreditCard size={16} />} 
                                label="Kinh nghiệm" 
                                value={`${parseFloat(userInfo.exp || 0).toFixed(0)} XP`} 
                            />
                        </div>
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-blue-400" />
                            Thông tin cá nhân
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem icon={<MapPin size={16} />} label="Địa chỉ" value={userInfo.address || "N/A"} />
                            <InfoItem icon={<MapPin size={16} />} label="Nơi sinh" value={userInfo.birth_place || "N/A"} />
                            <InfoItem icon={<CreditCard size={16} />} label="CCCD/CMND" value={userInfo.citizen_card || "N/A"} />
                            <InfoItem icon={<Calendar size={16} />} label="Ngày cấp" value={formatDate(userInfo.issue_date)} />
                            <InfoItem icon={<MapPin size={16} />} label="Nơi cấp" value={userInfo.issue_place || "N/A"} />
                            <InfoItem icon={<Phone size={16} />} label="SĐT khẩn cấp" value={userInfo.emergency_contract || "N/A"} />
                        </div>
                    </div>

                    {/* Thay đổi mật khẩu */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <Lock size={18} className="text-blue-400" />
                                Bảo mật
                            </h4>
                            <button
                                onClick={() => {
                                    setShowPasswordSection(!showPasswordSection);
                                    if (!showPasswordSection) {
                                        // Reset form when opening
                                        setPasswordData({
                                            old_password: "",
                                            new_password: "",
                                            confirm_password: ""
                                        });
                                        setErrors({
                                            old_password: "",
                                            new_password: "",
                                            confirm_password: ""
                                        });
                                    }
                                }}
                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors text-sm font-medium"
                            >
                                {showPasswordSection ? "Ẩn" : "Đổi mật khẩu"}
                            </button>
                        </div>

                        {showPasswordSection && (
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                {/* Mật khẩu cũ */}
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Mật khẩu cũ</label>
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.old_password}
                                            onChange={(e) => handleInputChange("old_password", e.target.value)}
                                            className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none pr-10 ${
                                                errors.old_password 
                                                    ? "border-red-500 focus:border-red-500" 
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                            placeholder="Nhập mật khẩu cũ"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                        >
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.old_password && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.old_password}
                                        </p>
                                    )}
                                </div>

                                {/* Mật khẩu mới */}
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.new_password}
                                            onChange={(e) => handleInputChange("new_password", e.target.value)}
                                            className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none pr-10 ${
                                                errors.new_password 
                                                    ? "border-red-500 focus:border-red-500" 
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.new_password && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.new_password}
                                        </p>
                                    )}
                                </div>

                                {/* Xác nhận mật khẩu mới */}
                                <div>
                                    <label className="text-sm text-slate-400 mb-2 block">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirm_password}
                                            onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                                            className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none pr-10 ${
                                                errors.confirm_password 
                                                    ? "border-red-500 focus:border-red-500" 
                                                    : "border-slate-700 focus:border-blue-500"
                                            }`}
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirm_password && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.confirm_password}
                                        </p>
                                    )}
                                </div>

                                {/* Nút cập nhật */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => {
                                            setShowPasswordSection(false);
                                            setPasswordData({
                                                old_password: "",
                                                new_password: "",
                                                confirm_password: ""
                                            });
                                            setErrors({
                                                old_password: "",
                                                new_password: "",
                                                confirm_password: ""
                                            });
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors font-medium"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={isChangingPassword}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-lg transition-all duration-300 font-medium"
                                    >
                                        {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ghi chú */}
                    {userInfo.bio && (
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                            <h4 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} className="text-blue-400" />
                                Ghi chú
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{userInfo.bio}</p>
                        </div>
                    )}

                    {/* Thời gian tạo/cập nhật */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem 
                                icon={<Calendar size={16} />} 
                                label="Ngày tạo" 
                                value={formatDate(userInfo.created_at)} 
                            />
                            <InfoItem 
                                icon={<Calendar size={16} />} 
                                label="Cập nhật lần cuối" 
                                value={formatDate(userInfo.updated_at)} 
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component phụ để hiển thị từng thông tin
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: any }) => {
    return (
        <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-blue-400 mt-0.5 flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm text-slate-200 font-medium break-words">{value}</p>
            </div>
        </div>
    );
};

export default UserInfoModal;