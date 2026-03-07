"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <aside 
        className={`${isOpen ? "w-64" : "w-16"} flex-shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-950/80 flex flex-col h-full transition-all duration-300 ease-in-out relative`}
      >
        <div className={`flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800/80 ${isOpen ? "px-6" : "justify-center"}`}>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-500 flex-shrink-0"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>
            <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Task Manager</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 flex flex-col">
          {isOpen && <p className="px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 dark:text-zinc-400">Main Menu</p>}
          
          <div className="px-3">
            <Link 
              href="/"
              className={`flex items-center gap-3 py-2 rounded-md font-medium transition-colors ${
                pathname === "/" || pathname === "" 
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-100"
              } ${isOpen ? "px-3" : "justify-center px-0"}`}
              title={!isOpen ? "Tasks" : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className={`transition-opacity duration-300 whitespace-nowrap ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>Tasks</span>
            </Link>
          </div>
        </nav>

        {/* Toggle Button at the bottom */}
        <div className="border-t border-zinc-200 dark:border-zinc-800/80 p-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-center py-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>
      </aside>
    </>
  );
}
