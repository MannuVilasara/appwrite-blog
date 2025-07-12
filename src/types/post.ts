// Common Post related types
export interface Post {
  $id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  featuredImage?: string;
  userID: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: "draft" | "published";
  featuredImage?: FileList;
}

export interface CreatePostParams {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  status?: string;
  userID: string;
}

export interface PostFormProps {
  post?: Post;
  isEdit?: boolean;
}

// Category and Status options
export interface SelectOption {
  value: string;
  label: string;
}

export type PostStatus = "draft" | "published";
export type PostCategory =
  | "technology"
  | "lifestyle"
  | "travel"
  | "coding"
  | "business"
  | "health"
  | "food"
  | "entertainment";
