import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import supabase from "@/supabase/supabase-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/user-dashboard/TicketCard";
import { TicketFormDialog } from "@/components/user-dashboard/TicketFormDialog";
import { Plus } from "lucide-react";
import { useRealtimeSubscription } from "../../hooks/useRealtimeSubscription";

export default function UserDashboard() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // 1. Route access control check
  useEffect(() => {
    if (user?.id && user?.id !== userId) {
      toast.add({
        title: "Unauthorized",
        description:
          "You are not authorized to view this page. Redirecting back to your personal dashboard.",
      });
      navigate(`/dashboard/${user.id}`);
    }
  }, [user?.id, userId, navigate]);

  // Check admin role
  useEffect(() => {
    async function checkRole() {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      } catch (err) {
        console.error("Error checking user role:", err.message);
      }
    }
    checkRole();
  }, [user?.id]);

  // 2. Fetch tickets
  const currentUserId = user?.id;
  const fetchTickets = useCallback(async () => {
    if (!currentUserId) return;

    try {
      let query = supabase
        .from("repair_tickets")
        .select(
          `
          *,
          user_profiles ( name )
        `,
        )
        .order("created_at", { ascending: false });

      // If not admin, only fetch current user's tickets
      if (!isAdmin) {
        query = query.eq("user_id", currentUserId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, isAdmin]);

  // 3. Setup Realtime listener & initial fetch
  useEffect(() => {
    if (!user?.id) return;

    // wrap fetchTickets during first render in an async function to avoid race condition
    let isMounted = true;
    const initData = async () => {
      if (isMounted) {
        await fetchTickets();
      }
    };
    initData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, fetchTickets]);

  // Subscribe to Supabase Realtime
  useRealtimeSubscription({
    channelName: `user-tickets-${user?.id}`,
    table: "repair_tickets",
    enabled: !!user?.id,
    onDataChange: fetchTickets,
  });

  // Delete ticket handler
  const handleDelete = async (ticketId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("repair_tickets")
        .delete()
        .eq("id", ticketId);

      if (error) throw error;

      toast.add({
        title: "Success",
        description: "Ticket deleted successfully.",
      });
      fetchTickets();
    } catch (err) {
      toast.add({
        title: "Error",
        description: `Failed to delete ticket: ${err.message}`,
      });
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  // if user id not match, return null (prevent flashing during redirect)
  if (user?.id !== userId) {
    return null;
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user?.name || "User"}&apos;s Personal Repair Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Viewing and managing all system repair tickets."
              : "Track your repair requests or submit a new ticket."}
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="flex items-center gap-2"
          data-testid="create-ticket-btn"
        >
          <Plus className="h-4 w-4" /> Create Ticket
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[50vh] rounded-xl bg-muted/50 p-6">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Loading repair tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No repair tickets found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                currentUserId={user?.id}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {user?.id && (
        <TicketFormDialog
          key={editingTicket ? editingTicket.id : `new-ticket-${isFormOpen}`} // refresh modal on edit mode (based on different ticket id)
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          initialData={editingTicket}
          userId={user.id}
          isAdmin={isAdmin}
          onSuccess={fetchTickets}
        />
      )}
    </div>
  );
}
