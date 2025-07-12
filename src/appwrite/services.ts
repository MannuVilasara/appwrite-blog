import { Client, Databases, ID, Query, Storage } from "appwrite";
import config from "../lib/config";
import { logError } from "../lib/errors";
import type { CreatePostParams } from "../types";

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

  async createPost({
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    status,
    userID,
  }: CreatePostParams) {
    try {
      // Build document data with only existing Appwrite attributes
      const documentData: any = {
        title,
        content,
        excerpt,
        featuredImage: featuredImage, // This should be a file ID string
        status,
        userID,
      };

      // Only include optional attributes if they exist in your Appwrite schema
      // TODO: Add these attributes to your Appwrite collection:
      // - slug (string, required)
      // - category (string, optional)
      // - tags (string[], optional)

      // Uncomment these when you add the attributes to Appwrite:
      // if (slug) documentData.slug = slug;
      // if (category) documentData.category = category;
      // if (tags && tags.length > 0) documentData.tags = tags;

      const post = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug, // Using slug as document ID
        documentData
      );

      return { post };
    } catch (error) {
      logError(error, "AppwriteService.createPost");
      throw error;
    }
  }

  async updatePost(slug: string, data: Partial<CreatePostParams>) {
    try {
      // Filter data to only include existing Appwrite attributes
      const documentData: any = {};

      if (data.title !== undefined) documentData.title = data.title;
      if (data.content !== undefined) documentData.content = data.content;
      if (data.excerpt !== undefined) documentData.excerpt = data.excerpt;
      if (data.featuredImage !== undefined)
        documentData.featuredImage = data.featuredImage;
      if (data.status !== undefined) documentData.status = data.status;
      if (data.userID !== undefined) documentData.userID = data.userID;

      // TODO: Uncomment when you add these to Appwrite:
      // if (data.slug !== undefined) documentData.slug = data.slug;
      // if (data.category !== undefined) documentData.category = data.category;
      // if (data.tags !== undefined) documentData.tags = data.tags;

      const updatedPost = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        documentData
      );

      return { updatedPost };
    } catch (error) {
      logError(error, "AppwriteService.updatePost");
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
      logError(error, "AppwriteService.deletePost");
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
      logError(error, "AppwriteService.getPost");
      throw error;
    }
  }

  async getPosts(queries: string[] = []) {
    try {
      // Add public read permission for guest users
      const posts = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        [
          ...queries,
          Query.orderDesc("$createdAt"), // Order by creation date
          Query.limit(50), // Limit to 50 posts
        ]
      );
      return { posts };
    } catch (error) {
      logError(error, "AppwriteService.getPosts");
      // Return empty array if permission denied for guests
      if (error instanceof Error && error.message.includes("not authorized")) {
        return { posts: { documents: [], total: 0 } };
      }
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
      logError(error, "AppwriteService.uploadFile");
      throw error;
    }
  }

  async deleteFile(fileId: string) {
    try {
      await this.storage.deleteFile(config.appwriteBucketId, fileId);
      return { success: true };
    } catch (error) {
      logError(error, "AppwriteService.deleteFile");
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
      logError(error, "AppwriteService.getFilePreview");
      throw error;
    }
  }

  // Convenience method to publish a draft
  async publishPost(postId: string) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        postId,
        { status: "published" }
      );
      return { post: response };
    } catch (error) {
      logError(error, "AppwriteService.publishPost");
      throw error;
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;
