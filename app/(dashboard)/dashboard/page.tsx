"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import {
  ClockIcon,
  PaperAirplaneIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

type StatItem = {
  key: string;
  title: string;
  value: string;
  iconType?: string; // Received from backend
  tooltip?: string;
};

// Mapping backend `iconType` to actual Heroicons
const iconMap: Record<string, React.ReactNode> = {
  clock: <ClockIcon className="w-7 h-7" />, // Pending
  "paper-plane": <PaperAirplaneIcon className="w-7 h-7" />, // Sent
  "x-circle": <XCircleIcon className="w-7 h-7" />, // Failed
  "chat-bubble": <ChatBubbleLeftRightIcon className="w-7 h-7" />, // Recruiter Replies
  default: <ChartBarIcon className="w-7 h-7" />, // Default icon
};

// Background colors and gradients for each stat type
const statBackgrounds: Record<string, string> = {
  clock: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30",
  "paper-plane": "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30",
  "x-circle": "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
  "chat-bubble": "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
  default: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30",
};

// Icon colors for each stat type
const statIconColors: Record<string, string> = {
  clock: "bg-orange-500 dark:bg-orange-600",
  "paper-plane": "bg-green-500 dark:bg-green-600",
  "x-circle": "bg-red-500 dark:bg-red-600",
  "chat-bubble": "bg-blue-500 dark:bg-blue-600",
  default: "bg-gray-500 dark:bg-gray-600",
};

// App features data
const appFeatures = [
  {
    id: 1,
    title: "Smart Job Import",
    description: "Import jobs from multiple platforms with intelligent parsing and categorization.",
    icon: <ArrowDownTrayIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    hoverColor: "group-hover:from-blue-600 group-hover:to-blue-700",
    stats: "10+ Sources",
    href: "/import-jobs"
  },
  {
    id: 2,
    title: "Job Management",
    description: "Organize, track, and manage all your job applications in one centralized dashboard.",
    icon: <BriefcaseIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-green-500 to-green-600",
    hoverColor: "group-hover:from-green-600 group-hover:to-green-700",
    stats: "Complete Tracking",
    href: "/jobs"
  },
  {
    id: 3,
    title: "Resume Builder",
    description: "Create professional resumes with customizable templates and real-time preview.",
    icon: <DocumentTextIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    hoverColor: "group-hover:from-purple-600 group-hover:to-purple-700",
    stats: "Multiple Templates",
    href: "/resumes"
  },
  {
    id: 4,
    title: "Smart Templates",
    description: "Pre-built email templates for follow-ups, cover letters, and professional communication.",
    icon: <ClipboardDocumentListIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    hoverColor: "group-hover:from-orange-600 group-hover:to-orange-700",
    stats: "Ready to Use",
    href: "/templates"
  },
  {
    id: 5,
    title: "Automation Bots",
    description: "Automate profile updates and job applications with intelligent bots.",
    icon: <CogIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-red-500 to-red-600",
    hoverColor: "group-hover:from-red-600 group-hover:to-red-700",
    stats: "24/7 Active",
    href: "/automation"
  },
  {
    id: 6,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations and insights to improve your job search success.",
    icon: <SparklesIcon className="w-8 h-8" />,
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    hoverColor: "group-hover:from-indigo-600 group-hover:to-indigo-700",
    stats: "Smart Analytics",
    href: "/dashboard"
  }
];

export default function Dashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/v1/dashboard");
        setStats(response.data?.stats || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  function StatsCard({ title, value, iconType, tooltip }: StatItem) {
    const backgroundClass = statBackgrounds[iconType || "default"];
    const iconColorClass = statIconColors[iconType || "default"];

    return (
      <div className={`group relative ${backgroundClass} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        {/* Fade background pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-4 right-4 transform rotate-12 scale-150">
            {iconMap[iconType || "default"]}
          </div>
          <div className="absolute bottom-4 left-4 transform -rotate-12 scale-125 opacity-50">
            {iconMap[iconType || "default"]}
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 scale-200 opacity-30">
            {iconMap[iconType || "default"]}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Left Content */}
          <div className="space-y-2">
            <div className="text-gray-600 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase">
              {title}
            </div>            <div className="text-5xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
              {value}
            </div>
            {tooltip && (
              <div className="text-gray-500 dark:text-gray-400 text-xs italic opacity-80">
                {tooltip}
              </div>
            )}
          </div>

          {/* Right Icon */}
          <div className={`absolute top-4 right-4 flex items-center justify-center w-12 h-12 ${iconColorClass} text-white rounded-xl shadow-lg transform scale-100 group-hover:scale-110 transition-all duration-300`}>
            {iconMap[iconType || "default"]}
          </div>
        </div>
      </div>
    );
  }
  function FeatureCard({ title, description, icon, color, hoverColor, stats, href }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    hoverColor: string;
    stats: string;
    href: string;
  }) {
    const handleClick = () => {
      router.push(href);
    }; return (
      <div
        onClick={handleClick}
        className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transform hover:-translate-y-2 min-h-[140px] relative overflow-hidden"
      >
        {/* Background gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex items-start space-x-4">
          <div className={`${color} ${hoverColor} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
            {icon}
          </div>
          <div className="flex-1 space-y-2">            <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {title}
            </h3>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300">
              {stats}
            </span>
          </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>

            {/* Click indicator */}
            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 mt-2">
              <span>Click to explore →</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 space-y-8 mt-2">        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-pulse overflow-hidden"
          >
            {/* Skeleton fade background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded transform rotate-12 scale-150"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded transform -rotate-12 scale-125"></div>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}</div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse min-h-[140px]"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 space-y-8 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat: StatItem) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
            tooltip={stat.tooltip}
          />))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <SparklesIcon className="w-4 h-4" />
            <span>Everything you need for job success</span>
          </div>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              hoverColor={feature.hoverColor}
              stats={feature.stats}
              href={feature.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
