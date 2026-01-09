// components/LoadingBlur.tsx
"use client";

import { useEffect } from "react";

export default function LoadingBlur() {
  // Disable scroll khi loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      style={{ 
        pointerEvents: 'all',
        cursor: 'wait',
        userSelect: 'none'
      }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        
        {/* Text */}
        <p className="text-lg font-semibold text-blue-950">Đang tải...</p>
      </div>
    </div>
  );
}