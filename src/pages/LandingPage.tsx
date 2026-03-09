import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedSection from "@/components/AnimatedSection";
import StatsCounter from "@/components/StatsCounter";
import GradientOrb from "@/components/GradientOrb";
import {
  ShoppingBag, ArrowRight, Shield, Store, Zap, Users, Globe, BarChart3,
  CheckCircle2, Lock, Star, Award, Headphones, TrendingUp, ShoppingCart,
  UserPlus, Search, CreditCard, Quote
} from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";

const features = [
  { icon: Store, title: "Multi-Vendor Stores", desc: "Sellers get their own storefront with real-time analytics and inventory management" },
  { icon: Shield, title: "Secure Escrow", desc: "Every transaction is protected with built-in escrow for buyer & seller safety" },
  { icon: Zap, title: "AI-Powered Tools", desc: "Smart product imports, fraud detection, and automated pricing recommendations" },
  { icon: Users, title: "Community Trust", desc: "Verified sellers, transparent reviews, and reputation scoring system" },
  { icon: Globe, title: "Global Reach", desc: "Multi-currency support with buyers and sellers from around the world" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track sales, visitors, conversions, and performance in real time" },
];

const steps = [
  { icon: UserPlus, title: "Create Account", desc: "Sign up as a seller or buyer in seconds", number: "01" },
  { icon: Search, title: "List or Browse", desc: "Sellers list products, buyers discover them", number: "02" },
  { icon: CreditCard, title: "Secure Transaction", desc: "Pay with confidence through escrow protection", number: "03" },
];

const stats = [
  { value: 10000, suffix: "+", label: "Active Sellers" },
  { value: 100000, suffix: "+", label: "Products Listed" },
  { value: 1, prefix: "$", suffix: "M+", label: "Transactions" },
  { value: 4.9, suffix: "", label: "Average Rating", decimals: 1 },
];

const testimonials = [
  { name: "Sarah Chen", role: "Seller", quote: "MarketHub transformed my side hustle into a full-time business. The analytics alone are worth it.", avatar: "SC" },
  { name: "James Okafor", role: "Buyer", quote: "Finally a marketplace where I feel safe shopping. Escrow protection gives me total peace of mind.", avatar: "JO" },
  { name: "Maria Silva", role: "Seller", quote: "The AI tools helped me price my products competitively. My sales tripled in the first month.", avatar: "MS" },
];

const trustBadges = [
  { icon: Lock, label: "SSL Encrypted" },
  { icon: Shield, label: "Escrow Protected" },
  { icon: Award, label: "Verified Sellers" },
  { icon: Headphones, label: "24/7 Support" },
];

export default function LandingPage() {
  const { user, role } = useAuth();
  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MarketHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={dashboardPath}>
                <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login"><Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button></Link>
                <Link to="/auth/register">
                  <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <GradientOrb color="primary" size="xl" className="-top-40 -right-40 opacity-40" />
        <GradientOrb color="accent" size="lg" className="top-20 -left-20 opacity-30" />
        <GradientOrb color="seller" size="md" className="bottom-0 right-1/4 opacity-20" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection variant="fade-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm text-primary">
                <Zap className="h-4 w-4" />
                <span className="font-medium">AI-Powered Multi-Vendor Marketplace</span>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={100}>
              <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
                Buy & Sell with
                <span className="block mt-2 gradient-text">Confidence</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={200}>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The next-generation marketplace where sellers thrive and buyers shop with complete trust.
                AI-powered fraud detection, escrow payments, and real-time analytics.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground gap-2 shadow-glow text-base px-8 py-6">
                    Start Selling Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-border/60 hover:bg-muted">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Trust row */}
            <AnimatedSection variant="fade-up" delay={400}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                {trustBadges.map((b) => (
                  <div key={b.label} className="flex items-center gap-2">
                    <b.icon className="h-4 w-4 text-accent" />
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Hero dashboard image */}
          <AnimatedSection variant="fade-up" delay={500} className="mt-16 max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/30">
              <img
                src={heroDashboard}
                alt="MarketHub dashboard showing analytics, product management and sales data"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/40 bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} variant="fade-up" delay={i * 100}>
                <div className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    <StatsCounter end={s.value} prefix={s.prefix || ""} suffix={s.suffix} decimals={s.decimals || 0} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="container">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for scale. Designed for trust. Powered by AI.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} variant="fade-up" delay={i * 80}>
                <div className="group relative rounded-2xl border border-border/60 bg-card p-8 card-hover">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 border-y border-border/40 relative overflow-hidden">
        <GradientOrb color="primary" size="lg" className="-bottom-40 -left-40 opacity-20" />

        <div className="container relative z-10">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Three simple steps to get started</p>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number} variant="fade-up" delay={i * 150}>
                <div className="relative text-center group">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow group-hover:scale-105 transition-transform duration-300">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 md:right-4 font-display text-6xl font-bold text-primary/10">{step.number}</span>
                  <h3 className="font-display text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Role showcase */}
      <section className="py-24 md:py-32">
        <div className="container">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Built for <span className="gradient-text-seller">Sellers</span> & <span className="gradient-text-buyer">Buyers</span>
            </h2>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            <AnimatedSection variant="fade-left" delay={0}>
              <div className="relative rounded-2xl border border-seller/20 bg-card p-8 overflow-hidden card-hover">
                <div className="absolute top-0 left-0 w-full h-1 gradient-seller" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-seller mb-6">
                  <Store className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">For Sellers</h3>
                <ul className="space-y-3">
                  {["Your own branded storefront", "Real-time sales analytics", "AI-powered pricing tools", "Secure wallet & payouts", "Promotional ad tools"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-seller shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth/register" className="mt-6 inline-block">
                  <Button className="gradient-seller text-primary-foreground gap-2 mt-2">
                    Start Selling <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={100}>
              <div className="relative rounded-2xl border border-buyer/20 bg-card p-8 overflow-hidden card-hover">
                <div className="absolute top-0 left-0 w-full h-1 gradient-buyer" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-buyer mb-6">
                  <ShoppingCart className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">For Buyers</h3>
                <ul className="space-y-3">
                  {["Escrow payment protection", "Verified seller badges", "Real-time order tracking", "Direct seller messaging", "Dispute resolution support"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-buyer shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth/register" className="mt-6 inline-block">
                  <Button className="gradient-buyer text-primary-foreground gap-2 mt-2">
                    Start Shopping <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 bg-muted/30 border-y border-border/40">
        <div className="container">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} variant="fade-up" delay={i * 100}>
                <div className="rounded-2xl border border-border/60 bg-card p-8 card-hover">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground font-display font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <GradientOrb color="primary" size="xl" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

        <div className="container relative z-10">
          <AnimatedSection variant="scale-in">
            <div className="mx-auto max-w-3xl text-center rounded-3xl gradient-primary p-12 md:p-16 shadow-glow">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Transform Your Business?
              </h2>
              <p className="mt-4 text-primary-foreground/80 text-lg">
                Join thousands of sellers and buyers building the future of commerce.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90 gap-2 text-base px-8">
                    Create Free Account <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display text-lg font-bold text-foreground">MarketHub</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The AI-powered marketplace platform built for the future of commerce.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth/register" className="hover:text-foreground transition-colors">Create Account</Link></li>
                <li><Link to="/auth/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-4">Trust & Safety</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-accent" /> Escrow Protection</li>
                <li className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-accent" /> SSL Encrypted</li>
                <li className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-accent" /> Verified Sellers</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MarketHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
