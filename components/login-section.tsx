"use client"

import { useState } from "react"

export default function LoginSection() {
  const [enableOtp, setEnableOtp] = useState(false)

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-7 lg:p-8">
      <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400 sm:text-sm">Apec ID</div>
      <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Cổng đăng nhập nội bộ</h2>
      <p className="mt-2 text-sm text-slate-400">
        Sử dụng tài khoản Apec ID dùng chung với ERP, HRM và CRM. Xác thực hai lớp bảo vệ dữ liệu và liên kết trực tiếp hồ sơ KPI, chấm công, lương thưởng.
      </p>

      <div className="mt-5 space-y-4 sm:mt-6">
        <input
          type="text"
          placeholder="Email hoặc Apec ID"
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={enableOtp}
              onChange={(event) => setEnableOtp(event.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            Kích hoạt đăng nhập 2 lớp (2FA)
          </label>
          <a href="#" className="text-sm text-blue-400 transition hover:text-blue-300">
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
        <button className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500">
          Đăng nhập
        </button>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>Quản lý hồ sơ cá nhân</span>
          <a href="#" className="text-blue-400 transition hover:text-blue-300">
            Cập nhật
          </a>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>Chấm công realtime</span>
          <a href="#" className="text-blue-400 transition hover:text-blue-300">
            Mở bảng công
          </a>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>KPI và liên kết thi đua</span>
          <a href="#" className="text-blue-400 transition hover:text-blue-300">
            Xem KPI
          </a>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span>Bảng lương nội bộ</span>
          <a href="#" className="text-blue-400 transition hover:text-blue-300">
            Tải bảng lương
          </a>
        </div>
      </div>
    </section>
  )
}
