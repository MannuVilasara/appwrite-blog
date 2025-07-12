/**
 * Generates a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

/**
 * Processes tags from a comma-separated string to an array
 * @param tagsString - Comma-separated tags string
 * @returns Array of cleaned tags
 */
export const processTags = (tagsString: string): string[] => {
  return tagsString
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

/**
 * Formats a date to a readable string
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

/**
 * Checks if a user is the author of a post
 * @param postUserId - User ID from the post
 * @param currentUserId - Current user's ID
 * @returns Boolean indicating if user is the author
 */
export const isPostAuthor = (
  postUserId: string,
  currentUserId?: string
): boolean => {
  return !!currentUserId && postUserId === currentUserId;
};
