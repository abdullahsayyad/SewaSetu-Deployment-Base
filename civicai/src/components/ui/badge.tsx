import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-none focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[#0B3D91] text-white",
                secondary:
                    "border-transparent bg-[#FF9933] text-white",
                outline: "text-foreground border-slate-300",

                // Official Severity Variants (Solid colors, no glow, white text)
                critical: "border-transparent bg-[#DC2626] text-white",
                high: "border-transparent bg-[#EA580C] text-white",
                moderate: "border-transparent bg-[#CA8A04] text-white",
                low: "border-transparent bg-[#16A34A] text-white",

                // Text Badge (Subtle background, bold text)
                statusTag: "border-slate-200 bg-slate-50 text-slate-700 font-medium"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
