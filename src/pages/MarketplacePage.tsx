import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function MarketplacePage() {
  const { user, role } = useAuth();

  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">MarketHub</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products, sellers, categories..." className="pl-10 pr-10" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to={dashboardPath}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login"><Button variant="outline" size="sm">Sign In</Button></Link>
                <Link to="/auth/register"><Button size="sm" className="gradient-primary text-primary-foreground">Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        <div className="text-center py-20 animate-slide-up">
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Discover Amazing Products
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of products from verified sellers around the world.
          </p>

          {/* Mobile search */}
          <div className="mt-8 md:hidden max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
          </div>

          <p className="mt-12 text-sm text-muted-foreground">Products will appear here as sellers list them.</p>
        </div>
      </main>
    </div>
  );
}
