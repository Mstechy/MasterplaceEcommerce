import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Flag, AlertTriangle, Shield, FileText, Plus, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Dispute {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

export default function BuyerReports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("disputes").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setDisputes(data as Dispute[]); setLoading(false); });
  }, [user]);

  const submitReport = async () => {
    if (!user || !reason.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("disputes").insert({
      buyer_id: user.id,
      seller_id: sellerId || user.id, // fallback, should be real seller
      reason: reason.trim(),
      description: description.trim() || null,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Report submitted" }); setReason(""); setDescription(""); setSellerId(""); setDialogOpen(false); }
    setSaving(false);
    // Refresh
    const { data } = await supabase.from("disputes").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false });
    if (data) setDisputes(data as Dispute[]);
  };

  const statusColors: Record<string, string> = {
    open: "bg-destructive/10 text-destructive",
    investigating: "bg-yellow-500/10 text-yellow-600",
    resolved: "bg-accent/10 text-accent",
    dismissed: "bg-muted text-muted-foreground",
  };

  const reportTypes = [
    { icon: AlertTriangle, title: "Fraud / Scam", desc: "Seller didn't deliver or sent fake products", gradient: "gradient-primary" },
    { icon: Shield, title: "Payment Issue", desc: "Unauthorized charge or payment not refunded", gradient: "gradient-seller" },
    { icon: FileText, title: "Product Issue", desc: "Product doesn't match description or is defective", gradient: "gradient-buyer" },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Reports & Disputes</h1>
            <p className="mt-1 text-muted-foreground">Report sellers and track complaint status</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow">
                <Plus className="h-4 w-4" /> New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">File a Report</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Reason *</label>
                  <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Fraud, Payment Issue" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail..." className="mt-1" rows={4} />
                </div>
                <Button onClick={submitReport} disabled={saving || !reason.trim()} className="w-full gradient-primary text-primary-foreground">
                  {saving ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={50}>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">What would you like to report?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {reportTypes.map(type => (
            <button key={type.title} onClick={() => { setReason(type.title); setDialogOpen(true); }}
              className="group rounded-2xl border border-border/60 bg-card p-6 text-left card-hover transition-all">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${type.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                <type.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{type.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{type.desc}</p>
            </button>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="font-display">Your Reports</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : disputes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Flag className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground">No reports filed</p>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">If you experience any issues with a seller, file a report above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {disputes.map(d => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.reason}</p>
                      {d.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{d.description}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(d.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge className={statusColors[d.status] || ""}>{d.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={150}>
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Reports are reviewed within 24-48 hours</p>
            <p className="text-xs text-muted-foreground mt-1">Our team investigates every report. Seller accounts may be frozen during investigation.</p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
