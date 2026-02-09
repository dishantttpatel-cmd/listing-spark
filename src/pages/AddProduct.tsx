import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Loader2, Upload, X } from "lucide-react";

const CATEGORIES = ["Electronics", "Vehicles", "Property", "Furniture", "Fashion", "Books", "Sports", "Services", "Other"];

export default function AddProduct() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contact_number: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    if (profile.listing_credits <= 0) {
      setShowNoCredits(true);
      return;
    }

    setLoading(true);

    // Upload images
    const imageUrls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }
    }

    // Insert listing
    const { error: insertError } = await supabase.from("listings").insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category,
      images: imageUrls,
      location: form.location.trim(),
      contact_number: form.contact_number.trim(),
    });

    if (insertError) {
      toast({ title: "Error", description: insertError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Deduct credit
    await supabase
      .from("profiles")
      .update({ listing_credits: profile.listing_credits - 1 })
      .eq("user_id", user.id);

    await refreshProfile();
    toast({ title: "Product listed!", description: "Your product is now live." });
    navigate("/my-listings");
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Product Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={100}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              maxLength={1000}
            />
            <Input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
              step="0.01"
            />
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Location (City)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              maxLength={50}
            />
            <Input
              placeholder="Contact Number"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
              required
              maxLength={15}
            />

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Images ({images.length}/5)
              </label>
              <div className="flex flex-wrap gap-2">
                {images.map((file, i) => (
                  <div key={i} className="relative h-20 w-20 rounded-md overflow-hidden border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={loading || !form.category}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Product (1 credit)
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showNoCredits} onOpenChange={setShowNoCredits}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No listing credits left</DialogTitle>
            <DialogDescription>
              You have no listing credits remaining. Please buy a listing pack to continue posting.
            </DialogDescription>
          </DialogHeader>
          <Button asChild className="w-full">
            <Link to="/buy-credits">Buy Listing Pack</Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
