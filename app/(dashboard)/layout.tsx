"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden text-gray-800 dark:text-white bg-gray-50  dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`flex flex-col w-full ${isSidebarOpen ? "ml-64 hidden md:block" : "ml-0 md:ml-20"}`}
      >
        <Navbar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 p-4 dark:bg-gray-900 h-screen overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
