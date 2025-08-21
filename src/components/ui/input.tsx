import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "tax" | "error"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-input focus-visible:ring-ring focus-visible:ring-offset-2",
      tax: "border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm focus-visible:ring-offset-0",
      error: "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20 focus-visible:ring-offset-0"
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
