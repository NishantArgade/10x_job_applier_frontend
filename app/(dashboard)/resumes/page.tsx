"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyResumesIllustration } from "@/components/empty-states";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosClient from "@/lib/axiosClient";

interface Resume {
  id: number;
  original_filename: string;
  mime_type: string;
  path: string;
  size: number;
  created_at: string;
  updated_at: string;
  download_url: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/api/v1/resumes");
      setResumes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
      toast.error("Failed to load resumes", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function initializeData() {
      try {
        await fetchResumes();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setInitialLoading(false);
      }
    }

    initializeData();
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are accepted");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are accepted");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (isUploading || !selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("resume", selectedFile);
      const data = await axiosClient.post("/api/v1/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResumes((prevResumes) => [data.data.resume, ...prevResumes]);

      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Failed to upload resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!currentResume || isDeleting) return;

    try {
      setIsDeleting(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      setResumes((prevResumes) =>
        prevResumes.filter((resume) => resume.id !== currentResume.id)
      );

      setIsDeleteDialogOpen(false);
      setCurrentResume(null);
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (resume: Resume) => {
    setCurrentResume(resume);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewResume = (resumePath: string) => {
    window.open(resumePath, "_blank", "noopener,noreferrer");
  };

  const PdfThumbnail = ({ filename }: { filename: string }) => {
    return (
      <div
        className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden"
        style={{ minHeight: "100%" }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-[radial-gradient(#eee_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        {/* PDF Icon */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 transform hover:scale-105 transition-transform duration-300">
          <div className="relative h-16 sm:h-20 md:h-24 w-14 sm:w-16 md:w-20 bg-white dark:bg-gray-700 shadow-lg rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[8px] sm:border-t-[10px] border-r-[8px] sm:border-r-[10px] border-t-red-500 border-r-red-500"></div>
            <div className="absolute top-0 right-0 w-4 sm:w-5 h-4 sm:h-5 bg-red-500 origin-bottom-left rotate-[-45deg] translate-x-[2px] sm:translate-x-[2.5px] translate-y-[-2px] sm:translate-y-[-2.5px]"></div>

            <div className="absolute top-6 sm:top-8 left-2 sm:left-3 right-2 sm:right-3 space-y-1 sm:space-y-1.5">
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-full"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-4/5"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-full"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-2/3"></div>
            </div>

            <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center">
              <p className="text-xs sm:text-sm font-bold text-red-500">PDF</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[150px] sm:max-w-[180px] md:max-w-[220px] px-2 sm:px-4 truncate text-center">
            {filename}
          </p>
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {filename}
          </div>
        </div>

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-full">
          PDF
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-red-500/40 via-red-500 to-red-500/40 dark:from-primary/40 dark:via-primary dark:to-primary/40"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Resumes</h1>
      {resumes.length > 0 && (
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircleIcon className="h-4 w-4" /> Upload Resume
        </Button>
      )}
    </div>{initialLoading ? (
      <div className="space-y-6">
        {/* Resume Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 border-0 rounded-lg bg-white dark:bg-gray-800" style={{ minHeight: "350px" }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-2">                  <div className="w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse flex items-center justify-center">
                <div className="w-16 h-20 bg-gray-300 dark:bg-gray-500 rounded animate-pulse"></div>
              </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 py-4 border-t border-border/40">                  <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full sm:w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-full sm:w-20"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    ) : loading ? (
      <div className="flex flex-col justify-center items-center h-48 sm:h-64">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4 text-sm sm:text-base">
          Loading resumes...
        </p>        </div>) : resumes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl shadow-lg p-8 space-y-6 backdrop-blur-sm border-0">
              <EmptyResumesIllustration className="mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No resumes found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload a resume to get started with your job applications
                </p>
              </div>
              <Button
                onClick={() => setIsUploadDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                Upload Resume
              </Button>
            </div>
          </div>
        ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {resumes.map((resume) => (<Card
          key={resume.id}
          className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.025] border-0 rounded-lg w-full flex flex-col justify-between bg-white dark:bg-gray-800"
          style={{ height: "auto", minHeight: "350px" }}
        >
          <CardHeader className="pb-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">                  <CardTitle className="text-sm sm:text-md md:text-md font-bold truncate text-gray-900 dark:text-white flex-1">
              {resume.original_filename}
            </CardTitle>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Added on:{" "}
              <span className="font-medium">
                {formatDate(resume.created_at)}
              </span>
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-2">
            <div className="w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-inner">
              <PdfThumbnail filename={resume.original_filename} />
            </div>
          </CardContent>              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 py-4 border-t border-border/40 bg-gray-50 dark:bg-gray-750">
            <Button
              onClick={() => handleViewResume(resume.download_url)}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto font-semibold"
            >
              <span className="mr-2">📄</span> View PDF
            </Button>                <Button
              onClick={() => openDeleteDialog(resume)}
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
            >
              <TrashIcon className="h-5 w-5 mr-1" /> Delete
            </Button>
          </CardFooter>
        </Card>
        ))}
      </div>
    )}

      {/* Upload Resume Dialog */}
      <Dialog
        open={isUploadDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isUploading) {
            setIsUploadDialogOpen(false);
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-md" closeDisabled={isUploading}>
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
          </DialogHeader>          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resume" className="flex items-center">
                PDF File <span className="text-destructive ml-1">*</span>
              </Label>

              {/* Hidden file input */}
              <input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                required
              />

              {/* Drag and Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${isDragOver
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : selectedFile
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-4">
                  {selectedFile ? (
                    <>
                      <div className="flex justify-center">
                        <DocumentIcon className="h-12 w-12 text-green-500" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-green-700 dark:text-green-400">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <DocumentArrowUpIcon
                          className={`h-12 w-12 transition-colors duration-200 ${isDragOver ? "text-primary" : "text-gray-400"
                            }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isDragOver ? "Drop your PDF here" : "Drag & drop your PDF"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or <span className="text-primary font-medium">browse files</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Visual feedback overlay */}
                {isDragOver && (
                  <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                    <p className="text-primary font-medium text-lg">Drop PDF here</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Only PDF files are accepted • Max size: 10MB
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isUploading} className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUploadResume}
              disabled={isUploading || !selectedFile}
              className="w-full sm:w-auto"
            >
              {isUploading ? "Uploading..." : "Upload Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resume Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setIsDeleteDialogOpen(false);
        }}
      >
        <DialogContent className="max-w-[90vw] sm:max-w-md" closeDisabled={isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete &quot;{currentResume?.original_filename}
              &quot;? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting} className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteResume}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
