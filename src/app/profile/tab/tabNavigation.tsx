import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function TabNavigation({ activeTab, setActiveTab }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const tabs = [
    { id: "skills", label: "Kỹ năng" },
    { id: "projects", label: "Dự án" },
    { id: "career", label: "Lộ trình" },
    { id: "tasks", label: "Nhiệm vụ" },
    { id: "personal", label: "Cá nhân" },
    { id: "achievements", label: "Thành tích" },
    { id: "card", label: "Thẻ Apec" },
    { id: "link", label: "Liên kết" },
  ];

  // Check scroll position để show/hide arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Scroll sang trái
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll sang phải
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative border-b border-slate-800 mb-6">
      {/* Nút scroll trái */}
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent hover:from-slate-800 transition-all flex items-center justify-start pl-2"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Nút scroll phải */}
      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent hover:from-slate-800 transition-all flex items-center justify-end pr-2"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth px-4"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 sm:px-6 py-4 text-xs sm:text-base font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              initial={{ opacity: 0.7 }}
              animate={{ opacity: activeTab === tab.id ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {tab.label}
            </motion.span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 shadow-lg shadow-blue-500/50"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default TabNavigation;