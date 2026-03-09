import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AnimatedSection from "@/components/AnimatedSection";
import StatsCounter from "@/components/StatsCounter";
import GradientOrb from "@/components/GradientOrb";
import HeroSlider from "@/components/HeroSlider";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ShoppingBag, ArrowRight, Shield, Store, Zap, Users, Globe, BarChart3,
  CheckCircle2, Lock, Star, Award, Headphones, TrendingUp, ShoppingCart,
  UserPlus, Search, CreditCard, Quote, Menu, X
} from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.png";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const heroSlides = [
  {
    image: heroSlide1,
    title: "The Future of Commerce is Here",
    subtitle: "AI-powered fulfillment, smart inventory, and seamless logistics. Built for sellers who think big.",
    badge: "⚡ AI-Powered Multi-Vendor Marketplace",
  },
  {
    image: heroSlide2,
    title: "Discover Premium Products",
    subtitle: "From handcrafted leather to cutting-edge tech — browse thousands of verified products from trusted sellers worldwide.",
    badge: "🛍️ 100,000+ Products Listed",
  },
  {
    image: heroSlide3,
    title: "Scale Your Business with Data",
    subtitle: "Real-time analytics, AI pricing tools, and secure escrow payments. Everything you need to grow.",
    badge: "📊 Smart Analytics Dashboard",
  },
];

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dashboardPath = role === "admin" ? "/admin/dashboard" : role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/20">
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link to={dashboardPath}>
                <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow hidden sm:inline-flex">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/auth/login"><Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button></Link>
                <Link to="/auth/register">
                  <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow">Get Started</Button>
                </Link>
              </div>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors p-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl animate-slide-up">
            <div className="container py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
              <div className="pt-3 border-t border-border/20 flex flex-col gap-2">
                {user ? (
                  <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gap-2 gradient-primary text-primary-foreground">Dashboard <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full gradient-primary text-primary-foreground">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Slider */}
      <HeroSlider slides={heroSlides}>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/auth/register">
            <Button size="lg" className="w-full sm:w-auto bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2 text-base px-8 py-6 shadow-2xl">
              Start Selling Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm">
              Browse Marketplace
            </Button>
          </Link>
        </div>
        <div className="mt-8 hidden sm:flex flex-wrap items-center gap-6 text-sm text-primary-foreground/70">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <b.icon className="h-4 w-4" />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </HeroSlider>

      {/* Dashboard preview */}
      <section className="relative -mt-20 z-10 pb-16">
        <div className="container">
          <AnimatedSection variant="fade-up" className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/30 ring-1 ring-primary/10">
              <img
                src={heroDashboard}
                alt="MarketHub dashboard showing analytics, product management and sales data"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/40 bg-muted/30 py-14">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} variant="fade-up" delay={i * 100}>
                <div className="text-center">
                  <p className="font-display text-3xl md:text-5xl font-bold text-foreground">
                    <StatsCounter end={s.value} prefix={s.prefix || ""} suffix={s.suffix} decimals={s.decimals || 0} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative overflow-hidden">
        <GradientOrb color="primary" size="xl" className="-top-40 -right-60 opacity-15" />
        <div className="container relative z-10">
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
                <div className="group relative rounded-2xl border border-border/60 bg-card p-8 card-hover h-full">
                  <div className="absolute inset-0 rounded-2xl gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:gradient-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                      <f.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 border-y border-border/40 relative overflow-hidden">
        <GradientOrb color="accent" size="lg" className="-bottom-40 -left-40 opacity-15" />
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
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary shadow-glow group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <span className="absolute top-0 right-0 md:right-4 font-display text-7xl font-bold text-primary/8">{step.number}</span>
                  <h3 className="font-display text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 -right-4 w-8">
                      <ArrowRight className="h-6 w-6 text-primary/30" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Role showcase */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <GradientOrb color="seller" size="lg" className="top-20 -left-40 opacity-10" />
        <GradientOrb color="buyer" size="lg" className="bottom-20 -right-40 opacity-10" />
        <div className="container relative z-10">
          <AnimatedSection variant="fade-up" className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Built for <span className="gradient-text-seller">Sellers</span> & <span className="gradient-text-buyer">Buyers</span>
            </h2>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            <AnimatedSection variant="fade-left">
              <div className="relative rounded-2xl border border-seller/20 bg-card p-8 md:p-10 overflow-hidden card-hover h-full">
                <div className="absolute top-0 left-0 w-full h-1.5 gradient-seller" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-seller mb-6 shadow-glow-seller">
                  <Store className="h-8 w-8 text-primary-foreground" />
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
                <Link to="/auth/register" className="mt-8 inline-block">
                  <Button className="gradient-seller text-primary-foreground gap-2 shadow-glow-seller">
                    Start Selling <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-right" delay={100}>
              <div className="relative rounded-2xl border border-buyer/20 bg-card p-8 md:p-10 overflow-hidden card-hover h-full">
                <div className="absolute top-0 left-0 w-full h-1.5 gradient-buyer" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-buyer mb-6 shadow-glow-buyer">
                  <ShoppingCart className="h-8 w-8 text-primary-foreground" />
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
                <Link to="/auth/register" className="mt-8 inline-block">
                  <Button className="gradient-buyer text-primary-foreground gap-2 shadow-glow-buyer">
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
                <div className="rounded-2xl border border-border/60 bg-card p-8 card-hover h-full flex flex-col">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary text-primary-foreground font-display font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-seller text-seller" />
                      ))}
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
        <GradientOrb color="primary" size="xl" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

        <div className="container relative z-10">
          <AnimatedSection variant="scale-in">
            <div className="mx-auto max-w-4xl text-center rounded-3xl gradient-primary p-12 md:p-20 shadow-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(280,80%,60%,0.3),transparent_50%)]" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">
                  Ready to Transform Your Business?
                </h2>
                <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
                  Join thousands of sellers and buyers building the future of commerce.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2 text-base px-8 py-6 shadow-2xl">
                      Create Free Account <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
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
