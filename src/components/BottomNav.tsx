import { Home, PlusCircle, Package, CreditCard, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Browse" },
  { href: "/add-product", icon: PlusCircle, label: "Add" },
  { href: "/my-listings", icon: Package, label: "Listings" },
  { href: "/buy-credits", icon: CreditCard, label: "Credits" },
  { href: "/dashboard", icon: User, label: "Dashboard" },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
              pathname === href
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
