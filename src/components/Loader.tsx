import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return (
    <div className={cn("flex min-h-screen w-full flex-col items-center justify-center gap-4 p-8", className)}>
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
