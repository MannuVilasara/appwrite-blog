import config from "../lib/config";
import { Client, ID, Databases, Query, Storage } from "appwrite";


interface CreatePostParams {
    title: string;
    slug: string;
    content: string;
    featuredImage?: File;
    status?: string;
    userID: string;
}

export class AppwriteService {
    client: Client;
    databases: Databases;
    storage: Storage;

    constructor() {
        this.client = new Client();
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userID }: CreatePostParams) {
        try {
            const post = await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage: featuredImage,
                    status,
                    userID

                }
            );

            return { post };
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    async updatePost(slug: string, data: Partial<CreatePostParams>) {
        try {
            const updatedPost = await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                data
            );

            return { updatedPost };
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    }

    async deletePost(slug: string) {
        try {
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return { success: true };
        } catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    }

    async getPost(slug: string) {
        try {
            const post = await this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            );
            return { post };
        } catch (error) {
            console.error("Error fetching post:", error);
            throw error;
        }
    }

    async getPosts(queries: string[] = [Query.equal("status", "active")]) {
        try {
            const posts = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                queries,
            );
            return { posts };
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    }

    async uploadFile(file: File) {
        try {
            const response = await this.storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );
            return response;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;

        }
    }

    async deleteFile(fileId: string) {
        try {
            await this.storage.deleteFile(
                config.appwriteBucketId,
                fileId
            );
            return { success: true };
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }

    async getFilePreview(fileId: string) {
        try {
            const filePreview = await this.storage.getFilePreview(
                config.appwriteBucketId,
                fileId
            );
            return filePreview;
        } catch (error) {
            console.error("Error fetching file preview:", error);
            throw error;
        }
    }
}

const appwriteService = new AppwriteService();
export default appwriteService;