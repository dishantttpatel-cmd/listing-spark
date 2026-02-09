import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, MapPin, Loader2 } from "lucide-react";

const CATEGORIES = [
  "All",
  "Electronics",
  "Vehicles",
  "Property",
  "Furniture",
  "Fashion",
  "Books",
  "Sports",
  "Services",
  "Other",
];

export default function BrowseListings() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", search, category],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (category !== "All") query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);

      const { data } = await query;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Browse Listings</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : listings.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No listings found. Be the first to post!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link key={listing.id} to={`/listing/${listing.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="aspect-square bg-muted">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-lg">₹{Number(listing.price).toLocaleString("en-IN")}</p>
                  <p className="text-sm line-clamp-1">{listing.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location || "N/A"}
                  </div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {listing.category}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
