import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, AlertTriangle, Shield, FileText, Plus, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const reportTypes = [
  { icon: AlertTriangle, title: "Fraud / Scam", desc: "Seller didn't deliver or sent fake products", gradient: "gradient-primary" },
  { icon: Shield, title: "Payment Issue", desc: "Unauthorized charge or payment not refunded", gradient: "gradient-seller" },
  { icon: FileText, title: "Product Issue", desc: "Product doesn't match description or is defective", gradient: "gradient-buyer" },
];

export default function BuyerReports() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Reports & Disputes</h1>
            <p className="mt-1 text-muted-foreground">Report sellers and track complaint status</p>
          </div>
          <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </div>
      </AnimatedSection>

      {/* Report type cards */}
      <AnimatedSection variant="fade-up" delay={50}>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">What would you like to report?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {reportTypes.map((type, i) => (
            <button
              key={type.title}
              className="group rounded-2xl border border-border/60 bg-card p-6 text-left card-hover transition-all"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${type.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                <type.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{type.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{type.desc}</p>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Existing reports */}
      <AnimatedSection variant="fade-up" delay={100}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Your Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Flag className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No reports filed</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                If you experience any issues with a seller or order, you can file a report above with proof and we'll investigate.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Trust note */}
      <AnimatedSection variant="fade-up" delay={150}>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Reports are reviewed within 24-48 hours</p>
            <p className="text-xs text-muted-foreground mt-1">Our team investigates every report. Seller accounts may be frozen during investigation to protect your funds.</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
