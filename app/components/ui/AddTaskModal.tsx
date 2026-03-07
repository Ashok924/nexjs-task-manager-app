"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Task } from "@/app/utils/types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => Promise<void> | void;
  initialData?: Task | null;
}

export function AddTaskModal({ isOpen, onClose, onSave, initialData }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || "");
        setStatus(initialData.status);
        setPriority(initialData.priority);
        setDueDate(initialData.dueDate);
      } else {
        setTitle("");
        setDescription("");
        setStatus("todo");
        setPriority("medium");
        setDueDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        title,
        description,
        status,
        priority,
        dueDate,
      });
      onClose();
    } catch (error) {
      // Error is handled globally
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />
        <Dialog.Content 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200"
          aria-describedby="task-modal-description"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/80">
            <Dialog.Title className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {initialData ? "Edit Task" : "Create New Task"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </Dialog.Close>
          </div>
          
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <Dialog.Description id="task-modal-description" className="sr-only">
              Fill out the required information to add or modify a task.
            </Dialog.Description>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Task Title</label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 dark:placeholder-zinc-500 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g. Redesign homepage"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea 
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 dark:placeholder-zinc-500 transition-shadow resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Add more details about this task..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
              <select 
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 transition-shadow appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority</label>
              <select 
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 transition-shadow appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <label htmlFor="dueDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</label>
            <input 
              type="date" 
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 transition-shadow box-border text-[color-scheme:light] dark:text-[color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md transition-colors dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white border border-transparent dark:border-zinc-200"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white dark:text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {initialData ? "Save Changes" : "Save Task"}
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  );
}
