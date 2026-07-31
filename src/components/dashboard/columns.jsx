// routes/dashboard/columns.jsx
import { Badge } from "@/components/ui/badge";

// format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status color map
const statusMap = {
  pending: {
    label: "Pending",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  in_progress: {
    label: "In progress",
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
};

// Priority color map
const priorityMap = {
  high: {
    label: "High",
    className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  low: {
    label: "Low",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
};

export const columns = [
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => <span>{formatDate(row.getValue("created_at"))}</span>,
  },
  {
    // When doing JOIN query, user_profiles.name will be here
    id: "user_name",
    accessorFn: (row) => row.user_profiles?.name || "Unknown user",
    header: "User name",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statusMap[row.getValue("status")] || {
        label: row.getValue("status"),
        variant: "outline",
      };
      return <Badge className={status.className}>{status.label}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = priorityMap[row.getValue("priority")] || {
        label: row.getValue("priority"),
        variant: "outline",
      };
      return <Badge className={priority.className}>{priority.label}</Badge>;
    },
  },
];
