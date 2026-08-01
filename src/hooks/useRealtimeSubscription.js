// hooks/useRealtimeSubscription.js
import { useEffect, useRef } from "react";
import supabase from "@/supabase/supabase-client";

export function useRealtimeSubscription({
  channelName,
  table,
  schema = "public",
  event = "*",
  enabled = true,
  onDataChange,
}) {
  //  useRef: store the latest onDataChange callback to avoid recreating the subscription on every re-render (note: onDataChange is a callback function)
  const savedCallback = useRef(onDataChange);

  // if onDataChange changes, update the savedCallback ref
  useEffect(() => {
    savedCallback.current = onDataChange;
  }, [onDataChange]);

  // supabase realtime subscription and cleanup 
  useEffect(() => {
    if (!enabled) return;

    // create a new channel and subscribe to the specified table changes
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event, schema, table }, (payload) => {
        // call the latest onDataChange callback when a change is received
        if (savedCallback.current) {
          savedCallback.current(payload);
        }
      })
      .subscribe();

    // return cleanup function to remove the subscription when component unmounts or dependencies change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, table, schema, event, enabled]);
}
