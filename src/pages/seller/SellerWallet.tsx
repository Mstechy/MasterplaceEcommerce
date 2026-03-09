import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CreditCard, Building2, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const walletStats = [
  { label: "Available Balance", value: "$0.00", icon: Wallet, gradient: "gradient-seller", desc: "Ready to withdraw" },
  { label: "Pending", value: "$0.00", icon: Clock, gradient: "gradient-primary", desc: "In escrow" },
  { label: "Total Earned", value: "$0.00", icon: TrendingUp, gradient: "gradient-buyer", desc: "Lifetime earnings" },
];

export default function SellerWallet() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Wallet</h1>
            <p className="mt-1 text-muted-foreground">Your earnings and withdrawal management</p>
          </div>
          <Button className="gap-2 gradient-seller text-primary-foreground shadow-glow-seller">
            <ArrowUpRight className="h-4 w-4" /> Withdraw
          </Button>
        </div>
      </AnimatedSection>

      {/* Balance cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {walletStats.map((stat, i) => (
          <AnimatedSection key={stat.label} variant="fade-up" delay={i * 80}>
            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.gradient}`}>
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      {/* Payment methods */}
      <AnimatedSection variant="fade-up" delay={200}>
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Payment Methods</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <CreditCard className="h-4 w-4" /> Add Method
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No payment methods</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Add a bank account or payment wallet to receive your earnings.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Transaction history */}
      <AnimatedSection variant="fade-up" delay={250}>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="font-display">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground">No transactions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Your sales and withdrawal history will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
