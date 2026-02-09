import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-product", label: "Add Product" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/buy-credits", label: "Buy Credits" },
];

export function TopNav() {
  const { pathname } = useLocation();
  const { signOut, isAdmin, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Package className="h-6 w-6" />
          Marketplace
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors",
                pathname === href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-1",
                pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {profile && (
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Credits: <strong className="text-primary">{profile.listing_credits}</strong>
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
