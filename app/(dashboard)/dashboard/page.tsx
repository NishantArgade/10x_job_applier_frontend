import { fetchData } from "@/lib/serverApi";

export default async function Dashboard() {
  const response = await fetchData("/api/v1/dashboard");

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg col-span-1 md:col-span-2 lg:col-span-3"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg col-span-1 md:col-span-2 lg:col-span-3"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg col-span-1 md:col-span-2 lg:col-span-3"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg"></div>
        <div className="h-40 bg-gray-800 rounded-lg col-span-1 md:col-span-2 lg:col-span-3"></div>
      </div>
    </div>
  );
}
