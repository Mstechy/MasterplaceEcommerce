import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, DollarSign, ArrowUpRight, Clock, CreditCard, Building2, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WalletTx {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  created_at: string;
}

export default function SellerWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: wallet } = await supabase.from("seller_wallets").select("*").eq("seller_id", user.id).single();
      if (wallet) {
        setBalance(Number(wallet.balance));
        const { data: txs } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", wallet.id).order("created_at", { ascending: false });
        if (txs) setTransactions(txs as WalletTx[]);
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  // Calculate pending from orders
  const [pending, setPending] = useState(0);
  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("total_amount").eq("seller_id", user.id).in("status", ["pending", "processing", "shipped"])
      .then(({ data }) => {
        if (data) setPending(data.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0));
      });
  }, [user]);

  const walletStats = [
    { label: "Available Balance", value: `$${balance.toFixed(2)}`, icon: Wallet, gradient: "gradient-seller", desc: "Ready to withdraw" },
    { label: "Pending", value: `$${pending.toFixed(2)}`, icon: Clock, gradient: "gradient-primary", desc: "In escrow" },
    { label: "Total Earned", value: `$${(balance + pending).toFixed(2)}`, icon: TrendingUp, gradient: "gradient-buyer", desc: "Lifetime earnings" },
  ];

  const txTypeColors: Record<string, string> = {
    sale: "text-accent",
    withdrawal: "text-destructive",
    fee: "text-muted-foreground",
    refund: "text-yellow-600",
  };

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

      <AnimatedSection variant="fade-up" delay={200}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Transaction History</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No transactions yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Your sales and withdrawal history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">{tx.type}</p>
                      {tx.description && <p className="text-xs text-muted-foreground">{tx.description}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-display font-bold ${txTypeColors[tx.type] || "text-foreground"}`}>
                      {tx.type === "withdrawal" || tx.type === "fee" ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
