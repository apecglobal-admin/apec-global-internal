// PopupComponent.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { X, Check, AlertTriangle, Info, Heart } from 'lucide-react';

export type PopupType = 'default' | 'success' | 'warning' | 'info' | 'error';

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  type?: PopupType;
  title?: string;
  message?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  showActionButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  className?: string;
}

interface PopupConfig {
  icon: ReactNode;
  title: string;
  message: string;
  bgColor: string;
  borderColor: string;
  buttonColor: string;
}

const PopupComponent: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  type = 'default',
  title,
  message,
  icon,
  showCloseButton = true,
  showActionButtons = true,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  children,
  className = ''
}) => {
  const [animationClass, setAnimationClass] = useState<string>('');

  const getPopupConfig = (): PopupConfig => {
    const configs: Record<PopupType, PopupConfig> = {
      success: {
        icon: <Check className="w-8 h-8 text-green-500" />,
        title: 'Thành công!',
        message: 'Thao tác của bạn đã được thực hiện thành công.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        buttonColor: 'bg-green-500 hover:bg-green-600'
      },
      warning: {
        icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
        title: 'Cảnh báo!',
        message: 'Vui lòng kiểm tra lại thông tin trước khi tiếp tục.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        buttonColor: 'bg-orange-500 hover:bg-orange-600'
      },
      info: {
        icon: <Info className="w-8 h-8 text-blue-500" />,
        title: 'Thông tin',
        message: 'Đây là một thông báo quan trọng bạn nên biết.',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        buttonColor: 'bg-blue-500 hover:bg-blue-600'
      },
      error: {
        icon: <X className="w-8 h-8 text-red-500" />,
        title: 'Lỗi!',
        message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        buttonColor: 'bg-red-500 hover:bg-red-600'
      },
      default: {
        icon: <Heart className="w-8 h-8 text-pink-500" />,
        title: 'Thông báo',
        message: 'Đây là một thông báo.',
        bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
        borderColor: 'border-pink-200',
        buttonColor: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
      }
    };

    return configs[type];
  };

  const closePopup = (): void => {
    setAnimationClass('animate-out');
    setTimeout(() => {
      onClose();
      setAnimationClass('');
    }, 300);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const handleConfirm = (): void => {
    if (onConfirm) {
       onConfirm(); // hỗ trợ API bất đồng bộ
    }
  };

  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      closePopup();
    }
  };

  // Close popup with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        closePopup();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      setAnimationClass('animate-in');
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const config = getPopupConfig();
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayIcon = icon || config.icon;

  return (
    <>
      {/* Popup Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${
          animationClass === 'animate-in' ? 'animate-fade-in' : 
          animationClass === 'animate-out' ? 'animate-fade-out' : ''
        }`}
        onClick={handleOverlayClick}
      >
        {/* Popup Content */}
        <div
          className={`${config.bgColor} ${config.borderColor} border-2 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl backdrop-blur-lg transform transition-all duration-300 relative ${
            animationClass === 'animate-in' ? 'animate-scale-in' : 
            animationClass === 'animate-out' ? 'animate-scale-out' : ''
          } ${className}`}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full p-2 transition-all duration-200"
              aria-label="Đóng popup"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 rounded-full p-4 shadow-lg">
              {displayIcon}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {displayTitle}
            </h3>
            
            {children ? (
              <div className="mb-8">
                {children}
              </div>
            ) : (
              <p className="text-gray-600 mb-8 leading-relaxed">
                {displayMessage}
              </p>
            )}

            {/* Action Buttons */}
            {showActionButtons && (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleConfirm}
                  className={`${config.buttonColor} text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  {cancelText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes scale-out {
          from { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to { 
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-out {
          animation: fade-out 0.3s ease-in;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-scale-out {
          animation: scale-out 0.3s ease-in;
        }
      `}</style>
    </>
  );
};

export default PopupComponent;

// Hook để sử dụng popup dễ dàng hơn
export const usePopup = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popupProps, setPopupProps] = useState<Partial<PopupProps>>({});

  const openPopup = (props?: Partial<PopupProps>) => {
    setPopupProps(props || {});
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setPopupProps({});
  };

  return {
    isOpen,
    openPopup,
    closePopup,
    popupProps
  };
};
