"use client"; 
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosClient;
