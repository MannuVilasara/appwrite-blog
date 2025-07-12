import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "outline";
  inputSize?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "default",
      inputSize = "md",
      isRequired = false,
      isLoading = false,
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${useId()}`;

    // Base input styles
    const baseInputStyles = `
      w-full rounded-lg border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
      placeholder:text-gray-400
    `;

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    // Variant styles
    const variantStyles = {
      default: `
        border-gray-300 bg-white
        hover:border-gray-400
        focus:border-blue-500 focus:ring-blue-500
      `,
      filled: `
        border-transparent bg-gray-100
        hover:bg-gray-200
        focus:bg-white focus:border-blue-500 focus:ring-blue-500
      `,
      outline: `
        border-2 border-gray-300 bg-transparent
        hover:border-gray-400
        focus:border-blue-500 focus:ring-blue-500
      `,
    };

    // Error state styles
    const errorStyles = error
      ? `
        border-red-300 bg-red-50
        focus:border-red-500 focus:ring-red-500
        placeholder:text-red-300
      `
      : "";

    // Icon padding adjustments
    const iconPadding = {
      left: leftIcon
        ? inputSize === "sm"
          ? "pl-9"
          : inputSize === "lg"
            ? "pl-11"
            : "pl-10"
        : "",
      right:
        rightIcon || isLoading
          ? inputSize === "sm"
            ? "pr-9"
            : inputSize === "lg"
              ? "pr-11"
              : "pr-10"
          : "",
    };

    const inputClasses = `
      ${baseInputStyles}
      ${sizeStyles[inputSize]}
      ${error ? errorStyles : variantStyles[variant]}
      ${iconPadding.left}
      ${iconPadding.right}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className={`animate-spin text-gray-400 ${
          inputSize === "sm"
            ? "w-4 h-4"
            : inputSize === "lg"
              ? "w-5 h-5"
              : "w-4 h-4"
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

    // Icon positioning classes
    const iconPositionClasses = {
      left: `absolute left-0 top-0 h-full flex items-center ${
        inputSize === "sm" ? "pl-3" : inputSize === "lg" ? "pl-4" : "pl-3"
      }`,
      right: `absolute right-0 top-0 h-full flex items-center ${
        inputSize === "sm" ? "pr-3" : inputSize === "lg" ? "pr-4" : "pr-3"
      }`,
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={iconPositionClasses.left}>
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || isLoading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Right Icon or Loading Spinner */}
          {(rightIcon || isLoading) && (
            <div className={iconPositionClasses.right}>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <span className="text-gray-400">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
