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
  pending: { label: "Pending", variant: "outline" },
  in_progress: { label: "In progress", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
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
      return <Badge variant={status.variant}>{status.label}</Badge>;
    },
  },
];
