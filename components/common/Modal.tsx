"use client";

import { ReactNode, useEffect } from "react";
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    footer?: ReactNode;
}

export default function Modal({ isOpen, title, children, onClose, footer }: ModalProps) {
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = ""; // Restore background scrolling
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900"
                onClick={(event) => event.stopPropagation()} // Prevent closing when clicking inside the modal
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
                        &times;
                    </Button>
                </div>

                <div className="text-sm text-zinc-700 dark:text-zinc-300">{children}</div>

                <div className="mt-6 flex justify-end gap-2">
                    {footer ?? (
                        <Button variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}