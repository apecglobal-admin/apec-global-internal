"use client";

import { fetchUserInfo, loginWeb } from "@/src/services/api";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {status, error} = useSelector((state: any) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  useEffect(() => {
    if (status === "succeeded") {
      const token = localStorage.getItem("userToken");
      if(token) {
        dispatch(fetchUserInfo(token as any) as any);
      }
      router.push("/");
    } else if (status === "failed" && error) {
      alert(error);
    }
  }, [status]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log("Đăng nhập với:", { email, password });
    try {
      const payload = {
        email,
        password,
      };

      await dispatch(loginWeb(payload) as any);

    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dbt97thds/image/upload/v1751877069/rzasmzadpuv8tlbdigmh.png"
              alt="APECGLOBAL Logo"
              className="w-60 h-40"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Đăng nhập</h2>
            <p className="text-sm text-slate-600">Chào mừng bạn quay trở lại</p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@apecglobal.com"
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full rounded-lg border-2 border-slate-200 bg-white px-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-600">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
            >
              <LogIn size={18} />
              Đăng nhập
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 underline transition"
          >
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 underline transition"
          >
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
}
