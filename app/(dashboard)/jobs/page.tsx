"use client"

import { useState, useEffect } from "react"
import { DataTable } from "../components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import axiosClient from "@/lib/axiosClient"
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

// Define the job application type
type JobApplication = {
  id: string
  jobTitle: string
  company: string
  location: string
  applicationDate: string
  status: "applied" | "interview" | "rejected" | "offer" | "accepted" | "expired"
  source: string
  resume: string
  cover: string
}

export default function JobsPage() {
  const [loading, setLoading] = useState(true)
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([])
  const [globalFilter, setGlobalFilter] = useState("")
  
  // Status options for filtering
  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Rejected", value: "rejected" },
    { label: "Offer", value: "offer" },
    { label: "Accepted", value: "accepted" },
    { label: "Expired", value: "expired" }
  ]
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  
  useEffect(() => {
    // In a real application, fetch data from your API
    const fetchJobApplications = async () => {
      try {
        setLoading(true)
        
        // Comment this out and use mock data for now
        // const response = await axiosClient.get("/api/v1/jobs")
        // const data = response.data
        
        // Use mock data for now
        const mockData: JobApplication[] = [
          {
            id: "1",
            jobTitle: "Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            applicationDate: "2025-04-15",
            status: "applied",
            source: "LinkedIn",
            resume: "resume_1.pdf",
            cover: "cover_1.pdf"
          },
          {
            id: "2",
            jobTitle: "Backend Engineer",
            company: "DataSystems",
            location: "New York, NY",
            applicationDate: "2025-04-10",
            status: "interview",
            source: "Indeed",
            resume: "resume_2.pdf",
            cover: "cover_2.pdf"
          },
          {
            id: "3",
            jobTitle: "Full Stack Developer",
            company: "Innovate Inc",
            location: "Austin, TX",
            applicationDate: "2025-04-05",
            status: "rejected",
            source: "Company Website",
            resume: "resume_3.pdf",
            cover: "cover_3.pdf"
          },
          {
            id: "4",
            jobTitle: "DevOps Engineer",
            company: "CloudTech",
            location: "Seattle, WA",
            applicationDate: "2025-04-01",
            status: "offer",
            source: "Referral",
            resume: "resume_4.pdf",
            cover: "cover_4.pdf"
          },
          {
            id: "5",
            jobTitle: "UI/UX Designer",
            company: "Creative Solutions",
            location: "Los Angeles, CA",
            applicationDate: "2025-03-25",
            status: "accepted",
            source: "LinkedIn",
            resume: "resume_5.pdf",
            cover: "cover_5.pdf"
          },
          {
            id: "6",
            jobTitle: "Product Manager",
            company: "ProductFirst",
            location: "Chicago, IL",
            applicationDate: "2025-03-20",
            status: "expired",
            source: "Indeed",
            resume: "resume_6.pdf",
            cover: "cover_6.pdf"
          },
          {
            id: "7",
            jobTitle: "Data Scientist",
            company: "DataMinds",
            location: "Boston, MA",
            applicationDate: "2025-03-15",
            status: "interview",
            source: "LinkedIn",
            resume: "resume_7.pdf",
            cover: "cover_7.pdf"
          },
          {
            id: "8",
            jobTitle: "Mobile Developer",
            company: "AppWorks",
            location: "Denver, CO",
            applicationDate: "2025-03-10",
            status: "applied",
            source: "Glassdoor",
            resume: "resume_8.pdf",
            cover: "cover_8.pdf"
          },
          {
            id: "9",
            jobTitle: "QA Engineer",
            company: "QualityFirst",
            location: "Portland, OR",
            applicationDate: "2025-03-05",
            status: "interview",
            source: "Company Website",
            resume: "resume_9.pdf",
            cover: "cover_9.pdf"
          },
          {
            id: "10",
            jobTitle: "Systems Architect",
            company: "ArchSystems",
            location: "Atlanta, GA",
            applicationDate: "2025-03-01",
            status: "applied",
            source: "Linkedin",
            resume: "resume_10.pdf",
            cover: "cover_10.pdf"
          },
        ]
        
        setJobApplications(mockData)
        
      } catch (error) {
        console.error("Failed to fetch job applications:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobApplications()
  }, [])
  
  // Filter jobs based on selected statuses
  const filteredJobs = selectedStatuses.length > 0
    ? jobApplications.filter(job => selectedStatuses.includes(job.status))
    : jobApplications
  
  // Status badge component
  const StatusBadge = ({ status }: { status: JobApplication["status"] }) => {
    const statusConfig = {
      applied: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: ClockIcon
      },
      interview: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: EyeIcon
      },
      rejected: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircleIcon
      },
      offer: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: CheckCircleIcon
      },
      accepted: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircleIcon
      },
      expired: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: ClockIcon
      }
    }
    
    const Icon = statusConfig[status].icon
    
    return (
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full border w-fit text-xs font-medium",
        statusConfig[status].color
      )}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </div>
    )
  }
  
  // Table columns configuration
  const columns: ColumnDef<JobApplication>[] = [
    {
      id: "select",      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
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
        return (
          <div className="font-medium">{row.getValue("jobTitle")}</div>
        )
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
        return new Date(row.getValue("applicationDate")).toLocaleDateString()
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />
      },
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const job = row.original
        
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" title="View">
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" title="Edit">
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Delete">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <Button className="w-full md:w-auto">Add New Application</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">          <Input 
            placeholder="Search by job title, company, location..." 
            value={globalFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            className="max-w-md"
          />
          
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
                  )
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
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading job applications...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredJobs}
          searchKey="jobTitle"
          searchPlaceholder="Filter by job title..."
        />
      )}
    </div>
  )
}
