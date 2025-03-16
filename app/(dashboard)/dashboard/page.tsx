import { Suspense } from "react";
import { fetchData } from "@/lib/serverApi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ArrowUpRightIcon, ChartBarIcon } from "@heroicons/react/24/solid";

async function DashboardContent() {
  const response = await fetchData("/api/v1/dashboard");

  function StatsCard({ title, value, icon, delta, tooltip }:any) {
    return (
      <div className="hover:bg-blue-100 bg-blue-50 dark:bg-gray-900 rounded-2xl p-6 shadow-lg dark:shadow-md dark:hover:shadow-lg transition-all flex justify-between items-center relative">
        {/* Left Content */}
        <div className="space-y-1">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium relative">
            {title}
            {tooltip && (
              <div className="absolute left-0 mt-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-md dark:bg-gray-700">
                {tooltip}
              </div>
            )}
          </div>
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="flex items-center gap-2 text-green-500 text-xs font-medium mt-1">
            <ArrowUpRightIcon className="w-3 h-3" />
            <span>{delta}</span>
          </div>
        </div>
        {/* Right Icon */}
        <div className="w-12 h-12 flex items-center justify-center bg-red-500 dark:bg-red-600 text-white rounded-full shadow-md">
          {<ChartBarIcon className="w-6 h-6" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={'Applied Jobs'} value={'242,2'}  delta={'123 delta'} />
        <StatsCard title={'Pending Jobs'} value={'242,2'}  delta={'123 delta'} />
        <StatsCard title={'Interview Schedule'} value={'242,2'}  delta={'123 delta'} />
        <StatsCard title={'Offer Received'} value={'242,2'}  delta={'123 delta'} />
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
