"use client";

import { useState, useRef } from "react";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axiosClient";
import { saveAs } from "file-saver";

const ImportJobsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  const [isProcessingJobs, setIsProcessingJobs] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };  const handleDownloadSample = async () => {
    setIsDownloading(true);
    setError(null);
    
    try {
      const response = await axiosClient.get('/api/v1/sample-jobs-csv', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(blob, 'sample_jobs.csv');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error downloading sample CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProcessJobs = async () => {
    setIsProcessingJobs(true);
    setError(null);
    
    try {
      await axiosClient.post('/api/v1/jobs/process', {});
      
      setProcessSuccess(true);
      setTimeout(() => {
        setProcessSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing jobs. Please try again.');
    } finally {
      setIsProcessingJobs(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("applications_csv", file);
      formData.append("template_id", "1");
      formData.append("resume_id", "2");

      await axiosClient.post("/api/v1/jobs/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
      setFile(null);
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
    <div className="p-6 max-w-4xl mx-auto">      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Import Jobs from CSV
        </h1>        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
                <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
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
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}      {uploadSuccess && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-sm">
          File uploaded successfully!
        </div>
      )}
      
      {processSuccess && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md text-sm">
          Jobs processing initiated successfully!
        </div>
      )}<div className="mt-6 flex justify-between items-center">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Process All Jobs
            </>
          )}
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!file || isLoading}
          className="flex items-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {file ? "Upload CSV" : "Select a file"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImportJobsPage;
