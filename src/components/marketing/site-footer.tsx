import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";
import { SITE } from "@/lib/constants";

const columns = [
  {
    title: "Continental",
    links: [
      { label: "Our standard", href: "#private-clients" },
      { label: "Global desks", href: "#global" },
      { label: "Private client office", href: "#contact" },
      { label: "Press & affairs", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Multi-currency portfolios", href: "#services" },
      { label: "Discreet withdrawals", href: "#services" },
      { label: "Custody & oversight", href: "#services" },
      { label: "Family office support", href: "#services" },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Confidentiality charter", href: "#" },
      { label: "Compliance & disclosures", href: "#" },
      { label: "Terms of engagement", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
          <div>
            <BrandMark />
            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              Continental Bank is a private institution serving principals and family offices
              across {38} jurisdictions. Discreet by tradition, exacting by mandate.
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Member · International Private Banking Council
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="eyebrow mb-5 text-foreground">{col.title}</h4>
                <ul className="space-y-3 text-[13px]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <div>
            © {new Date().getFullYear()} {SITE.name}. Geneva · London · Luxembourg · Singapore ·
            Dubai · New York.
          </div>
          <div className="tabular-figures">Reg. CH-660.1.000.000 · BIC CONTCHGGXXX</div>
        </div>
      </div>
    </footer>
  );
}
