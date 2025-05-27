"use client";

import { useState, useRef, useEffect } from "react";
import {
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    fetchResumes();
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
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Resumes</h1>
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <PlusCircleIcon className="h-4 w-4" /> Upload Resume
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Loading resumes...
          </p>
        </div>
      ) : resumes.length === 0 ? (
        <Card className="text-center py-8 sm:py-12 px-4">
          <CardContent className="pt-4 sm:pt-6">
            <h3 className="text-lg font-medium">No resumes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Upload a resume to get started
            </p>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="mt-4 w-full sm:w-auto"
            >
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="relative overflow-hidden shadow-xl border-2 border-primary/60 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl w-full flex flex-col justify-between"
              style={{ height: "auto", minHeight: "350px" }}
            >
              <CardHeader className="pb-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-md md:text-md font-bold truncate text-white flex-1">
                    {resume.original_filename}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Added on:{" "}
                  <span className="font-medium">
                    {formatDate(resume.created_at)}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center p-2">
                <div className="w-full h-[180px] sm:h-[220px] md:h-[250px] rounded-lg overflow-hidden border border-gray-700 bg-black/40 shadow-inner">
                  <PdfThumbnail filename={resume.original_filename} />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 py-4 border-t border-border/40 bg-gray-900/80">
                <Button
                  onClick={() => handleViewResume(resume.download_url)}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto font-semibold border-primary/60 text-primary bg-white/10 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="mr-2">📄</span> View PDF
                </Button>
                <Button
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
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="resume" className="flex items-center">
                PDF File <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? selectedFile.name : "Choose PDF file"}
                </Button>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-2"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Only PDF files are accepted
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
