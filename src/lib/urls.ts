// URL utilities for consistent routing
export const createPostUrl = (slug: string): string => {
  return `/posts/${slug}`;
};

export const createPostUrlAlt = (slug: string): string => {
  return `/post/${slug}`;
};

export const extractSlugFromUrl = (url: string): string | null => {
  const postMatch = url.match(/\/posts?\/(.+)/);
  return postMatch ? postMatch[1] : null;
};

export const isPostUrl = (url: string): boolean => {
  return /\/posts?\//.test(url);
};

// Helper to redirect old post URLs to new format
export const normalizePostUrl = (url: string): string => {
  if (url.startsWith("/post/")) {
    return url.replace("/post/", "/posts/");
  }
  return url;
};
