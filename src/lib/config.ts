export interface Config {
  appwriteUrl: string;
  appwriteProjectId: string;
  appwriteDatabaseId: string;
  appwriteCollectionId: string;
  appwriteBucketId: string;
}

const config: Config = {
  appwriteUrl: String(
    import.meta.env.VITE_APPWRITE_URL || "https://fra.cloud.appwrite.io/v1"
  ),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID || ""),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID || ""),
  appwriteCollectionId: String(
    import.meta.env.VITE_APPWRITE_COLLECTION_ID || ""
  ),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID || ""),
};

export default config;
