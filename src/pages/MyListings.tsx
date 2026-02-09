import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, CheckCircle } from "lucide-react";

export default function MyListings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "sold" | "removed" }) => {
      const { error } = await supabase.from("listings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-listings"] });
      toast({ title: "Updated!" });
    },
  });

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    sold: "bg-blue-100 text-blue-800",
    removed: "bg-red-100 text-red-800",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Listings</h1>

      {listings.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">You haven't posted any listings yet.</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{listing.title}</p>
                  <p className="text-sm font-semibold">₹{Number(listing.price).toLocaleString("en-IN")}</p>
                  <Badge className={statusColors[listing.status] ?? ""} variant="secondary">
                    {listing.status}
                  </Badge>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {listing.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus.mutate({ id: listing.id, status: "sold" })}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {listing.status !== "removed" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateStatus.mutate({ id: listing.id, status: "removed" })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
