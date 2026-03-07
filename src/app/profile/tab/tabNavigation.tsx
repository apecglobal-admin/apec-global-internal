"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  Award,
  User,
  Layers,
  ListTodo,
  Rocket,
  Link2,
  X,
} from "lucide-react";
import { useProfileData } from "@/src/hooks/profileHook";
import { usePathname, useRouter } from "next/navigation";

function TabNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { permission } = useProfileData();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "skills",        label: "Tổng quát",  icon: <Rocket size={18} />,    path: "/profile/skills" },
    { id: "projects",      label: "Dự án",       icon: <Briefcase size={18} />, path: "/profile/projects" },
    { id: "career",        label: "Lộ trình",    icon: <Layers size={18} />,    path: "/profile/career" },
    { id: "tasks",         label: "Nhiệm vụ",    icon: <ListTodo size={18} />,  path: "/profile/tasks" },
    { id: "event",         label: "Sự kiện",     icon: <User size={18} />,      path: "/profile/event" },
    ...(permission
      ? [{ id: "tasksManager", label: "Quản lý", icon: <ListTodo size={18} />, path: "/profile/manager/task" }]
      : []),
    { id: "caution",       label: "Vi phạm",     icon: <ListTodo size={18} />,  path: "/profile/caution" },
    { id: "personal",      label: "Yêu cầu",     icon: <User size={18} />,      path: "/profile/personal" },
    { id: "achievements",  label: "Thành tích",  icon: <Award size={18} />,     path: "/profile/achievements" },
    { id: "card",          label: "Thẻ Apec",    icon: <Home size={18} />,      path: "/profile/card" },
    { id: "link",          label: "Liên kết",    icon: <Link2 size={18} />,     path: "/profile/link" },
  ];

  const navigate = (path: string) => router.push(path);
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  const mainTabs = ["tasks", "projects", "career", "personal"];
  const extraTabs = tabs.filter((t) => !mainTabs.includes(t.id));

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block border-b border-slate-800 mb-6">
        <div className="flex gap-4 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`relative px-4 py-3 text-sm font-semibold transition ${
                isActive(tab.path)
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-0 flex justify-center items-end z-50">
        {/* Nền đen */}
        <div className="absolute bottom-0 w-full h-16 bg-black/90 backdrop-blur-md rounded-t-3xl border-t border-slate-800" />

        {/* 4 tabs chính chia hai bên */}
        <div className="absolute bottom-0 w-full flex items-center justify-between px-8">
          {/* Bên trái: skills + tasks */}
          <div className="flex gap-4">
            {tabs
              .filter((t) => ["skills", "tasks"].includes(t.id))
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition ${
                    isActive(tab.path)
                      ? "text-white"
                      : "text-slate-300 hover:text-white/30"
                  }`}
                >
                  <div className="mb-1">{tab.icon}</div>
                  {tab.label}
                </button>
              ))}
          </div>

          {/* Bên phải: career + personal */}
          <div className="flex gap-4">
            {tabs
              .filter((t) => ["career", "personal"].includes(t.id))
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition ${
                    isActive(tab.path)
                      ? "text-white"
                      : "text-slate-300 hover:text-white/30"
                  }`}
                >
                  <div className="mb-1">{tab.icon}</div>
                  {tab.label}
                </button>
              ))}
          </div>
        </div>

        {/* Nút giữa */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex items-center justify-center w-16 h-16 mb-6 rounded-full 
bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 
text-white shadow-xl shadow-blue-500/40 border border-blue-400/40 
active:scale-95 transition"
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <img
              src="https://res.cloudinary.com/dbt97thds/image/upload/v1751877069/rzasmzadpuv8tlbdigmh.png"
              height={40}
              width={40}
              alt="logo"
            />
          )}
        </motion.button>

        {/* Popup tabs phụ */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl z-50 p-3"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
              >
                <div className="grid grid-cols-4 gap-3">
                  {extraTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        navigate(tab.path);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition-all duration-150 ${
                        isActive(tab.path)
                          ? "bg-blue-500/90 text-white shadow-md"
                          : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/70"
                      }`}
                      whileTap={{ scale: 0.92 }}
                    >
                      <div className="mb-1">{tab.icon}</div>
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default TabNavigation;