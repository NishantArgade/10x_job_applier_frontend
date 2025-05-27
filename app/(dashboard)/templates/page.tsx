"use client";

import { useState, useEffect } from "react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "@/lib/axiosClient";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import RichTextEditor from "../components/RichTextEditor";

interface Template {
  id: number;
  name: string;
  subject: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [viewTemplate, setViewTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/api/v1/templates");
      setTemplates(response.data.templates);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast.error("Failed to load templates", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async () => {
    if (isCreating) return;

    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!formData.body.trim()) {
      toast.error("Template body is required");
      return;
    }

    try {
      setIsCreating(true);
      await axiosClient.post("/api/v1/template", formData);
      setIsCreateDialogOpen(false);
      setFormData({ name: "", subject: "", body: "" });
      toast.success("Template created successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to create template:", error);
      toast.error("Failed to create template");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!currentTemplate || isUpdating) return;

    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!formData.body.trim()) {
      toast.error("Template body is required");
      return;
    }

    try {
      setIsUpdating(true);
      await axiosClient.put(`/api/v1/template/${currentTemplate.id}`, formData);
      setIsEditDialogOpen(false);
      setCurrentTemplate(null);
      setFormData({ name: "", subject: "", body: "" });
      toast.success("Template updated successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!currentTemplate || isDeleting) return;

    try {
      setIsDeleting(true);
      await axiosClient.delete(`/api/v1/template/${currentTemplate.id}`);
      setIsDeleteDialogOpen(false);
      setCurrentTemplate(null);
      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (template: Template) => {
    setCurrentTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject || "",
      body: template.body,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (template: Template) => {
    setCurrentTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const openViewDialog = (template: Template) => {
    setViewTemplate(template);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircleIcon className="h-4 w-4" /> Create Template
        </Button>
      </div>{" "}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create a new template to get started
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4"
            >
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="overflow-hidden  relative shadow-xl border-2 border-primary/60 dark:bg-gradient-to-br  dark:from-gray-900  dark:via-gray-800  dark:to-gray-900 rounded-2xl transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl w-full flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                {" "}
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-200">
                    {template.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-sm mt-2">
                  {template.subject && (
                    <div className="font-medium text-primary dark:text-primary truncate">
                      {template.subject}
                    </div>
                  )}
                  {/* <div className="text-muted-foreground mt-1 text-xs">
                    Last updated: {formatDate(template.updated_at)}
                  </div> */}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-1">
                <div
                  className="line-clamp-6 text-muted-foreground text-sm leading-relaxed mt-2"
                  dangerouslySetInnerHTML={{ __html: template.body }}
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-2 border-t border-border/40   dark:bg-gradient-to-br  dark:from-gray-900  dark:via-gray-900  dark:to-gray-800">
                {" "}
                <Button
                  onClick={() => openViewDialog(template)}
                  variant="ghost"
                  size="sm"
                  className="group/view flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-1 group-hover/view:text-primary" />{" "}
                  View
                </Button>
                <Button
                  onClick={() => openEditDialog(template)}
                  variant="ghost"
                  size="sm"
                  className="group/edit flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1 group-hover/edit:text-primary" />{" "}
                  Edit
                </Button>
                <Button
                  onClick={() => openDeleteDialog(template)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-1"
                >
                  <TrashIcon className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Create Template Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isCreating) setIsCreateDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" closeDisabled={isCreating}>
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center">
                Template Name <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter template name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter email subject (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body" className="flex items-center">
                Template Body <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="h-[200px] overflow-y-auto">
                <RichTextEditor
                  value={formData.body}
                  setValue={(value: string) =>
                    setFormData({ ...formData, body: value })
                  }
                />
              </div>
            </div>
          </div>{" "}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreateTemplate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Template Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isUpdating) setIsEditDialogOpen(false);
        }}
      >
        <DialogContent
          className="sm:max-w-md max-h-[90vh] overflow-y-hidden"
          closeDisabled={isUpdating}
        >
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="flex items-center">
                Template Name <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter template name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter email subject (optional)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-body" className="flex items-center">
                Template Body <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="h-[200px] overflow-y-auto">
                <RichTextEditor
                  value={formData.body}
                  setValue={(value: string) =>
                    setFormData({ ...formData, body: value })
                  }
                />
              </div>
            </div>
          </div>{" "}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdating}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateTemplate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
      {/* Delete Template Confirmation Dialog */}{" "}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setIsDeleteDialogOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" closeDisabled={isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete &quot;{currentTemplate?.name}
              &quot;? This action cannot be undone.
            </p>
          </div>{" "}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* View Template Dialog */}{" "}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[700px] w-full max-h-[90vh] overflow-y-hidden">
          <DialogHeader>
            <DialogTitle>{viewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="mb-2 text-primary font-medium text-base">
            {viewTemplate?.subject}
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            Last updated:{" "}
            {viewTemplate ? formatDate(viewTemplate.updated_at) : ""}
          </div>
          <div
            className="prose max-w-none text-foreground h-[300px] overflow-y-auto p-4 border rounded-md"
            dangerouslySetInnerHTML={{ __html: viewTemplate?.body || "" }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
