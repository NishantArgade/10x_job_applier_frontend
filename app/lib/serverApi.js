import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const createServerApi = () => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("XSRF-TOKEN")?.value || "";

  return axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookieStore.toString(),
      ...(authToken ? { "X-XSRF-TOKEN": authToken } : {}),
    },
  });
};

export const fetchData = async (endpoint) => {
  try {
    const serverApi = createServerApi();
    const response = await serverApi.get(endpoint);
    return response.data;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      redirect("/auth/login");
    }

    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export const postData = async (endpoint, data) => {
  try {
    const serverApi = createServerApi();
    const response = await serverApi.post(endpoint, data);
    return response.data;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      redirect("/auth/login");
    }

    throw new Error(error.response?.data?.message || "An error occurred");
  }
};
