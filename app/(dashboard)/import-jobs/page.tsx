"use client";

import { useState, useRef, useEffect } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";
import { saveAs } from "file-saver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ImportJobsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingJobs, setIsProcessingJobs] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New states for resume and template selection
  const [resumes, setResumes] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  
  // Dialog open states
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Fetch resumes and templates on component mount
  useEffect(() => {
    fetchResumes();
    fetchTemplates();
  }, []);
  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const response = await axiosClient.get("/api/v1/resumes");
      // Check the structure of the response and ensure we're setting an array
      const resumesData = response.data?.resumes || response.data || [];
      setResumes(Array.isArray(resumesData) ? resumesData : []);
      console.log("Resumes response:", response.data);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setIsLoadingResumes(false);
    }
  };
  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await axiosClient.get("/api/v1/templates");
      // Check the structure of the response and ensure we're setting an array
      const templatesData = response.data?.templates || response.data || [];
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      console.log("Templates response:", response.data);
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type == "text/csv") {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please select a CSV file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please drop a CSV file");
      }
    }
  };
  const handleDownloadSample = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/api/v1/sample-jobs-csv", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      saveAs(blob, "sample_jobs.csv");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error downloading sample CSV. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProcessJobs = async () => {
    setIsProcessingJobs(true);
    setError(null);

    try {
      await axiosClient.post("/api/v1/jobs/process", {});

      setProcessSuccess(true);
      setTimeout(() => {
        setProcessSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error processing jobs. Please try again."
      );
    } finally {
      setIsProcessingJobs(false);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!file || !selectedTemplate || !selectedResume) {
        setError("Please select a file, template, and resume before uploading");
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append("applications_csv", file);
      formData.append("template_id", selectedTemplate.id);
      formData.append("resume_id", selectedResume.id);      await axiosClient.post("/api/v1/jobs/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
      // Reset file and selections after successful upload
      setFile(null);
      setSelectedResume(null);
      setSelectedTemplate(null);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error uploading file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Import Jobs from CSV
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Upload a CSV file to batch import jobs. The CSV should include columns
          for job title, company, and other relevant information.
        </p>
        <div className="mt-2">
          <Button
            onClick={handleDownloadSample}
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 h-auto flex items-center"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Download Sample CSV
              </>
            )}
          </Button>
        </div>
      </div>
      <div
        className={`
          border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
          transition-all duration-300 bg-white dark:bg-gray-800 
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600"
          }
          ${file ? "border-green-500 dark:border-green-600" : ""}
          hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full w-16 h-16 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <DocumentArrowUpIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {file ? file.name : "Drag and drop your CSV file here"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {file
                ? `File size: ${(file.size / 1024).toFixed(2)} KB`
                : "or click to browse (CSV only)"}
            </p>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".csv,.xlsx"
          onChange={handleFileSelect}
          ref={fileInputRef}
        />{" "}
      </div>{" "}      {/* Resume and Template Selection Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
          <DialogTrigger asChild>
            <div
              className={`
              rounded-lg p-6 cursor-pointer shadow-sm
              transition-all duration-300 bg-white dark:bg-gray-800
              ${
                selectedResume
                  ? "ring-2 ring-blue-500 dark:ring-blue-400"
                  : "border border-gray-200 dark:border-gray-700"
              }
              hover:shadow-md dark:hover:shadow-gray-800/30 flex items-center justify-between
            `}
            >
              {" "}              <div className="flex items-center justify-between gap-6 w-full">
                <div className="flex items-center flex-1 space-x-4">
                  <div
                    className={`
                    rounded-full w-12 h-12 flex items-center justify-center
                    ${
                      selectedResume
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }
                  `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 ${
                        selectedResume
                          ? "text-blue-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedResume ? selectedResume.name : "Select Resume"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedResume
                        ? "Click to change resume"
                        : "Choose the resume to use for job applications"}
                    </p>
                  </div>
                </div>                <div className="flex items-center space-x-2">
                  {selectedResume && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setSelectedResume(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Reset selection"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedResume ? (
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogTrigger>          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Resume</DialogTitle>              <DialogDescription>
                Choose the resume you want to use for job applications
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4">
              {isLoadingResumes ? (
                <div className="flex justify-center p-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No resumes found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(resumes) && resumes.length > 0 ? (                    resumes.map((resume) => (                      <div
                        key={resume?.id || Math.random().toString()}
                        onClick={() => {
                          setSelectedResume(resume);
                          setResumeDialogOpen(false);
                        }}
                        className={`
                        p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          selectedResume?.id === resume?.id
                            ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }
                        ${
                          selectedResume?.id === resume?.id
                            ? "border border-blue-200 dark:border-blue-700"
                            : "border border-gray-200 dark:border-gray-700"
                        }
                      `}
                      >
                        <div className="flex items-center">
                          <div
                            className={`
                            mr-4 w-10 h-10 rounded-md flex items-center justify-center
                            ${
                              selectedResume?.id === resume?.id
                                ? "bg-blue-100 dark:bg-blue-800/50"
                                : "bg-gray-100 dark:bg-gray-700"
                            }
                          `}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-6 h-6 ${
                                selectedResume?.id === resume?.id
                                  ? "text-blue-500"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {resume?.name || "Untitled Resume"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {resume?.updated_at
                                ? `Last updated: ${new Date(
                                    resume.updated_at
                                  ).toLocaleDateString()}`
                                : "No update date"}
                            </p>
                          </div>
                          {selectedResume?.id === resume?.id && (
                            <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No resumes available
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Create a resume in the Resume section first
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>{" "}            <DialogFooter className="sm:justify-end">
              <Link
                href="/resumes"
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Manage Resumes
              </Link>
            </DialogFooter>
          </DialogContent>        </Dialog>{" "}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogTrigger asChild>
            <div
              className={`
              rounded-lg p-6 cursor-pointer shadow-sm
              transition-all duration-300 bg-white dark:bg-gray-800
              ${
                selectedTemplate
                  ? "ring-2 ring-blue-500 dark:ring-blue-400"
                  : "border border-gray-200 dark:border-gray-700"
              }
              hover:shadow-md dark:hover:shadow-gray-800/30 flex items-center justify-center
            `}
            >
              {" "}
              <div className="flex items-center justify-between gap-4  w-full">
                <div className="flex items-center flex-1 space-x-4">
                  <div
                    className={`
                    rounded-full w-12 h-12 flex items-center justify-center
                    ${
                      selectedTemplate
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }
                  `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 ${
                        selectedTemplate
                          ? "text-blue-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedTemplate
                        ? selectedTemplate.name
                        : "Select Template"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedTemplate
                        ? "Click to change template"
                        : "Choose the template for job applications"}
                    </p>
                  </div>
                </div>                <div className="flex items-center space-x-2">
                  {selectedTemplate && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setSelectedTemplate(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Reset selection"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {selectedTemplate ? (
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogTrigger>          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Template</DialogTitle>              <DialogDescription>
                Choose the template you want to use for job applications
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4">
              {isLoadingTemplates ? (
                <div className="flex justify-center p-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No templates found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(templates) && templates.length > 0 ? (
                    templates.map((template) => (                      <div
                        key={template?.id || Math.random().toString()}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setTemplateDialogOpen(false);
                        }}
                        className={`
                        p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          selectedTemplate?.id === template?.id
                            ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }
                        ${
                          selectedTemplate?.id === template?.id
                            ? "border border-blue-200 dark:border-blue-700"
                            : "border border-gray-200 dark:border-gray-700"
                        }
                      `}
                      >
                        <div className="flex items-center">
                          <div
                            className={`
                            mr-4 w-10 h-10 rounded-md flex items-center justify-center
                            ${
                              selectedTemplate?.id === template?.id
                                ? "bg-blue-100 dark:bg-blue-800/50"
                                : "bg-gray-100 dark:bg-gray-700"
                            }
                          `}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`w-6 h-6 ${
                                selectedTemplate?.id === template?.id
                                  ? "text-blue-500"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {template?.name || "Untitled Template"}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {template?.description || "No description"}
                            </p>
                          </div>
                          {selectedTemplate?.id === template?.id && (
                            <div className="bg-blue-100 dark:bg-blue-800/30 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                        />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No templates available
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Create a template in the Templates section first
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>{" "}            <DialogFooter className="sm:justify-end">
              <Link
                href="/templates"
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Manage Templates
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}
      {uploadSuccess && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-sm">
          File uploaded successfully!
        </div>
      )}
      {processSuccess && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-sm">
          Jobs processing initiated successfully!
        </div>
      )}
      <div className="mt-6 flex justify-between items-center">
        <Button
          onClick={() => handleProcessJobs()}
          variant="outline"
          className="flex items-center"
          disabled={isProcessingJobs}
        >
          {isProcessingJobs ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing jobs...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Process All Jobs
            </>
          )}
        </Button>{" "}
        <Button
          onClick={handleSubmit}
          disabled={!file || !selectedResume || !selectedTemplate || isLoading}
          className={cn("flex items-center", {
            "opacity-50 cursor-not-allowed": !file || !selectedResume || !selectedTemplate,
            "opacity-100 cursor-pointer": file && selectedResume && selectedTemplate
          })}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              <span>Upload</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImportJobsPage;
