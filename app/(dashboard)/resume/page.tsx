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
  name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  download_url: string;
  is_active: boolean;
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
  const [isActive, setIsActive] = useState(true);

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

      //   In a real application, this would be:
      const formData = new FormData();
      formData.append("resume", selectedFile);
      formData.append("is_active", isActive ? "1" : "0");
      const data = await axiosClient.post("/api/v1/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the state with the new resume
      setResumes((prevResumes) => [data.data.resume, ...prevResumes]);

      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setIsActive(true);
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real application, this would be:
      // await axiosClient.delete(`/api/v1/resume/${currentResume.id}`);

      // Simulate successful deletion by removing from our mock data
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
    // Open the resume in a new tab
    window.open(resumePath, "_blank", "noopener,noreferrer");
  };

  const PdfThumbnail = ({ filename }: { filename: string }) => {
    return (
      <div
        className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden"
        style={{ minHeight: "200px" }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] dark:bg-[radial-gradient(#eee_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        {/* PDF Icon */}
        <div className="flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
          <div className="relative h-24 w-20 bg-white dark:bg-gray-700 shadow-lg rounded-sm overflow-hidden border border-gray-300 dark:border-gray-600">
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-red-500 border-r-red-500"></div>
            <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 origin-bottom-left rotate-[-45deg] translate-x-[2.5px] translate-y-[-2.5px]"></div>

            <div className="absolute top-8 left-3 right-3 space-y-1.5">
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-full"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-4/5"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-full"></div>
              <div className="h-0.5 bg-gray-200 dark:bg-gray-500 rounded-full w-2/3"></div>
            </div>

            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="text-sm font-bold text-red-500">PDF</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[220px] px-4 truncate text-center">
            {filename}
          </p>
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {filename}
          </div>
        </div>

        <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-full">
          PDF
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500/40 via-red-500 to-red-500/40 dark:from-primary/40 dark:via-primary dark:to-primary/40"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Button
          onClick={() => setIsUploadDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircleIcon className="h-4 w-4" /> Upload Resume
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium">No resumes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Upload a resume to get started
            </p>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="mt-4"
            >
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="relative overflow-hidden shadow-xl border-2 border-primary/60 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl min-w-[370px] max-w-[420px] min-h-[480px] flex flex-col justify-between"
              style={{ width: "100%", height: "540px" }}
            >
              <CardHeader className="pb-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold truncate text-white flex-1">
                    {resume.name}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Uploaded on:{" "}
                  <span className="font-medium">
                    {formatDate(resume.created_at)}
                  </span>
                </p>
              </CardHeader>{" "}
              <CardContent className="flex-1 flex items-center justify-center p-2">
                <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-700 bg-black/40 shadow-inner">
                  <PdfThumbnail filename={resume.name ?? "pdf name"} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center gap-2 py-4 border-t border-border/40 bg-gray-900/80">
                <Button
                  onClick={() => handleViewResume(resume.download_url)}
                  variant="outline"
                  size="sm"
                  className="font-semibold border-primary/60 text-primary bg-white/10 hover:bg-primary/10 hover:text-primary"
                >
                  <span className="mr-2">📄</span> View PDF
                </Button>
                <Button
                  onClick={() => openDeleteDialog(resume)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
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
          // Only allow closing if not currently uploading
          if (!open && !isUploading) {
            setIsUploadDialogOpen(false);
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" closeDisabled={isUploading}>
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border border-input bg-background text-primary"
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active Resume
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUploadResume}
              disabled={isUploading || !selectedFile}
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
          // Only allow closing if not currently deleting
          if (!open && !isDeleting) setIsDeleteDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" closeDisabled={isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete &quot;{currentResume?.name}
              &quot;? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteResume}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
