"use client";

import Link from "next/link";
import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });

    if (!newUser.name) {
      setErrors({ ...errors, name: "Name is required" });
      return;
    }

    if (!newUser.email) {
      setErrors({ ...errors, email: "Email is required" });
      return;
    }

    if (!newUser.password) {
      setErrors({ ...errors, password: "Password is required" });
      return;
    }

    if (!newUser.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Confirm password is required" });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const resp = await axiosClient.post("/api/v1/auth/register", {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.confirmPassword,
      });

      router.replace(resp.data?.redirect || "/dashboard");
    } catch (error: any) {
      setErrors({ ...errors, email: error.message });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-4 space-y-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg sm:p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          Create an Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center text-xs">
          Already have an account?{" "}
          <Link href="login" className="text-blue-500 hover:underline">
            Sign in.
          </Link>
        </p>
        <form className="space-y-4 text-xs" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newUser.confirmPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, confirmPassword: e.target.value })
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
