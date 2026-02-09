import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, MapPin, ArrowLeft, Loader2 } from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select("*").eq("id", id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: seller } = useQuery({
    queryKey: ["seller", listing?.user_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", listing!.user_id)
        .single();
      return data;
    },
    enabled: !!listing?.user_id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return <div className="py-12 text-center text-muted-foreground">Listing not found</div>;
  }

  const phone = listing.contact_number?.replace(/\D/g, "");

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {listing.images?.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {listing.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${listing.title} ${i + 1}`}
              className="w-full rounded-lg object-cover max-h-96"
            />
          ))}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">₹{Number(listing.price).toLocaleString("en-IN")}</h1>
        <h2 className="text-xl mt-1">{listing.title}</h2>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {listing.location || "N/A"}
          <Badge variant="secondary">{listing.category}</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {listing.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            Seller: <strong>{seller?.name || "Unknown"}</strong>
          </p>
          <div className="flex gap-3">
            {phone && (
              <>
                <Button asChild className="flex-1 h-12" variant="outline">
                  <a href={`tel:+91${phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
                <Button asChild className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white">
                  <a
                    href={`https://wa.me/91${phone}?text=${encodeURIComponent(`Hi, I'm interested in your listing: ${listing.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
