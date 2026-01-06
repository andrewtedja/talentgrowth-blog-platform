"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface SimpleModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	onConfirm: () => void;
	confirmText?: string;
	cancelText?: string;
	confirmDisabled?: boolean;
}

export function SimpleModal({
	isOpen,
	onClose,
	title,
	description,
	onConfirm,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmDisabled = false,
}: SimpleModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const modalContent = (
		<div
			className="absolute inset-0 z-[9999] flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			{/* Backdrop - click to close */}
			<div
				className="absolute inset-0"
				onClick={onClose}
				style={{ cursor: "default" }}
			/>

			{/* Modal Content */}
			<div
				className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4"
				style={{ zIndex: 1 }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
					<p className="text-sm text-gray-500">{description}</p>
				</div>

				<div className="flex gap-3 justify-end pt-4">
					<button
						type="button"
						onClick={onClose}
						style={{ cursor: "pointer" }}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={confirmDisabled}
						style={{ cursor: confirmDisabled ? "not-allowed" : "pointer" }}
						className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);

	return createPortal(modalContent, document.body);
}
