"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  XCircleIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "@/lib/axiosClient";
import { EmptyAutomationIllustration } from "@/components/empty-states";

interface AutomationStatus {
  id: number;
  name: string;
  provider: string;
  type: string;
  status: "active" | "paused" | "error" | "completed";
  lastRun: string | null;
  nextRun: string | null;
  success: number;
  error: number;
}

export default function AutomationPage() {
  const [automations, setAutomations] = useState<AutomationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [startingBots, setStartingBots] = useState<Set<number>>(new Set());
  const [stoppingBots, setStoppingBots] = useState<Set<number>>(new Set());
  // Mock data - in real app, this would come from API
  useEffect(() => {
    async function initializeData() {
      try {
        // Simulate API call
        setTimeout(() => {
          setAutomations([
            {
              id: 1,
              name: "Naukri Profile Updater",
              provider: "naukri",
              type: "update_profile",
              status: "paused",
              lastRun: "2025-06-03T14:30:00",
              nextRun: "2025-06-04T14:30:00",
              success: 24,
              error: 1,
            },
            {
              id: 2,
              name: "Naukri Job Applicator",
              provider: "naukri",
              type: "apply_job",
              status: "paused",
              lastRun: "2025-06-03T09:15:00",
              nextRun: null,
              success: 67,
              error: 2,
            },
          ]);
          setIsLoading(false);
          setInitialLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error initializing data:", error);
        setInitialLoading(false);
      }
    }

    initializeData();
  }, []); const handleStartBot = async (id: number) => {
    try {
      setStartingBots(prev => new Set(prev).add(id));

      // Find the automation to determine which API endpoint to call
      const automation = automations.find(a => a.id === id);
      if (!automation) {
        toast.error("Automation not found");
        return;
      }

      let apiUrl = "";
      if (automation.type === "update_profile") {
        apiUrl = "http://127.0.0.1:8000/bot/start-update-profile";
      } else if (automation.type === "apply_job") {
        apiUrl = "http://127.0.0.1:8000/bot/start-apply-jobs";
      } else {
        toast.error("Unknown automation type");
        return;
      }

      // Call the backend API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state to show bot is running
      setAutomations(
        automations.map((automation) =>
          automation.id === id
            ? { ...automation, status: "active", lastRun: new Date().toISOString() }
            : automation
        )
      );

      toast.success(`${automation.name} started successfully`);
    } catch (error) {
      console.error("Failed to start bot:", error);
      toast.error("Failed to start bot. Please check if the server is running.");
    } finally {
      setStartingBots(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }; const handleStopBot = async (id: number) => {
    try {
      setStoppingBots(prev => new Set(prev).add(id));

      // Find the automation to get its name for the toast message
      const automation = automations.find(a => a.id === id);

      // Call the backend API to stop the bot
      const response = await fetch("http://127.0.0.1:8000/bot/stop", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state to show bot is stopped
      setAutomations(
        automations.map((automation) =>
          automation.id === id
            ? { ...automation, status: "paused" }
            : automation
        )
      );

      toast.success(`${automation?.name || 'Bot'} stopped successfully`);
    } catch (error) {
      console.error("Failed to stop bot:", error);
      toast.error("Failed to stop bot. Please check if the server is running.");
    } finally {
      setStoppingBots(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"; return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">     
     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Automation Bots
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your automated job search and profile update bots
        </p>
      </div>
    </div>      {initialLoading ? (
      <div className="space-y-6">
        {/* Header Skeleton */}
        {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">            <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-80"></div>
          </div>
        </div> */}

        {/* Automation Cards Grid Skeleton */}          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">            {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 border-0 rounded-lg bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-700/50 pt-4">
              <div className="w-full flex gap-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse flex-1"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse flex-1"></div>
              </div>
            </CardFooter>
          </Card>
        ))}
        </div>
      </div>
    ) : isLoading ? (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading automations...</p>
      </div>) : automations.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-blue-200 dark:border-gray-700 space-y-6 max-w-md mx-auto">
            <EmptyAutomationIllustration className="mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Bots Running</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your Naukri automation bots are ready to help you with job applications and profile updates.
              </p>
            </div>
          </div>
        </div>
      ) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {automations.map((automation) => (<Card
          key={automation.id}
          className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-lg bg-white dark:bg-gray-800"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Cog6ToothIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {automation.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {automation.provider} • {automation.type.replace("_", " ")}
                  </CardDescription>
                </div>
              </div>
              {/* <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${automation.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-400"
                      }`}></div>
                    <span className={`text-sm font-medium ${automation.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500"
                      }`}>
                      {automation.status === "active" ? "Running" : "Stopped"}
                    </span>
                  </div> */}
            </div>
          </CardHeader>              <CardContent className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Cog6ToothIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {automation.name === "Naukri Profile Updater"
                      ? "Automatically updates your Naukri profile daily to improve visibility"
                      : "Searches and applies to relevant job postings matching your criteria"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {automation.name === "Naukri Profile Updater"
                      ? "Profile optimization and refresh automation"
                      : "Smart job matching and application submission"}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Run:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(automation.lastRun)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>              <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 pt-4">
            <div className="w-full flex gap-2">
              <Button
                onClick={() => handleStartBot(automation.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading || startingBots.has(automation.id) || stoppingBots.has(automation.id)}
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                {startingBots.has(automation.id) ? "Starting..." : "Start Bot"}
              </Button>
              <Button
                onClick={() => handleStopBot(automation.id)}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50/50 hover:border-red-400 hover:text-red-700 dark:hover:bg-red-900/10"
                disabled={isLoading || startingBots.has(automation.id) || stoppingBots.has(automation.id)}
              >
                <StopIcon className="h-4 w-4 mr-2" />
                {stoppingBots.has(automation.id) ? "Stopping..." : "Stop Bot"}
              </Button>
            </div>
          </CardFooter>
        </Card>
        ))}
      </div>)}
    </div>
  );
}
