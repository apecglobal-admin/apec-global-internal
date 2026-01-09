// components/EmptyState.tsx
import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "Chưa có dữ liệu",
  description = "Hiện tại chưa có thông tin để hiển thị. Vui lòng quay lại sau.",
  showAction = false,
  actionText = "Tải lại",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          {/* Icon với gradient background */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-gradiant-main rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-blue-gradiant-main rounded-full p-8 shadow-lg">
              <Inbox className="w-16 h-16 text-blue-main" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-blue-main mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 max-w-md mb-8 text-lg">
            {description}
          </p>

          {/* Decorative elements */}
          <div className="flex gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Action Button */}
          {showAction && (
            <button
              onClick={onAction}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}