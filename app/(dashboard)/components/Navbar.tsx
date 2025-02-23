"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { setUser, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/api/v1/logout");
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex justify-between items-center py-2 px-4 bg-gray-200 dark:bg-gray-900">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white">MyApp</h1>
      <div className="flex items-center gap-4">
        {user && <button onClick={handleLogout}>Logout</button>}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {mounted && theme === "dark" ? (
            <SunIcon className="h-3 w-3" />
          ) : (
            <MoonIcon className="h-3 w-3" />
          )}
        </button>
      </div>
    </nav>
  );
}
