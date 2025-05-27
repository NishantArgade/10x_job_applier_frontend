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
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type JobApplication = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  applicationDate: string;
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
};

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
      accessorKey: "jobTitle",
      header: "Job Title",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("jobTitle")}</div>;
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
      accessorKey: "applicationDate",
      header: "Application Date",
      cell: ({ row }) => {
        return new Date(row.getValue("applicationDate")).toLocaleDateString();
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
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              title="Delete"
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
            ))}

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
    </div>
  );
}

import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [isOpen, setIsOpen] = React.useState(false);

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
