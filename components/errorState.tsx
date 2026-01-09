// components/ErrorScreen.tsx
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
  title?: string;
  description?: string;
  errors?: string[];
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
  showDetails?: boolean;
}

export default function ErrorScreen({
  title = "Không thể tải dữ liệu",
  description = "Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau hoặc liên hệ bộ phận IT nếu lỗi vẫn tiếp diễn.",
  errors = [],
  showAction = true,
  actionText = "Tải lại trang",
  onAction,
  showDetails = false,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
          {/* Icon với gradient background */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-8 shadow-lg">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 max-w-md mb-8 text-lg">
            {description}
          </p>

          {/* Error Details */}
          {showDetails && errors.length > 0 && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl max-w-md">
              <p className="text-sm font-semibold text-red-800 mb-2">Chi tiết lỗi:</p>
              <ul className="text-xs text-red-600 text-left space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Decorative elements */}
          <div className="flex gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>

          {/* Action Button */}
          {showAction && (
            <button
              onClick={onAction || (() => window.location.reload())}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}