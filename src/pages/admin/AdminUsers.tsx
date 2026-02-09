import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";

export function AdminUsers() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [creditsToAdd, setCreditsToAdd] = useState<Record<string, string>>({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const addCredits = useMutation({
    mutationFn: async ({ userId, credits, current }: { userId: string; credits: number; current: number }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ listing_credits: current + credits })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Credits added!" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Add Credits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name || "—"}</TableCell>
              <TableCell className="text-xs">{u.email}</TableCell>
              <TableCell className="font-bold">{u.listing_credits}</TableCell>
              <TableCell className="text-xs">{new Date(u.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    placeholder="0"
                    className="w-16 h-8"
                    value={creditsToAdd[u.user_id] ?? ""}
                    onChange={(e) => setCreditsToAdd({ ...creditsToAdd, [u.user_id]: e.target.value })}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const n = parseInt(creditsToAdd[u.user_id] ?? "0");
                      if (n > 0) addCredits.mutate({ userId: u.user_id, credits: n, current: u.listing_credits });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
