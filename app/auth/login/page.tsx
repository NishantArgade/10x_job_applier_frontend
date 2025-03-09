"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await axiosClient.post("/api/v1/auth/login", {
        email,
        password,
        remember: rememberMe,
      });

      router.push(resp.data?.redirect || "/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-4 space-y-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Welcome back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center text-xs">
          Start your website in seconds. Don’t have an account?{" "}
          <Link href="register" className="text-blue-500 hover:underline">
            Sign up.
          </Link>
        </p>
        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        <form className="space-y-4 text-xs" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-3 h-3 text-blue-500 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
              />
              <label
                htmlFor="remember"
                className="ml-2 text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign in to your account
          </button>
        </form>
        <div className="flex items-center my-4">
          <hr className="w-full border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-gray-600 dark:text-gray-400">or</span>
          <hr className="w-full border-gray-300 dark:border-gray-600" />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <a
            href={`http://127.0.0.1:8000/api/v1/auth/google/redirect`}
            className="flex items-center justify-center w-full px-2 py-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Image
              src="https://www.svgrepo.com/show/355037/google.svg"
              width={16}
              height={16}
              alt="Google Logo"
              className="mr-2"
            />
            Sign in with Google
          </a>
          <a
            href={`http://127.0.0.1:8000/api/v1/auth/github/redirect`}
            className="flex items-center justify-center w-full px-2 py-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Image
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              width={16}
              height={16}
              alt="Git Logo"
              className="mr-2"
            />
            Sign in with Github
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
