"use client"; // Ensures this is a Client Component

import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function FallBackComponent() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or Tailwind's dark mode class on <html>
    const darkModeEnabled =
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      document.documentElement.classList.contains("dark");

    setIsDarkMode(darkModeEnabled);
  }, []);

  return (
    <SkeletonTheme
      baseColor={isDarkMode ? "#2D3748" : "#e0e0e0"} // Dark mode base color
      highlightColor={isDarkMode ? "#4A5568" : "#f5f5f5"} // Dark mode highlight color
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton height={160} borderRadius={8} />
          <Skeleton height={160} borderRadius={8} />
          <Skeleton height={160} borderRadius={8} />
          <Skeleton height={160} borderRadius={8} />
        </div>
        <Skeleton height={160} borderRadius={8} />
      </div>
    </SkeletonTheme>
  );
}

export default FallBackComponent;
