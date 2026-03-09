import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function SellerChat() {
  return (
    <div className="space-y-6">
      <AnimatedSection variant="fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
          <p className="mt-1 text-muted-foreground">Chat with your buyers</p>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={50}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-10 h-11" />
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fade-up" delay={100}>
        <Card className="border-border/60">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted mb-5">
                <MessageSquare className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">No conversations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Messages from buyers asking about your products will appear here. Quick responses improve your seller rating.
              </p>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
