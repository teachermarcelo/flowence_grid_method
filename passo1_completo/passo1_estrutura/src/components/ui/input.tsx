import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={"flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300 " + (className || "")}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
