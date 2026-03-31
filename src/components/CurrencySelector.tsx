import { useCurrency } from "@/hooks/useCurrency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign } from "lucide-react";

export default function CurrencySelector() {
  const { currency, setCurrencyCode, currencies } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-[hsl(var(--navbar-foreground)/0.1)] transition-colors">
          <span>{currency.symbol}</span>
          <span>{currency.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {(Object.keys(currencies) as Array<keyof typeof currencies>).map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setCurrencyCode(code)}
            className={`gap-2 ${currency.code === code ? "bg-primary/10 text-primary" : ""}`}
          >
            <span className="font-medium">{currencies[code].symbol}</span>
            <span>{code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
