import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground shadow hover:bg-info/80",
        subtle: "border-transparent bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30",
        "subtle-secondary": "border-transparent bg-secondary/20 dark:bg-secondary/30 text-secondary-foreground hover:bg-secondary/30",
        "subtle-destructive": "border-transparent bg-destructive/20 dark:bg-destructive/30 text-destructive hover:bg-destructive/30",
        "subtle-success": "border-transparent bg-success/20 dark:bg-success/30 text-success hover:bg-success/30",
        "subtle-warning": "border-transparent bg-warning/20 dark:bg-warning/30 text-warning hover:bg-warning/30",
        "subtle-info": "border-transparent bg-info/20 dark:bg-info/30 text-info hover:bg-info/30",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.25 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      rounded: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, rounded, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounded }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
