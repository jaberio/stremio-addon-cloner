"use client";
import { useEffect, useRef } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type AlertProps = {
    type: "success" | "error";
    message: string;
    onClose: () => void;
};

export default function Alert({ type, message, onClose }: AlertProps) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseRef.current();
        }, 5000);
        return () => clearTimeout(timer);
    }, []); // stable — no re-render loop

    const isSuccess = type === "success";

    return (
        <div
            className="fixed top-4 right-4 z-[100] max-w-sm animate-slide-in-right"
            style={{
                background: isSuccess ? "rgba(16, 185, 129, 0.9)" : "rgba(244, 63, 94, 0.9)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: `1px solid ${isSuccess ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 113, 133, 0.3)"}`,
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <div className="flex items-start space-x-3 p-4">
                <div className="shrink-0 mt-0.5">
                    {isSuccess ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                        <XCircle className="w-5 h-5 text-white" />
                    )}
                </div>
                <p className="text-sm font-medium text-white flex-1">{message}</p>
                <button
                    className="shrink-0 text-white/80 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
