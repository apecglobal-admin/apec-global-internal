"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchUserInfo, loginWeb } from "@/src/services/api";
import { Eye, EyeOff, Lock } from "lucide-react";
import { logout, setToken } from "@/src/features/user/userSlice";
import { toast } from "react-toastify";
import { getFcmToken } from "@/src/lib/getFCMToken";

export default function LoginSection() {
    const [enableOtp, setEnableOtp] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();
    const { status, error, userInfo } = useSelector((state: any) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    
    // Refs để focus vào input
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    
    const clearForm = () => {
        setPassword("");
        setEmail("");
        setEmailError(false);
        setPasswordError(false);
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();

        // Reset errors
        setEmailError(false);
        setPasswordError(false);
        
        // Validate inputs
        let hasError = false;
        
        if (!email.trim()) {
            setEmailError(true);
            hasError = true;
            emailRef.current?.focus();
        }
        
        if (!password.trim()) {
            setPasswordError(true);
            hasError = true;
            // Chỉ focus vào password nếu email không có lỗi
            if (!emailError && !email.trim()) {
                passwordRef.current?.focus();
            } else if (email.trim()) {
                passwordRef.current?.focus();
            }
        }
        
        // Nếu có lỗi thì không submit
        if (hasError) {
            return;
        }
        
        try {
            const fcmToken = await getFcmToken();

            const payload = {
                email,
                password,
                fcm_token: fcmToken,
            };

            const res = await dispatch(loginWeb(payload) as any);
            if (res.payload.status === 200) {
                const token = res.payload.data.token;
                dispatch(setToken(token));
                await dispatch(fetchUserInfo(res.payload.data.token) as any);
                toast.success(res.payload.data.message);
            } else{
                toast.error(res.payload.message);
            }
        } catch (error) {
            // console.error("Đăng nhập thất bại:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        dispatch(logout());
    };

    // Reset error khi user nhập lại
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        if (emailError && e.target.value.trim()) {
            setEmailError(false);
        }
    };
    
    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
        if (passwordError && e.target.value.trim()) {
            setPasswordError(false);
        }
    };

    return (
        <section
            className="rounded-3xl  p-6 sm:p-7 lg:p-8 bg-white"
            style={{
                boxShadow: "0 0 10px 2px rgb(169, 169, 170)",
            }}
        >
            <div className="text-xs font-semibold uppercase  text-blue-950 sm:text-sm">
                Apec ID
            </div>

            {!userInfo.data && (
                <>
                    <h2 className="mt-2 text-2xl font-extrabold capitalize text-blue-main sm:text-3xl">
                        Cổng đăng nhập nội bộ
                    </h2>
                    <p className="mt-2 text-sm  text-black ">
                        Sử dụng tài khoản Apec ID dùng chung với ERP, HRM và
                        CRM. Xác thực hai lớp bảo vệ dữ liệu và liên kết trực
                        tiếp hồ sơ KPI, chấm công, lương thưởng.
                    </p>
                    <div className="mt-5 space-y-4 sm:mt-6">
                        <div>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email"
                                className={`w-full rounded-2xl border px-4 py-3 text-sm text-black placeholder:text-black
                focus:outline-none bg-white focus:bg-white transition-colors ${
                    emailError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-slate-400 focus:border-blue-500'
                }`}
                            />
                            {emailError && (
                                <p className="mt-1 text-xs text-red-500">
                                    Vui lòng nhập email
                                </p>
                            )}
                        </div>
                        
                        <div>
                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Mật khẩu"
                                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-black placeholder:text-black
                  focus:outline-none bg-white focus:bg-white transition-colors ${
                      passwordError 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-slate-400 focus:border-blue-500'
                  }`}
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
                            {passwordError && (
                                <p className="mt-1 text-xs text-red-500">
                                    Vui lòng nhập mật khẩu
                                </p>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                            className="w-full rounded-2xl py-3 text-sm font-semibold text-white uppercase  transition bg-active-blue-metallic cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </>
            )}

            {userInfo.data && (
                <div className="mt-6 space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold capitalize text-blue-main sm:text-3xl">
                            Chào mừng quay lại!
                        </h2>
                        <p className="text-xl text-orange-600 font-semibold">
                            {userInfo.data.name}
                        </p>
                        <p className="text-sm text-black">
                            {userInfo.data.email}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <div className="p-4 rounded-xl bg-blue-gradiant-main bg-box-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-black">
                                        Phòng ban
                                    </p>
                                    <p className="text-black font-medium">
                                        {userInfo.data.department || "Chưa cập nhật"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-black">
                                        Chức vụ
                                    </p>
                                    <p className="text-black font-medium">
                                        {userInfo.data.position || "Nhân viên"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-2xl py-3 text-sm font-semibold uppercase  transition bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
            {userInfo.data && (
                <div
                    className="mt-6 grid gap-3 rounded-2xl  bg-blue-gradiant-main bg-box-shadow-inset  p-5 text-sm text-black"
                >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span>Quản lý hồ sơ cá nhân</span>
                        <a
                            href="/profile"
                            className="transition hover:text-blue-300 text-blue-950 font-bold"
                        >
                            Cập nhật
                        </a>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span>Chấm công realtime</span>
                        <a
                            href="/profile"
                            className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                        >
                            Mở bảng công
                        </a>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span>KPI và liên kết thi đua</span>
                        <a
                            href="/profile"
                            className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                        >
                            Xem KPI
                        </a>
                    </div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span>Bảng lương nội bộ</span>
                        <a
                            href="/profile"
                            className="text-blue-400 transition hover:text-blue-300 text-blue-950 font-bold"
                        >
                            Tải bảng lương
                        </a>
                    </div>
                </div>
            )}

        </section>
    );
}