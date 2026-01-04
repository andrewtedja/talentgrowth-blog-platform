"use client";

import { useEffect } from "react";

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

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
				onClick={onClose}
			/>

			<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 space-y-4 pointer-events-auto">
				<div className="space-y-2">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
					<p className="text-sm text-gray-500">{description}</p>
				</div>

				<div className="flex gap-3 justify-end pt-4">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
					>
						{cancelText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={confirmDisabled}
						className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
