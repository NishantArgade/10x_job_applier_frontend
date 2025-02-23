
import { fetchData } from "@/lib/serverApi";

export default async function Dashboard() {
  const response = await fetchData("/api/v1/dashboard");

  return (
    <div>
      <h1>Dashboard</h1>
      <p> Hello, {response.user.name}</p>
    </div>
  );
}
