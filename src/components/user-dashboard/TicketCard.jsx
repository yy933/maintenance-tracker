import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusMap, priorityMap } from "../dashboard/columns"; 

export function TicketCard({
  ticket,
  currentUserId,
  isAdmin,
  onEdit,
  onDelete,
}) {
  // User can only modify their own tickets when status === 'pending', while admin can modify any
  const canModify =
    isAdmin ||
    (ticket.user_id === currentUserId && ticket.status === "pending");

  const statusInfo = statusMap[ticket.status] || {
    label: ticket.status,
    className: "bg-muted text-muted-foreground",
  };
  const priorityInfo = priorityMap[ticket.priority] || {
    label: ticket.priority,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {ticket.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
            <Badge className={priorityInfo.className}>
              {priorityInfo.label}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          {isAdmin && ticket.user_profiles?.name && (
            <span className="font-semibold text-foreground">
              {ticket.user_profiles.name} •{" "}
            </span>
          )}
          {new Date(ticket.created_at).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2 text-sm text-muted-foreground">
        <p className="whitespace-pre-wrap line-clamp-3">
          {ticket.description || "No details provided."}
        </p>
      </CardContent>

      <CardFooter className="pt-3 flex justify-end gap-2 border-t">
        {canModify ? (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit(ticket)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(ticket.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            You are not authorized to modify this ticket.
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
