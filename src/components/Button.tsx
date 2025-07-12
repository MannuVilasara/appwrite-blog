import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none
      ${fullWidth ? "w-full" : ""}
    `;

    // Size variants
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    // Color variants
    const variantStyles = {
      primary: `
        bg-blue-600 text-white shadow-sm
        hover:bg-blue-700 active:bg-blue-800
        focus:ring-blue-500
      `,
      secondary: `
        bg-gray-600 text-white shadow-sm
        hover:bg-gray-700 active:bg-gray-800
        focus:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white shadow-sm
        hover:bg-red-700 active:bg-red-800
        focus:ring-red-500
      `,
      outline: `
        border-2 border-gray-300 bg-white text-gray-700
        hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100
        focus:ring-gray-500
      `,
      ghost: `
        bg-transparent text-gray-700
        hover:bg-gray-100 active:bg-gray-200
        focus:ring-gray-500
      `,
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className={`animate-spin ${
          size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
        }`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const buttonClasses = `
      ${baseStyles}
      ${sizeStyles[size]}
      ${variantStyles[variant]}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
