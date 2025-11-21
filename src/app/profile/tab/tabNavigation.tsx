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

function TabNavigation({ activeTab, setActiveTab }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "skills", label: "Kỹ năng", icon: <Rocket size={18} /> },
    { id: "projects", label: "Dự án", icon: <Briefcase size={18} /> },
    { id: "career", label: "Lộ trình", icon: <Layers size={18} /> },
    { id: "tasks", label: "Nhiệm vụ", icon: <ListTodo size={18} /> },
    { id: "personal", label: "Cá nhân", icon: <User size={18} /> },
    { id: "achievements", label: "Thành tích", icon: <Award size={18} /> },
    { id: "card", label: "Thẻ Apec", icon: <Home size={18} /> },
    { id: "link", label: "Liên kết", icon: <Link2 size={18} /> },
  ];

  // Chia tab ra 2 nhóm
  const mainTabs = ["tasks", "projects", "career", "personal"];
  const extraTabs = tabs.filter((t) => !mainTabs.includes(t.id));

  return (
    <>
      {/* Desktop giữ nguyên */}
      <div className="hidden md:block border-b border-slate-800 mb-6">
        <div className="flex gap-4 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
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
          {/* Bên trái: 2 tab đầu */}
          <div className="flex gap-4">
            {tabs
              .filter((t) => ["tasks", "projects"].includes(t.id))
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-300 hover:text-black/30"
                  }`}
                >
                  <div className="mb-1">{tab.icon}</div>
                  {tab.label}
                </button>
              ))}
          </div>

          {/* Bên phải: 2 tab còn lại */}
          <div className="flex gap-4">
            {tabs
              .filter((t) => ["career", "personal"].includes(t.id))
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-slate-300 hover:text-black/30"
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
                        setActiveTab(tab.id);
                        setIsOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition-all duration-150 ${
                        activeTab === tab.id
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
