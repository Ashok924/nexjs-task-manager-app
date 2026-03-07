"use client";

import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface DeleteTaskAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  taskTitle: string;
}

export function DeleteTaskAlert({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteTaskAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handled by global cache/toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <AlertDialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200"
        >
          <AlertDialog.Title className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Delete Task
          </AlertDialog.Title>
          <AlertDialog.Description className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Are you sure you want to delete the task <strong>"{taskTitle}"</strong>? This action cannot be undone.
          </AlertDialog.Description>
          
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button 
                type="button" 
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <button 
              type="button" 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              {isDeleting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
