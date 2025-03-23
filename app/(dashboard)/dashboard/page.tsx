import { Suspense } from "react";
import { fetchData } from "@/lib/serverApi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ClockIcon,
  PaperAirplaneIcon,
  XCircleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
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

async function DashboardContent() {
  const resp = await fetchData("/api/v1/dashboard");

  function StatsCard({ title, value, iconType, tooltip }: StatItem) {
    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {/* Left Content */}
        <div className="space-y-2">
          <div className="text-gray-600 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase">
            {title}
          </div>
          <div className="text-5xl font-extrabold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
            {value}
          </div>
          {tooltip && (
            <div className="text-gray-500 dark:text-gray-400 text-xs italic opacity-80">
              {tooltip}
            </div>
          )}
        </div>

        {/* Right Icon */}
        <div className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 dark:bg-red-600 text-white rounded-full shadow-md transform scale-100 group-hover:scale-110 transition-transform duration-300">
          {iconMap[iconType || "default"]}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resp?.stats.map((stat: StatItem) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            iconType={stat.iconType}
            tooltip={stat.tooltip}
          />
        ))}
      </div>
      <div>
        <div className="h-28 bg-gray-800 rounded-lg">chart</div>
      </div>
    </div>
  );
}

function FallBackComponent() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
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

export default function Dashboard() {
  return (
    <Suspense fallback={<FallBackComponent />}>
      <DashboardContent />
    </Suspense>
  );
}
