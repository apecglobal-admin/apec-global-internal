"use client"

import { Bell, ChevronDown, Mail, Search, UserCircle2 } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 lg:gap-6">
          <a href="#" className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold tracking-wider">
              AG
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-wide">APECGLOBAL</div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Empower Future Together</div>
            </div>
          </a>

          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white xl:hidden">
            <Search size={18} />
          </button>

          <nav className="order-3 hidden w-full items-center gap-6 text-sm font-semibold uppercase tracking-wide text-slate-300 xl:order-none xl:flex xl:w-auto">
            <a href="#" className="hover:text-white transition">Trang chủ</a>
            <a href="#" className="hover:text-white transition">Tin tức nội bộ</a>
            <a href="#" className="hover:text-white transition">Dự án</a>
            <a href="#" className="hover:text-white transition">Sự kiện</a>
            <a href="#" className="hover:text-white transition">Chính sách</a>
            <a href="#" className="hover:text-white transition">Thống kê</a>
            <a href="#" className="hover:text-white transition">Thi đua</a>
            <a href="#" className="hover:text-white transition">Trợ giúp</a>
            <a href="#" className="hover:text-white transition">Liên hệ IT</a>
          </nav>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <div className="hidden w-full max-w-sm items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 lg:flex">
              <Search size={18} className="text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm toàn hệ thống"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
              <Bell size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white">
              <Mail size={18} />
            </button>
            <button className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white">
              <UserCircle2 size={24} />
              <span>Tài khoản</span>
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
