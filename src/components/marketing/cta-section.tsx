import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/primitives";

export function CtaSection() {
  return (
    <section id="contact" className="bg-navy-900 text-ivory-100">
      <div className="container relative overflow-hidden py-24 lg:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C8A96A 0%, transparent 38%), radial-gradient(circle at 80% 70%, #C8A96A 0%, transparent 45%)",
          }}
          aria-hidden
        />
        <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <Reveal>
            <div className="eyebrow flex items-center gap-3 mb-6 text-champagne-300">
              <span className="inline-block h-px w-8 bg-champagne-400/70" />
              <span>Private Client Office</span>
            </div>
            <h2 className="font-display text-display-xl text-balance">
              A relationship begins with a conversation, not a form.
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ivory-100/75 text-pretty">
              If you have been introduced, please proceed to open your private file. Otherwise,
              request a discreet first meeting with our private client office.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" variant="gold" asChild>
                <Link href="/register">
                  Open private file
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-ivory-100/20 bg-transparent text-ivory-100 hover:bg-ivory-100/5"
              >
                <Link href="mailto:private-clients@continental.example">
                  Request introduction
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className="space-y-7 border border-ivory-100/15 bg-navy-800/40 p-8 rounded-md backdrop-blur-sm"
          >
            <div>
              <div className="eyebrow text-champagne-300">Geneva · Headquarters</div>
              <p className="mt-3 text-[14px] leading-relaxed text-ivory-100/80">
                Continental Bank Place de la Concorde 12 · CH-1204 Geneva, Switzerland
              </p>
            </div>
            <div className="hairline bg-ivory-100/10" />
            <div>
              <div className="eyebrow text-champagne-300">Private Client Office</div>
              <p className="mt-3 text-[14px] tabular-figures text-ivory-100/80">
                +41 22 000 00 00
                <br />
                private-clients@continental.example
              </p>
            </div>
            <div className="hairline bg-ivory-100/10" />
            <div>
              <div className="eyebrow text-champagne-300">Hours · CET</div>
              <p className="mt-3 text-[14px] text-ivory-100/80">
                Mon–Fri 07:00–20:00 · Weekend by appointment
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
