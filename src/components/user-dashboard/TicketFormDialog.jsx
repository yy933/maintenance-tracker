import { useState } from "react";
import supabase from "@/supabase/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TicketFormDialog({
  open,
  onOpenChange,
  initialData = null, // add new ticket => null, edit ticket => object
  userId,
  isAdmin = false,
  onSuccess,
}) {
  const isEditing = !!initialData; // turn into boolean
  const [loading, setLoading] = useState(false);

  // form state
 const [title, setTitle] = useState(initialData?.title || "");
 const [description, setDescription] = useState(initialData?.description || "");
 const [status, setStatus] = useState(initialData?.status || "pending");
 const [priority, setPriority] = useState(initialData?.priority || "medium");

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // when user update status from 'pending' to something else, ask for confirmation
    if (
      !isAdmin &&
      isEditing &&
      initialData.status === "pending" &&
      status !== "pending"
    ) {
      const confirmChange = window.confirm(
        "Once you update the status to something other than 'pending', you won't be able to update the ticket again. Are you sure you want to continue?",
      );
      if (!confirmChange) return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        // edit ticket mode
        const { error } = await supabase
          .from("repair_tickets")
          .update({
            title,
            description,
            status,
            priority,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        // add new ticket mode
        const { error } = await supabase.from("repair_tickets").insert([
          {
            title,
            description,
            status: "pending", // default status: pending
            priority,
            user_id: userId,
          },
        ]);

        if (error) throw error;
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to submit the ticket:", err.message);
      alert("Fail to submit the ticket: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Ticket" : "Add New Ticket"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit your ticket details."
              : "Add details about your repair issue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Air conditioner is not working"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low </SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status： absent during add ticket mode. only display during edit ticket mode or when user is admin */}
          {isEditing && (
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={!isAdmin && initialData?.status !== "pending"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submitted"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
