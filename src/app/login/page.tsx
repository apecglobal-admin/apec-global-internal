"use client";

import { loginWeb } from "@/src/services/api";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
    try {
      const payload = {
        email,
        password,
      };

      const res = await dispatch(loginWeb(payload) as any);
      if (res) {
        localStorage.setItem("userToken", res.payload.token);
        router.push("/");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold tracking-wider text-white">
              AG
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-wide text-white mb-2">
            APECGLOBAL
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Empower Future Together
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Đăng nhập</h2>
            <p className="text-sm text-slate-400">Chào mừng bạn quay trở lại</p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@apecglobal.com"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-11 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-11 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-400">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-blue-500 hover:text-blue-400 transition"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
            >
              <LogIn size={18} />
              Đăng nhập
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Chưa có tài khoản?{" "}
              <a
                href="#"
                className="font-semibold text-blue-500 hover:text-blue-400 transition"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>

          {/* <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">Hoặc đăng nhập với</span>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-blue-500 hover:text-white transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-blue-500 hover:text-white transition">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
              </svg>
              Facebook
            </button>
          </div> */}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <a
            href="#"
            className="text-slate-400 hover:text-slate-300 underline transition"
          >
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a
            href="#"
            className="text-slate-400 hover:text-slate-300 underline transition"
          >
            Chính sách bảo mật
          </a>
        </p>
      </div>
    </div>
  );
}
