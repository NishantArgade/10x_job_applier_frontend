"use client";

import React from "react";
import axiosClient from "@/lib/axiosClient";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  HomeIcon,
  BriefcaseIcon,
  IdentificationIcon,
  ArrowLeftEndOnRectangleIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import BotIcon from "./BotIcon";

const SidebarItem = ({
  icon,
  text,
  href,
  isOpen,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  isOpen: boolean;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center w-full gap-4 p-2 rounded transition-colors
        ${isOpen ? "justify-start" : "justify-center"}
        ${isActive
          ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          : "hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
    >
      {icon}
      <span
        className={`overflow-hidden text-base ${isOpen ? "opacity-100 w-auto" : "hidden w-0"
          }`}
      >
        {text}
      </span>
    </Link>
  );
};

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axiosClient.post(
        "/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`flex flex-col border-r dark:border-gray-800 shadow-md border-gray-200 fixed left-0 top-0 h-full transition-[width] ${isOpen
          ? "duration-300 w-full md:w-64"
          : "duration-0 w-20  hidden md:flex"
        }`}
    >
      {/* Header */}      <div className="flex items-center gap-2 py-2 px-4 p-0 border-b dark:border-gray-800 border-gray-200">
        <SidebarItem
          icon={<IdentificationIcon className="w-5 h-5" />}
          text="Nishant"
          href="/profile"
          isOpen={isOpen}
        />
        <div className="md:hidden block">
          <button onClick={toggleSidebar} className="flex items-center gap-2 ">
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}      <nav className="flex flex-col px-4 py-2 gap-3 h-screen overflow-y-auto">
        <SidebarItem
          icon={<HomeIcon className="w-5 h-5" />}
          text="Dashboard"
          href="/dashboard"
          isOpen={isOpen}
        />        <SidebarItem
          icon={<ArrowDownTrayIcon className="w-5 h-5" />}
          text="Import Jobs"
          href="/import-jobs"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<BriefcaseIcon className="w-5 h-5" />}
          text="Jobs"
          href="/jobs"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<ClipboardDocumentListIcon className="w-5 h-5" />}
          text="Templates"
          href="/templates"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<DocumentTextIcon className="w-5 h-5" />}
          text="Resumes"
          href="/resumes"
          isOpen={isOpen}
        />        <SidebarItem
          icon={<BotIcon className="w-5 h-5" />}
          text="Automation"
          href="/automation"
          isOpen={isOpen}
        />
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-3 py-2 px-4 border-t dark:border-gray-800 border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full gap-3 p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${isOpen ? "justify-start" : "justify-center"
            }`}
        >
          <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
          <span className={`${isOpen ? "opacity-100 w-auto" : "hidden w-0"}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
