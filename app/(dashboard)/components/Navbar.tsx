"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Navbar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-4 bg-gray-50  dark:bg-gray-900 sticky top-0 w-full  shadow-md z-10">
        <div className="flex items-center gap-4 ">
          <button onClick={toggleSidebar} className="flex items-center gap-2">
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-lg font-bold">10x Job Applier</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex items-center w-full gap-3 p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${
              isOpen ? "justify-start" : "justify-center"
            }`}
          >
            {mounted && theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
