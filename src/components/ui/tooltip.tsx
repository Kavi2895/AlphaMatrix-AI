import * as React from "react"
import { cn } from "../../lib/utils"

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className, ...props }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 scale-95 rounded bg-slate-950/95 border border-border px-2.5 py-1.5 text-center text-[10px] font-medium text-slate-100 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:scale-100 group-hover:opacity-100",
          className
        )}
        {...props}
      >
        {content}
        {/* Tooltip triangle */}
        <div className="absolute top-full left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-0.5 rotate-45 border-r border-b border-border bg-slate-950" />
      </div>
    </div>
  );
}
