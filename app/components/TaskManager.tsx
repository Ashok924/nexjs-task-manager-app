"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTasks, createTask, updateTask, deleteTask } from "@/app/actions/task.actions";
import { AddTaskModal } from "./ui/AddTaskModal";
import { DeleteTaskAlert } from "./ui/DeleteTaskAlert";
import { useDebounce } from "@/app/hooks/useDebounce";
import type { Task } from "@/app/utils/types";

interface TaskManagerProps {
  initialTasks: Task[];
}

export function TaskManager({ initialTasks }: TaskManagerProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);


  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  // Fetch tasks with React Query
  const { data: tasks = initialTasks, isFetching: isSearching } = useQuery<Task[]>({
    queryKey: ["tasks", debouncedQuery],
    queryFn: async () => {
      return getTasks(debouncedQuery.trim() ? debouncedQuery : undefined);
    },
    initialData: initialTasks,
  });

  const totalPages = Math.ceil(tasks.length / pageSize);

  // Handle Save (Add or Edit) mutation
  const saveTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, "id">) => {
      if (editingTask) {
        const res = await updateTask(editingTask.id, taskData);
        if (!res.success) throw new Error(res.error || "Failed to update task");
        return res.task;
      } else {
        const res = await createTask(taskData);
        if (!res.success) throw new Error(res.error || "Failed to create task");
        return res.task;
      }
    },
    onMutate: async (taskData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", debouncedQuery] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", debouncedQuery]);

      queryClient.setQueryData<Task[]>(["tasks", debouncedQuery], (old) => {
        if (!old) return [];
        if (editingTask) {
          return old.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t);
        } else {
          return [{ id: Date.now(), ...taskData } as Task, ...old];
        }
      });

      return { previousTasks };
    },
    onError: (error, newTask, context) => {
      // console error removed; global query cache will handle the toast notification
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", debouncedQuery], context.previousTasks);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (!error) {
        toast.success(editingTask ? "Task updated successfully" : "Task created successfully");
      }
    }
  });

  // Handle Delete mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteTask(id);
      if (!res.success) throw new Error(res.error || "Failed to delete task");
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", debouncedQuery] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", debouncedQuery]);

      queryClient.setQueryData<Task[]>(["tasks", debouncedQuery], (old) => {
        return old ? old.filter(t => t.id !== id) : [];
      });

      return { previousTasks };
    },
    onError: (error, id, context) => {
      // console error removed; global query cache will handle the toast notification
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", debouncedQuery], context.previousTasks);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (!error) {
        toast.success("Task deleted successfully");
      }
    }
  });

  const handleSaveTask = async (taskData: Omit<Task, "id">) => {
    await saveTaskMutation.mutateAsync(taskData);
  };

  const openDeleteAlert = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      return deleteTaskMutation.mutateAsync(taskToDelete.id);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Render specific page
  const paginatedTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col w-full h-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Tasks
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage and track your tasks.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:ring-zinc-400 transition-shadow"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300"></div>
              </div>
            )}
          </div>
          <button 
            onClick={openAddModal}
            className="flex-shrink-0 flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white border border-transparent dark:border-zinc-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden flex flex-col">
        {/* Header Grid */}
        <div className="flex-none bg-zinc-50/50 border-b border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800/80 text-sm text-zinc-500 dark:text-zinc-300">
          <div className="flex w-full px-6 py-4">
            <div className="w-[30%] font-medium pr-4">Task</div>
            <div className="w-[15%] font-medium pr-4">Status</div>
            <div className="w-[15%] font-medium pr-4">Priority</div>
            <div className="w-[15%] font-medium pr-4">Due Date</div>
            <div className="w-[25%] font-medium text-right pr-2">Actions</div>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-col relative bg-white dark:bg-zinc-900 text-sm">
          {tasks.length === 0 ? (
                <div className="w-full py-24 flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 mb-4">
                      {searchQuery ? (
                        <svg className="h-8 w-8 text-zinc-400 dark:text-zinc-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                      ) : (
                        <svg className="h-8 w-8 text-zinc-400 dark:text-zinc-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />
                          <rect width="8" height="4" x="8" y="3" rx="1" ry="1" />
                          <path d="M9 14h6" />
                          <path d="M9 18h6" />
                          <path d="M12 11v-4" />
                        </svg>
                      )}
                    </div>
                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {searchQuery ? "No matching tasks found" : "No tasks found"}
                    </p>
                    <p className="mt-1 text-sm max-w-sm dark:text-zinc-400 text-center">
                      {searchQuery 
                        ? `We couldn't find any tasks matching "${searchQuery}". Try adjusting your search.` 
                        : "You haven't added any tasks yet. Create your first task to get started tracking your progress."}
                    </p>
                    {!searchQuery ? (
                      <button 
                        onClick={openAddModal}
                        className="mt-6 flex items-center justify-center gap-2 rounded-md bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-700/50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Create Task
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="mt-6 flex items-center justify-center gap-2 rounded-md bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-700/50"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                paginatedTasks.map((task) => (
                  <div key={task.id} className="flex w-full px-6 py-4 items-center border-b border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="w-[30%] pr-4">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate block w-full">{task.title}</span>
                    </div>
                    <div className="w-[15%] pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        task.status === "done" ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20" :
                        task.status === "in_progress" ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20" :
                        "bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700/50"
                      }`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="w-[15%] capitalize text-zinc-600 dark:text-zinc-400 truncate pr-4">
                      {task.priority}
                    </div>
                    <div className="w-[15%] text-zinc-600 dark:text-zinc-400 truncate pr-4">
                      {task.dueDate}
                    </div>
                    <div className="w-[25%] flex items-center justify-end gap-2 pr-2">
                      <Link 
                        href={`/tasks/${task.id}`}
                        className="p-1 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-950/30 transition-colors"
                        title="View task details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </Link>
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                      </button>
                      <button 
                        onClick={() => openDeleteAlert(task)}
                        className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                        title="Delete task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
        </div>

        {/* Bottom Pagination Controls */}
        {tasks.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Rows per page:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page
                  }}
                  className="text-sm bg-white border border-zinc-200 rounded-md px-2 py-1 text-zinc-900 focus:ring-1 focus:ring-zinc-900 cursor-pointer dark:bg-zinc-900 dark:border-zinc-700/80 dark:text-zinc-100 dark:focus:ring-zinc-400 shadow-sm"
                >
                  {[10, 50, 100, 150, 200].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-400">
              <div>
                Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-zinc-900 dark:text-zinc-100">{Math.min(currentPage * pageSize, tasks.length)}</span> of{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{tasks.length}</span> results
              </div>
              
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white dark:bg-zinc-900" aria-label="Pagination">
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                  title="Previous Page"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-zinc-700 dark:hover:bg-zinc-800 transition-colors"
                  title="Next Page"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <DeleteTaskAlert 
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title || ""}
      />
    </div>
  );
}
