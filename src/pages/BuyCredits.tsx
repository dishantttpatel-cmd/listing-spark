import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Star } from "lucide-react";

export default function BuyCredits() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const { data: packs = [], isLoading } = useQuery({
    queryKey: ["listing-packs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("listing_packs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const handleBuy = (packName: string) => {
    toast({
      title: "Payment coming soon",
      description: `Razorpay integration for "${packName}" pack will be enabled shortly.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Buy Listing Credits</h1>
        <p className="text-muted-foreground mt-1">
          You have <strong className="text-primary">{profile?.listing_credits ?? 0}</strong> credits
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {packs.map((pack, i) => (
          <Card
            key={pack.id}
            className={i === 1 ? "border-primary ring-2 ring-primary/20 relative" : ""}
          >
            {i === 1 && (
              <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" /> Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle>{pack.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="flex items-center justify-center gap-1">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{pack.credits}</span>
                <span className="text-muted-foreground">listings</span>
              </div>
              <p className="text-2xl font-bold text-primary">{pack.display_price}</p>
              <p className="text-xs text-muted-foreground">
                ₹{(pack.price_inr / 100 / pack.credits).toFixed(1)}/listing
              </p>
              <Button onClick={() => handleBuy(pack.name)} className="w-full h-12 text-base">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
