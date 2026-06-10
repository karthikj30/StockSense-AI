import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#00C896] focus:ring-offset-2 focus:ring-offset-[#0A0F1A]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#00C896] text-[#0A0F1A] hover:bg-[#00b386]",
        secondary:
          "border-transparent bg-[#1F2937] text-[#F9FAFB] hover:bg-[#374151]",
        destructive:
          "border-transparent bg-[#EF4444] text-white hover:bg-[#dc2626]",
        outline: "border-[#374151] text-[#F9FAFB]",
        success:
          "border-transparent bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30",
        danger:
          "border-transparent bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
        ai: "border-transparent bg-[#6366F1]/15 text-[#818CF8] border-[#6366F1]/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
