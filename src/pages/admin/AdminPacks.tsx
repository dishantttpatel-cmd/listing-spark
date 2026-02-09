import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export function AdminPacks() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [edits, setEdits] = useState<Record<string, { price: string; credits: string }>>({});

  const { data: packs = [], isLoading } = useQuery({
    queryKey: ["admin-packs"],
    queryFn: async () => {
      const { data } = await supabase.from("listing_packs").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const updatePack = useMutation({
    mutationFn: async ({ id, price_inr, credits, display_price }: { id: string; price_inr: number; credits: number; display_price: string }) => {
      const { error } = await supabase.from("listing_packs").update({ price_inr, credits, display_price }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-packs"] });
      toast({ title: "Pack updated!" });
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packs.map((p) => {
            const edit = edits[p.id];
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-20 h-8"
                    defaultValue={p.credits}
                    onChange={(e) =>
                      setEdits({
                        ...edits,
                        [p.id]: { ...edits[p.id], credits: e.target.value, price: edits[p.id]?.price ?? String(p.price_inr / 100) },
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    className="w-20 h-8"
                    defaultValue={p.price_inr / 100}
                    onChange={(e) =>
                      setEdits({
                        ...edits,
                        [p.id]: { ...edits[p.id], price: e.target.value, credits: edits[p.id]?.credits ?? String(p.credits) },
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    disabled={!edit}
                    onClick={() => {
                      if (!edit) return;
                      const priceRupees = parseFloat(edit.price);
                      updatePack.mutate({
                        id: p.id,
                        price_inr: Math.round(priceRupees * 100),
                        credits: parseInt(edit.credits),
                        display_price: `₹${Math.round(priceRupees)}`,
                      });
                    }}
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
