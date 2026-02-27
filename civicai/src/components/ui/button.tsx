import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-[#0B3D91] text-white shadow-sm hover:bg-[#0B3D91]/90",
                secondary:
                    "border border-[#FF9933] bg-transparent text-[#FF9933] hover:bg-[#FF9933] hover:text-white",
                destructive:
                    "bg-[#DC2626] text-white shadow-sm hover:bg-[#DC2626]/90",
                outline:
                    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
                ghost: " hover:bg-slate-100 hover:text-slate-900",
                link: "text-[#0B3D91] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-8 px-4 py-1",
                sm: "h-7 px-3 text-xs",
                lg: "h-10 px-8",
                icon: "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
