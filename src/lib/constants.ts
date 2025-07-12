import type { SelectOption } from "../types";

// Category options for dropdowns
export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "travel", label: "Travel" },
  { value: "coding", label: "Coding" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health & Wellness" },
  { value: "food", label: "Food & Cooking" },
  { value: "entertainment", label: "Entertainment" },
];

// Status options for dropdowns
export const STATUS_OPTIONS: SelectOption[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

// Form validation patterns
export const VALIDATION_PATTERNS = {
  slug: {
    pattern: /^[a-z0-9-]+$/,
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  },
  tags: {
    pattern: /^[a-zA-Z0-9\s,.-]+$/,
    message:
      "Tags can only contain letters, numbers, spaces, commas, periods, and hyphens",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
} as const;

// Form field constraints
export const FIELD_CONSTRAINTS = {
  title: {
    minLength: { value: 5, message: "Title must be at least 5 characters" },
    maxLength: { value: 100, message: "Title must not exceed 100 characters" },
  },
  slug: {
    minLength: { value: 3, message: "Slug must be at least 3 characters" },
  },
  excerpt: {
    minLength: { value: 50, message: "Excerpt must be at least 50 characters" },
    maxLength: {
      value: 300,
      message: "Excerpt must not exceed 300 characters",
    },
  },
  password: {
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  },
  name: {
    minLength: { value: 2, message: "Name must be at least 2 characters" },
    maxLength: { value: 50, message: "Name must not exceed 50 characters" },
  },
  subject: {
    minLength: { value: 5, message: "Subject must be at least 5 characters" },
    maxLength: {
      value: 100,
      message: "Subject must not exceed 100 characters",
    },
  },
  message: {
    minLength: { value: 10, message: "Message must be at least 10 characters" },
    maxLength: {
      value: 1000,
      message: "Message must not exceed 1000 characters",
    },
  },
} as const;
