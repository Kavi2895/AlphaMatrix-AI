import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'purple';
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-secondary text-secondary-foreground border-transparent",
    outline: "text-foreground border-border bg-transparent",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 border",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/25 border",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/25 border",
    purple: "bg-violet-500/10 text-violet-400 border-violet-500/25 border"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
