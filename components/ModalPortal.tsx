import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export function ModalPortal({ children, onClose }: ModalPortalProps) {
    useEffect(() => {
        // Lock scroll khi modal mở
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-end sm:items-center justify-cente p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}