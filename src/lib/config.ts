export interface Config {
    appwriteUrl: string;
    appwriteProjectId: string;
    appwriteDatabaseId: string;
    appwriteCollectionId: string;
    appwriteBucketId: string;
}


const config: Config = {
    appwriteUrl: String(process.env.VITE_APPWRITE_URL || 'https://fra.cloud.appwrite.io/v1'),
    appwriteProjectId: String(process.env.VITE_APPWRITE_PROJECT_ID || ''),
    appwriteDatabaseId: String(process.env.VITE_APPWRITE_DATABASE_ID || ''),
    appwriteCollectionId: String(process.env.VITE_APPWRITE_COLLECTION_ID || ''),
    appwriteBucketId: String(process.env.VITE_APPWRITE_BUCKET_ID || ''),
}

export default config