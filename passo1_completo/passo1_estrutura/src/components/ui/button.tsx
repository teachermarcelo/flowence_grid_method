import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variantStyles = {
      default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200",
      outline: "border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800",
      destructive: "bg-red-600 text-white hover:bg-red-700"
    }

    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg"
    }

    return (
      <button
        className={baseStyles + " " + variantStyles[variant] + " " + sizeStyles[size] + " " + (className || "")}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
