"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo, loginWeb } from "@/src/services/api";
import { Eye, EyeOff, Lock } from "lucide-react";
import { logout } from "@/src/features/user/userSlice";

export default function LoginSection() {
    const [enableOtp, setEnableOtp] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { status, error, userInfo } = useSelector((state: any) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const clearForm = () => {
        setPassword("");
        setEmail("");
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        // console.log("Đăng nhập với:", { email, password });
        try {
            const payload = {
                email,
                password,
            };

            const res = await dispatch(loginWeb(payload) as any);
            if (status === "succeeded") {
                const token = localStorage.getItem("userToken");
                if (token) {
                    dispatch(fetchUserInfo(token) as any);
                }
            } else if (status === "failed" && error) {
                alert(error);
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        dispatch(logout());
        router.push("/login");
    };

    return (
        <section
            className="rounded-3xl border  p-6 sm:p-7 lg:p-8"
            style={{
                background: "rgba(213, 212, 212, 0.6)",
                border: "2px solid rgb(127, 127, 127) ",
                boxShadow: "0 0 10px 2px rgb(169, 169, 170)",
            }}
        >
            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-950 sm:text-sm">
                Apec ID
            </div>

            {!userInfo && (
                <>
                    <h2 className="mt-2 text-2xl font-extrabold text-blue-950 sm:text-3xl">
                        Cổng đăng nhập nội bộ
                    </h2>
                    <p className="mt-2 text-sm  text-black ">
                        Sử dụng tài khoản Apec ID dùng chung với ERP, HRM và
                        CRM. Xác thực hai lớp bảo vệ dữ liệu và liên kết trực
                        tiếp hồ sơ KPI, chấm công, lương thưởng.
                    </p>
                    <div className="mt-5 space-y-4 sm:mt-6">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-2xl border border-slate-400 px-4 py-3 text-sm text-black placeholder:text-black
                focus:border-blue-500 focus:outline-none bg-white focus:bg-white transition-colors"
                        />
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className="w-full rounded-2xl border border-slate-400 px-4 py-3 text-sm text-black placeholder:text-black
                  focus:border-blue-500 focus:outline-none bg-white focus:bg-white transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {/* <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={enableOtp}
                  onChange={(event) => setEnableOtp(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                Kích hoạt đăng nhập 2 lớp (2FA)
              </label> */}
                            <a
                                href="#"
                                className="text-sm text-red-600 transition hover:text-red-400"
                            >
                                Quên mật khẩu / đổi mật khẩu
                            </a>
                        </div>
                        {enableOtp && (
                            <input
                                type="text"
                                placeholder="Nhập mã OTP từ ứng dụng Apec Authenticator"
                                className="w-full rounded-2xl border border-blue-600 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-blue-200 focus:border-blue-500 focus:outline-none"
                            />
                        )}
                        <button
                            onClick={handleLogin}
                            className="w-full rounded-2xl py-3 text-sm font-semibold text-white uppercase tracking-wide transition bg-active-blue-metallic cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </>
            )}

            {userInfo && (
                <div className="mt-6 space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-blue-950 sm:text-3xl">
                            Chào mừng quay lại!
                        </h2>
                        <p className="text-xl text-orange-600 font-semibold">
                            {userInfo.name}
                        </p>
                        <p className="text-sm text-black">
                            {userInfo.email}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="p-4 rounded-xl bg-white border border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-black">
                                        Phòng ban
                                    </p>
                                    <p className="text-black font-medium">
                                        {userInfo.department || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-black">
                                        Chức vụ
                                    </p>
                                    <p className="text-black font-medium">
                                        {userInfo.position || "Nhân viên"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-2xl py-3 text-sm font-semibold uppercase tracking-wide transition bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}

            <div
                className="mt-6 grid gap-3 rounded-2xl border bg-gray-400/50  border-slate-800 p-5 text-sm text-white"
            >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>Quản lý hồ sơ cá nhân</span>
                    <a
                        href="#"
                        className="transition hover:text-blue-300 text-blue-950 font-bold"
                    >
                        Cập nhật
                    </a>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>Chấm công realtime</span>
                    <a
                        href="#"
                        className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                    >
                        Mở bảng công
                    </a>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>KPI và liên kết thi đua</span>
                    <a
                        href="#"
                        className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                    >
                        Xem KPI
                    </a>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>Bảng lương nội bộ</span>
                    <a
                        href="#"
                        className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                    >
                        Tải bảng lương
                    </a>
                </div>
            </div>
        </section>
    );
}
