import { Snowflake, Sparkles, X } from "lucide-react";
import { getDemoRole, isDemoFrozenPreview, isDemoMode } from "@/lib/demo";

export async function DemoBanner() {
  if (!(await isDemoMode())) return null;
  const role = await getDemoRole();
  const frozen = await isDemoFrozenPreview();

  return (
    <div className="border-b border-champagne-500/20 bg-champagne-500/[0.06]">
      <div className="container flex flex-wrap items-center justify-between gap-3 py-2.5 text-[12px]">
        <div className="flex items-center gap-2 text-foreground/85">
          <Sparkles className="h-3.5 w-3.5 text-champagne-700 dark:text-champagne-400" />
          <span className="font-medium tracking-tight">Live demonstration</span>
          <span className="text-muted-foreground">
            · Seeded data · No changes are saved
          </span>
        </div>

        <div className="flex items-center gap-2">
          {role === "client" && (
            <form
              data-frost-allow="true"
              action={frozen ? "/api/demo/frozen?off=1" : "/api/demo/frozen?on=1"}
              method="post"
            >
              <button
                type="submit"
                data-frost-allow="true"
                className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
              >
                <Snowflake className="h-3 w-3" />
                {frozen ? "Thaw account preview" : "Preview frozen account"}
              </button>
            </form>
          )}
          <form action="/api/demo/exit" method="post" data-frost-allow="true">
            <button
              type="submit"
              data-frost-allow="true"
              className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
            >
              <X className="h-3 w-3" />
              Exit demo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
