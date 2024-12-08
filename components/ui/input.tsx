import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full outline-black outline-1 outline placeholder:text-black bg-secondary px-4 py-5 text-base  disabled:cursor-not-allowed disabled:opacity-50 rounded-sm placeholder:text-black/80 focus-within:outline-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
