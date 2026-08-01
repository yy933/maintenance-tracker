import { useEffect, useState, useCallback } from "react";
import supabase from "../../supabase/supabase-client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useRealtimeSubscription } from "../../hooks/useRealtimeSubscription";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("repair_tickets")
        .select(`*, user_profiles ( name )`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const initData = async () => {
      await fetchTickets();
    };

    initData();
  }, [fetchTickets]);

  // Subscribe to Supabase Realtime
  useRealtimeSubscription({
    channelName: "repair-tickets-change",
    table: "repair_tickets",
    onDataChange: fetchTickets,
  });

  if (loading) {
    return <div className="p-4 text-muted-foreground ">Loading data...</div>;
  }

  return (
    <div className="space-y-4 p-6 pt-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of repair tickets.
        </p>
      </div>

      <DataTable columns={columns} data={tickets} />
    </div>
  );
}
