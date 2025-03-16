import { fetchData } from "@/lib/serverApi";

export default async function DashboardContent() {
  const response = await fetchData("/api/v1/dashboard");

  return (
    <div>
      <h1>Dashboard</h1>
      <div>{JSON.stringify(response)}</div>
    </div>
  );
}
