import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, SlidersHorizontal, Star, Shield, ArrowRight, Store, Tag, Laptop, Shirt, Gem, BookOpen, Dumbbell, Home as HomeIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AnimatedSection from "@/components/AnimatedSection";
import GradientOrb from "@/components/GradientOrb";
import ThemeToggle from "@/components/ThemeToggle";

import productHeadphones from "@/assets/product-headphones.jpg";
import productWallet from "@/assets/product-wallet.jpg";
import productTshirt from "@/assets/product-tshirt.jpg";
import productTracker from "@/assets/product-tracker.jpg";
import productCoffee from "@/assets/product-coffee.jpg";
import productLamp from "@/assets/product-lamp.jpg";

const categories = [
  { label: "All", icon: Tag, active: true },
  { label: "Electronics", icon: Laptop },
  { label: "Fashion", icon: Shirt },
  { label: "Jewelry", icon: Gem },
  { label: "Books", icon: BookOpen },
  { label: "Sports", icon: Dumbbell },
  { label: "Home", icon: HomeIcon },
];

const placeholderProducts = [
  { name: "Premium Wireless Headphones", price: "$129.99", seller: "TechStore", rating: 4.8, image: productHeadphones, verified: true },
  { name: "Handcrafted Leather Wallet", price: "$59.99", seller: "CraftHouse", rating: 4.9, image: productWallet, verified: true },
  { name: "Organic Cotton T-Shirt", price: "$34.99", seller: "EcoWear", rating: 4.7, image: productTshirt, verified: false },
  { name: "Smart Fitness Tracker", price: "$89.99", seller: "FitTech", rating: 4.6, image: productTracker, verified: true },
  { name: "Artisan Coffee Beans", price: "$24.99", seller: "BeanCo", rating: 4.9, image: productCoffee, verified: true },
  { name: "Minimalist Desk Lamp", price: "$79.99", seller: "LightCraft", rating: 4.8, image: productLamp, verified: false },
];

export default function MarketplacePage() {
  const { user, role } = useAuth();
  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <ShoppingBag className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground hidden sm:block">MarketHub</span>
          </Link>

          <div className="flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products, sellers, categories..." className="pl-10 pr-10 h-11 rounded-xl" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {user ? (
              <Link to={dashboardPath}>
                <Button variant="outline" size="sm" className="gap-2">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login"><Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button></Link>
                <Link to="/auth/register"><Button size="sm" className="gradient-primary text-primary-foreground">Sign Up</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Featured banner */}
        <AnimatedSection variant="fade-up">
          <div className="relative rounded-2xl gradient-primary p-8 md:p-12 overflow-hidden mb-10">
            <GradientOrb color="accent" size="md" className="-top-10 -right-10 opacity-20" />
            <div className="relative z-10 max-w-xl">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Discover Amazing Products
              </h1>
              <p className="mt-3 text-primary-foreground/80">
                Browse thousands of products from verified sellers around the world.
              </p>
              <div className="mt-6 flex items-center gap-4 text-primary-foreground/70 text-sm">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Escrow Protected</span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4" /> Verified Sellers</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Category pills */}
        <AnimatedSection variant="fade-up" delay={100}>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  cat.active
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderProducts.map((product, i) => (
            <AnimatedSection key={product.name} variant="fade-up" delay={i * 80}>
              <div className="group rounded-2xl border border-border/60 bg-card overflow-hidden card-hover cursor-pointer">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {product.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
                      <Shield className="h-3 w-3 text-accent" /> Verified
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full gradient-seller">
                      <Store className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">{product.seller}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-foreground">{product.price}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-seller text-seller" /> {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection variant="fade-up" delay={400}>
          <div className="mt-12 text-center py-8">
            <p className="text-sm text-muted-foreground">
              These are sample products. Real products will appear as sellers list them.
            </p>
            <Link to="/auth/register" className="inline-block mt-4">
              <Button variant="outline" className="gap-2">
                Become a Seller <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
