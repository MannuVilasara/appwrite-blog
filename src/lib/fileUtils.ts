import config from "./config";

/**
 * Convert Appwrite file ID to view URL (not preview - for free plan compatibility)
 * @param fileId - The Appwrite file ID
 * @returns Full URL for file view
 */
export const getFilePreviewUrl = (fileId: string): string => {
  if (!fileId) return "";
  // Use /view instead of /preview to avoid transformation limits
  return `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${fileId}/view?project=${config.appwriteProjectId}`;
};

/**
 * Check if a string is a valid file ID (not already a URL)
 * @param value - The value to check
 * @returns True if it's a file ID, false if it's already a URL
 */
export const isFileId = (value: string): boolean => {
  return Boolean(
    value && !value.startsWith("http") && !value.startsWith("data:")
  );
};
