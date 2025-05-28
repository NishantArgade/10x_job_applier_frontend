"use client";

import { useState, useEffect, useCallback } from "react";
import { ServerSideDataTable } from "../components/data-table/server-side-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import axiosClient from "@/lib/axiosClient";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type JobApplication = {
  id: string;
  apply_for: string;
  company: string;
  location: string;
  apply_at: string;
  status:
    | "applied"
    | "interview"
    | "rejected"
    | "offer"
    | "accepted"
    | "expired";
  source: string;
  resume: string;
  cover: string;
  name?: string;
  email?: string;
  phone?: string;
  followup_after_days?: number;
  followup_freq?: number;
  website?: string;
};

const jobSchema = yup.object().shape({
  apply_for: yup.string().required("Job Title is required"),
  company: yup.string().required("Company is required"),
  location: yup.string().required("Location is required"),
  apply_at: yup.string().required("Application Date is required"),
  status: yup.string().required("Status is required"),
  source: yup.string().required("Source is required"),
  website: yup
    .string()
    .url("Website must be a valid URL")
    .nullable()
    .notRequired(),
  name: yup.string().nullable().notRequired(),
  email: yup.string().email("Invalid email").nullable().notRequired(),
  phone: yup.string().nullable().notRequired(),
  followup_after_days: yup.number().nullable().notRequired(),
  followup_freq: yup.number().nullable().notRequired(),
});

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Modal state variables
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<JobApplication>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Rejected", value: "rejected" },
    { label: "Offer", value: "offer" },
    { label: "Accepted", value: "accepted" },
    { label: "Expired", value: "expired" },
  ];

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalCount, setTotalCount] = useState(0);

  // Handle form submission for editing a job application
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobSchema) as any, // type assertion to bypass resolver typing issue
    defaultValues: {
      apply_for: editFormData?.apply_for || "",
      company: editFormData?.company || "",
      location: editFormData?.location || "",
      apply_at: editFormData?.apply_at || "",
      status: editFormData?.status || "applied",
      source: editFormData?.source || "",
      website: editFormData?.website || "",
      name: editFormData?.name || "",
      email: editFormData?.email || "",
      phone: editFormData?.phone || "",
      followup_after_days: editFormData?.followup_after_days ?? undefined,
      followup_freq: editFormData?.followup_freq ?? undefined,
      resume: editFormData?.resume || "",
      cover: editFormData?.cover || "",
      id: editFormData?.id || "",
    },
  });

  useEffect(() => {
    if (isEditDialogOpen && selectedJob) {
      reset(selectedJob);
    }
  }, [isEditDialogOpen, selectedJob, reset]);

  const handleUpdateJob = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      if (!selectedJob?.id) return;
      await axiosClient.put(`/api/v1/jobs/${selectedJob.id}`, data);
      setJobApplications((prev) =>
        prev.map((job) =>
          job.id === selectedJob.id
            ? ({ ...job, ...data } as JobApplication)
            : job
        )
      );
      setIsEditDialogOpen(false);
      setIsSubmitting(false);
    } catch (error: any) {
      // Laravel validation error handling
      if (
        error.response &&
        error.response.status === 422 &&
        error.response.data.errors
      ) {
        const apiErrors = error.response.data.errors;
        Object.keys(apiErrors).forEach((field) => {
          setError(field as keyof typeof errors, {
            type: "server",
            message: apiErrors[field][0],
          });
        });
      }
      setIsSubmitting(false);
    }
  });

  // Handle deleting a job application
  const handleDeleteJob = async () => {
    try {
      setIsSubmitting(true);

      if (!selectedJob?.id) return;

      await axiosClient.delete(`/api/v1/jobs/${selectedJob.id}`);

      // Remove the job application from the local state
      setJobApplications((prev) =>
        prev.filter((job) => job.id !== selectedJob.id)
      );
      setTotalCount((prev) => prev - 1);

      setIsDeleteDialogOpen(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to delete job application:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        params.append("page", String(pagination.pageIndex + 1));
        params.append("limit", String(pagination.pageSize));

        if (debouncedSearchTerm.trim()) {
          params.append("search", debouncedSearchTerm.trim());
        }

        if (selectedStatuses.length > 0) {
          selectedStatuses.forEach((status) => {
            params.append("status[]", status);
          });
        }

        if (selectedSources.length > 0) {
          selectedSources.forEach((source) => {
            params.append("source[]", source);
          });
        }

        const response = await axiosClient.get(
          `/api/v1/jobs?${params.toString()}`
        );

        setJobApplications(response.data.data || []);
        setTotalCount(response.data.total || 0);
      } catch (error) {
        console.error("Failed to fetch job applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobApplications();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    selectedStatuses,
    selectedSources,
  ]);

  const filteredJobs = jobApplications;

  const StatusBadge = ({ status }: { status: JobApplication["status"] }) => {
    const statusConfig = {
      applied: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: ClockIcon,
      },
      interview: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: EyeIcon,
      },
      rejected: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircleIcon,
      },
      offer: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: CheckCircleIcon,
      },
      accepted: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircleIcon,
      },
      expired: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: ClockIcon,
      },
    };

    const Icon = statusConfig[status]?.icon;

    return (
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full border w-fit text-xs font-medium",
          statusConfig[status]?.color
        )}
      >
        {Icon && <Icon className="w-3 h-3" />}
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const columns: ColumnDef<JobApplication>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") =>
            row.toggleSelected(!!value)
          }
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "apply_for",
      header: "Job Title",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("apply_for")}</div>;
      },
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "apply_at",
      header: "Application Date",
      cell: ({ row }) => {
        return new Date(row.getValue("apply_at")).toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />;
      },
    },
    {
      accessorKey: "name",
      header: "Contact Name",
      cell: ({ row }) => {
        return row.getValue("name") || "—";
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return row.getValue("email") || "—";
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return row.getValue("phone") || "—";
      },
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => {
        const value = row.getValue("website");
        return value ? (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {String(value)}
          </a>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "followup_after_days",
      header: "Follow-up After (Days)",
      cell: ({ row }) => {
        return row.getValue("followup_after_days") !== undefined
          ? row.getValue("followup_after_days")
          : "—";
      },
    },
    {
      accessorKey: "followup_freq",
      header: "Follow-up Frequency",
      cell: ({ row }) => {
        return row.getValue("followup_freq") !== undefined
          ? `${row.getValue("followup_freq")} days`
          : "—";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="View"
              onClick={() => {
                setSelectedJob(job);
                setIsViewDialogOpen(true);
              }}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="Edit"
              onClick={() => {
                setSelectedJob(job);
                setEditFormData({ ...job });
                setIsEditDialogOpen(true);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Delete"
              onClick={() => {
                setSelectedJob(job);
                setIsDeleteDialogOpen(true);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10) - 1;
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.getAll("status[]");
    const source = searchParams.getAll("source[]");
    setPagination({
      pageIndex: isNaN(page) ? 0 : page,
      pageSize: isNaN(limit) ? 10 : limit,
    });
    setSearchTerm(search);
    setDebouncedSearchTerm(search);
    setSelectedStatuses(status);
    setSelectedSources(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    const currentParams = new URLSearchParams(window.location.search);

    const pageParamExists = currentParams.has("page");
    if (pageParamExists) {
      params.set("page", String(pagination.pageIndex + 1));
    } else if (pagination.pageIndex > 0) {
      params.set("page", String(pagination.pageIndex + 1));
    }

    const limitParamExists = currentParams.has("limit");
    if (limitParamExists) {
      params.set("limit", String(pagination.pageSize));
    } else if (pagination.pageSize !== 10) {
      params.set("limit", String(pagination.pageSize));
    }
    if (debouncedSearchTerm.trim()) {
      params.set("search", debouncedSearchTerm.trim());
    }
    selectedStatuses.forEach((s) => params.append("status[]", s));
    selectedSources.forEach((s) => params.append("source[]", s));

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentUrl = currentSearch
      ? currentPath + currentSearch
      : currentPath;
    const newFullUrl = newUrl ? currentPath + newUrl : currentPath;

    if (currentUrl !== newFullUrl) {
      router.replace(newUrl ? `?${params.toString()}` : "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    selectedStatuses,
    selectedSources,
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <Button className="w-full md:w-auto">Add New Application</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search by job title, company, location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setDebouncedSearchTerm("");
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              )}
            </div>
            {/* Source Multi-Select Dropdown */}
            {/* <div className="w-56">
              <SourceMultiSelect
                options={sourceOptions}
                selected={selectedSources}
                onChange={setSelectedSources}
              />
            </div> */}
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <div
                key={status.value}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-colors",
                  selectedStatuses.includes(status.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => {
                  setSelectedStatuses((prev) =>
                    prev.includes(status.value)
                      ? prev.filter((s) => s !== status.value)
                      : [...prev, status.value]
                  );
                }}
              >
                <span className="text-sm">{status.label}</span>
                {selectedStatuses.includes(status.value) && (
                  <XCircleIcon className="h-3 w-3" />
                )}
              </div>
            ))}{" "}
            {selectedStatuses.length > 0 && (
              <Button
                variant="ghost"
                className="text-xs h-7 px-2"
                onClick={() => setSelectedStatuses([])}
              >
                Clear status
              </Button>
            )}
          </div>{" "}
          {/* Clear all filters button */}
          {(searchTerm ||
            selectedStatuses.length > 0 ||
            selectedSources.length > 0) && (
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  // Clear all filter states
                  setSearchTerm("");
                  setDebouncedSearchTerm("");
                  setSelectedStatuses([]);
                  setSelectedSources([]);
                  // Reset pagination to defaults
                  setPagination({
                    pageIndex: 0,
                    pageSize: 10,
                  }); // Remove all filters from URL immediately
                  const currentPath = window.location.pathname;

                  // Clear all search params by using the history API directly
                  if (window && window.history) {
                    window.history.replaceState(null, "", currentPath);
                  } else {
                    // Fallback to Next.js router for environments without window
                    router.replace(currentPath, { scroll: false });
                  }
                }}
              >
                <XCircleIcon className="h-4 w-4" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Search Results Summary */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          {searchTerm ||
          selectedStatuses.length > 0 ||
          selectedSources.length > 0 ? (
            <span>
              Found {totalCount} {totalCount === 1 ? "result" : "results"}
              {searchTerm && (
                <>
                  {" "}
                  for "<span className="font-medium">{searchTerm}</span>"
                </>
              )}
              {selectedStatuses.length > 0 && (
                <>
                  {" "}
                  with status:{" "}
                  {selectedStatuses
                    .map((s) => (
                      <span key={s} className="font-medium capitalize">
                        {s}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr] as any)}
                </>
              )}
              {selectedSources.length > 0 && (
                <>
                  {" "}
                  from source{selectedSources.length > 1 ? "s" : ""}:{" "}
                  {selectedSources
                    .map((s) => (
                      <span key={s} className="font-medium">
                        {s}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr] as any)}
                </>
              )}
            </span>
          ) : (
            <span>Showing all {totalCount} job applications</span>
          )}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading job applications...</p>
        </div>
      ) : (
        <ServerSideDataTable
          columns={columns}
          data={filteredJobs}
          pageCount={Math.ceil(totalCount / pagination.pageSize)}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
      {/* View Job Application Dialog */}{" "}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[90vw] max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Job Application Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedJob && (
              <>
                {" "}
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Job Title</Label>
                  <div className="font-medium truncate max-w-[220px]">
                    {selectedJob.apply_for}
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Company</Label>
                  <div className="truncate max-w-[220px]">
                    {selectedJob.company}
                  </div>
                </div>{" "}
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Location</Label>
                  <div className="truncate max-w-[220px]">
                    {selectedJob.location}
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Application Date</Label>
                  <div>
                    {new Date(selectedJob.apply_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Status</Label>
                  <StatusBadge status={selectedJob.status} />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Source</Label>
                  <div className="truncate max-w-[220px]">
                    {selectedJob.source}
                  </div>
                </div>{" "}
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label>Website</Label>
                  {selectedJob.website ? (
                    <a
                      href={selectedJob.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline truncate max-w-[220px] hover:overflow-visible hover:text-clip"
                    >
                      {selectedJob.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
                {selectedJob.resume && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Resume</Label>
                    <div className="truncate max-w-[200px]">
                      {selectedJob.resume}
                    </div>
                  </div>
                )}{" "}
                {selectedJob.cover && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Cover Letter</Label>
                    <div className="truncate max-w-[200px]">
                      {selectedJob.cover}
                    </div>
                  </div>
                )}{" "}
                {/* New fields */}
                {selectedJob.name && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Contact Name</Label>
                    <div className="truncate max-w-[220px]">
                      {selectedJob.name}
                    </div>
                  </div>
                )}
                {selectedJob.email && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Email</Label>
                    <div className="truncate max-w-[220px]">
                      {selectedJob.email}
                    </div>
                  </div>
                )}
                {selectedJob.phone && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Phone</Label>
                    <div className="truncate max-w-[220px]">
                      {selectedJob.phone}
                    </div>
                  </div>
                )}{" "}
                {selectedJob.followup_after_days !== undefined && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Follow-up After (Days)</Label>
                    <div className="truncate max-w-[220px]">
                      {selectedJob.followup_after_days}
                    </div>
                  </div>
                )}
                {selectedJob.followup_freq !== undefined && (
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label>Follow-up Frequency</Label>
                    <div className="truncate max-w-[220px]">
                      {selectedJob.followup_freq} days
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Job Application Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md max-h-[90vh] overflow-y-scroll"
          closeDisabled={isSubmitting}
        >
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apply_for">Job Title</Label>
              <Input
                id="apply_for"
                {...register("apply_for")}
                className={errors.apply_for ? "border-red-500" : ""}
              />
              {errors.apply_for && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apply_for.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                {...register("company")}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apply_at">Application Date</Label>
              <Input
                id="apply_at"
                type="date"
                {...register("apply_at")}
                className={errors.apply_at ? "border-red-500" : ""}
              />
              {errors.apply_at && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.apply_at.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={errors.status ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                {...register("source")}
                className={errors.source ? "border-red-500" : ""}
              />
              {errors.source && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.source.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register("website")}
                className={errors.website ? "border-red-500" : ""}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followup_after_days">
                Follow-up After (Days)
              </Label>
              <Input
                id="followup_after_days"
                type="number"
                {...register("followup_after_days")}
                className={errors.followup_after_days ? "border-red-500" : ""}
              />
              {errors.followup_after_days && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.followup_after_days.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="followup_freq">Follow-up Frequency (Days)</Label>
              <Input
                id="followup_freq"
                type="number"
                {...register("followup_freq")}
                className={errors.followup_freq ? "border-red-500" : ""}
              />
              {errors.followup_freq && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.followup_freq.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdateJob} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Job Application Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setIsDeleteDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md" closeDisabled={isSubmitting}>
          <DialogHeader>
            <DialogTitle>Delete Job Application</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this job application for{" "}
              <span className="inline-block truncate max-w-[300px] align-bottom">
                {selectedJob?.apply_for} at {selectedJob?.company}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteJob}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>{" "}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// SourceMultiSelect component
interface SourceMultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function SourceMultiSelect({
  options,
  selected,
  onChange,
}: SourceMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full min-w-[180px] justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selected.length === 0
            ? "Filter by source"
            : `${selected.length} source${selected.length > 1 ? "s" : ""}`}
        </span>
        <span className="shrink-0 opacity-50">
          {isOpen ? (
            <ChevronUp className="ml-2 h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
          )}
        </span>
      </Button>
      {isOpen && (
        <div className="absolute top-full mt-1 z-50 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No sources
              </div>
            )}
            {options.map((option) => (
              <div
                key={option.value}
                onClick={(e) => handleSelect(e, option.value)}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {selected.includes(option.value) && (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </span>
                <span className="flex-1">{option.label}</span>
              </div>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                className="w-full justify-center text-xs font-medium text-destructive hover:text-destructive"
                onClick={() => {
                  onChange([]);
                  setIsOpen(false);
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
