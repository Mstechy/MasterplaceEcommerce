import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingBag, ArrowRight, Shield, Store, Zap, Users, Globe, BarChart3 } from "lucide-react";

const features = [
  { icon: Store, title: "Multi-Vendor Stores", desc: "Sellers get their own storefront with analytics" },
  { icon: Shield, title: "Secure Payments", desc: "Escrow-based transactions for buyer protection" },
  { icon: Zap, title: "AI-Powered", desc: "Smart product imports and fraud detection" },
  { icon: Users, title: "Community Trust", desc: "Verified sellers and transparent reviews" },
  { icon: Globe, title: "Multi-Currency", desc: "Accept payments from anywhere in the world" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track sales, visitors, and performance" },
];

export default function LandingPage() {
  const { user, role } = useAuth();
  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MarketHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={dashboardPath}>
                <Button className="gap-2 gradient-primary text-primary-foreground">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/auth/register">
                  <Button size="sm" className="gradient-primary text-primary-foreground">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center animate-slide-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" /> AI-Powered Multi-Vendor Marketplace
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Buy & Sell with
            <span className="block mt-2" style={{ backgroundImage: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Confidence
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The next-generation marketplace where sellers thrive and buyers shop with complete trust. 
            AI-powered fraud detection, escrow payments, and real-time analytics.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground gap-2 shadow-glow">
                Start Selling <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/40 bg-muted/30 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="mt-3 text-muted-foreground">Built for scale. Designed for trust.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Ready to get started?</h2>
          <p className="mt-4 text-muted-foreground">Join thousands of sellers and buyers on MarketHub today.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MarketHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
