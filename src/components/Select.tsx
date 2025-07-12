import React, { useId } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: "default" | "filled" | "outline";
  selectSize?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      variant = "default",
      selectSize = "md",
      isRequired = false,
      isLoading = false,
      disabled,
      className = "",
      id,
      leftIcon,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const selectId = id || `select-${useId()}`;

    // Base select styles
    const baseSelectStyles = `
      w-full rounded-lg border transition-all duration-200 appearance-none
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50
      cursor-pointer
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
      `
      : "";

    // Icon padding adjustments
    const leftPadding = leftIcon
      ? selectSize === "sm"
        ? "pl-9"
        : selectSize === "lg"
          ? "pl-11"
          : "pl-10"
      : "";
    const rightPadding =
      selectSize === "sm" ? "pr-8" : selectSize === "lg" ? "pr-10" : "pr-9";

    const selectClasses = `
      ${baseSelectStyles}
      ${sizeStyles[selectSize]}
      ${error ? errorStyles : variantStyles[variant]}
      ${leftPadding}
      ${rightPadding}
      ${className}
    `
      .replace(/\s+/g, " ")
      .trim();

    // Loading spinner
    const LoadingSpinner = () => (
      <svg
        className={`animate-spin text-gray-400 ${
          selectSize === "sm"
            ? "w-4 h-4"
            : selectSize === "lg"
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

    // Chevron down icon
    const ChevronDownIcon = () => (
      <svg
        className={`text-gray-400 pointer-events-none ${
          selectSize === "sm"
            ? "w-4 h-4"
            : selectSize === "lg"
              ? "w-5 h-5"
              : "w-4 h-4"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m19 9-7 7-7-7"
        />
      </svg>
    );

    // Icon positioning classes
    const iconPositionClasses = {
      left: `absolute left-0 top-0 h-full flex items-center ${
        selectSize === "sm" ? "pl-3" : selectSize === "lg" ? "pl-4" : "pl-3"
      }`,
      right: `absolute right-0 top-0 h-full flex items-center ${
        selectSize === "sm" ? "pr-3" : selectSize === "lg" ? "pr-4" : "pr-3"
      }`,
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={iconPositionClasses.left}>
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}

          {/* Select Field */}
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            disabled={disabled || isLoading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Right Icon (Chevron or Loading) */}
          <div className={iconPositionClasses.right}>
            {isLoading ? <LoadingSpinner /> : <ChevronDownIcon />}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${selectId}-error`}
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
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
