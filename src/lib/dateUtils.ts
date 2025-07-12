// Date utilities for consistent date handling across the application

/**
 * Safely format a date string with fallback for invalid dates
 */
export const formatDate = (
  dateString: string | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string => {
  if (!dateString) {
    console.warn("formatDate: Empty date string provided");
    return "Unknown date";
  }

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("formatDate: Invalid date string:", dateString);
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", options);
};

/**
 * Format date for compact display (short month)
 */
export const formatDateCompact = (
  dateString: string | undefined | null
): string => {
  return formatDate(dateString, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date for relative display (e.g., "2 days ago")
 */
export const formatDateRelative = (
  dateString: string | undefined | null
): string => {
  if (!dateString) return "Unknown time";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;

  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Get a safe date from Appwrite document
 */
export const getSafeDate = (post: any): string => {
  return (
    post.$createdAt ||
    post.createdAt ||
    post.publishedAt ||
    new Date().toISOString()
  );
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateString: string | undefined | null): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
