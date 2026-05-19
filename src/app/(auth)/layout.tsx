import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* Left rail — editorial */}
      <aside className="relative hidden lg:flex flex-col justify-between p-12 text-ivory-100 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, #07111F 0%, #0A1527 60%, #07111F 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #C8A96A 0%, transparent 35%), radial-gradient(circle at 80% 80%, #C8A96A 0%, transparent 40%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <Link href="/" className="focus-ring rounded-sm inline-block">
            <BrandMark variant="light" />
          </Link>
        </div>

        <div className="relative max-w-md">
          <div className="eyebrow text-champagne-300 mb-5">A note from the chairman</div>
          <p className="font-display text-2xl leading-[1.35] text-ivory-100/95 text-balance">
            “We do not chase scale. We protect the few who have entrusted us with a lifetime of
            careful work. Restraint is our standard.”
          </p>
          <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-ivory-100/55">
            É. Marchand · Chairman, Continental Bank · Geneva
          </p>
        </div>

        <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ivory-100/55">
          <span>Geneva · London · Luxembourg</span>
          <span>Singapore · Dubai · New York</span>
        </div>
      </aside>

      {/* Form column */}
      <main className="relative flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="focus-ring rounded-sm inline-block">
            <BrandMark />
          </Link>
        </div>
        <div className="w-full max-w-md animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
