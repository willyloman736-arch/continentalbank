import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base — premium transition envelope
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium tracking-tight " +
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out " +
    "focus-ring disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
    "[&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out " +
    "active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft-sm " +
          "hover:bg-primary/95 hover:shadow-soft hover:-translate-y-[1px] " +
          "hover:[&_svg]:translate-x-0.5",
        gold:
          "bg-champagne-500 text-navy-900 shadow-soft-sm " +
          "hover:bg-champagne-400 hover:shadow-soft hover:-translate-y-[1px] " +
          "hover:[&_svg]:translate-x-0.5",
        outline:
          "border border-border bg-transparent text-foreground " +
          "hover:bg-muted/60 hover:border-foreground/20",
        ghost: "text-foreground hover:bg-muted/60",
        destructive:
          "bg-destructive text-destructive-foreground " +
          "hover:bg-destructive/90 hover:-translate-y-[1px] hover:shadow-soft",
        link: "text-foreground underline-offset-4 hover:underline",
        subtle: "bg-muted/70 text-foreground hover:bg-muted",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
