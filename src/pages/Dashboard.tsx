import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Package, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { profile, user } = useAuth();

  const { data: listingsCount = 0 } = useQuery({
    queryKey: ["my-listings-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">
          Welcome{profile?.name ? `, ${profile.name}` : ""}!
        </h1>
        <p className="mt-1 opacity-90">Manage your listings and credits</p>
        <div className="mt-4 flex items-center gap-2 text-3xl font-bold">
          <Sparkles className="h-7 w-7" />
          {profile?.listing_credits ?? 0}
          <span className="text-base font-normal opacity-80">credits remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Package className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{listingsCount}</p>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{profile?.listing_credits ?? 0}</p>
            <p className="text-sm text-muted-foreground">Listing Credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <CreditCard className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground mt-2">Need more credits?</p>
            <Button asChild className="mt-2 w-full" size="sm">
              <Link to="/buy-credits">Buy Pack</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button asChild size="lg" className="h-14 text-base">
          <Link to="/add-product">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Product
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14 text-base">
          <Link to="/my-listings">
            <Package className="mr-2 h-5 w-5" />
            My Listings
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14 text-base">
          <Link to="/buy-credits">
            <CreditCard className="mr-2 h-5 w-5" />
            Buy Listing Pack
          </Link>
        </Button>
      </div>
    </div>
  );
}
