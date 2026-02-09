import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

export function AdminListings() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").update({ status: "removed" as const }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-listings"] });
      toast({ title: "Listing removed" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="max-w-[200px] truncate">{l.title}</TableCell>
              <TableCell>₹{Number(l.price).toLocaleString("en-IN")}</TableCell>
              <TableCell>{l.category}</TableCell>
              <TableCell><Badge variant="secondary">{l.status}</Badge></TableCell>
              <TableCell className="text-xs">{new Date(l.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {l.status !== "removed" && (
                  <Button size="sm" variant="destructive" onClick={() => deleteListing.mutate(l.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
