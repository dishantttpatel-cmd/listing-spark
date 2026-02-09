import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function AdminTransactions() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Razorpay ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No transactions yet</TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                <TableCell>₹{(t.amount_paise / 100).toFixed(0)}</TableCell>
                <TableCell className="font-bold">+{t.credits_added}</TableCell>
                <TableCell><Badge variant="secondary">{t.payment_status}</Badge></TableCell>
                <TableCell className="text-xs">{t.razorpay_payment_id ?? "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
