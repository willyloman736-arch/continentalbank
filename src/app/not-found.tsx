import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/shared/brand-mark";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-8">
          <BrandMark />
        </div>
        <div className="eyebrow text-champagne-700 dark:text-champagne-400 mb-4">404 · Not found</div>
        <h1 className="font-display text-display-md text-foreground">
          This page is not on file.
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
          You may have followed a stale link, or this page has been retired from public view.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Return to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
