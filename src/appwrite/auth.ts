import { Account, Client, ID } from "appwrite";
import config from "../lib/config";

export class AuthService {
  client: Client;
  account: Account;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }
  async createEmailSession(email: string, password: string, name: string) {
    try {
      // Check if user is already logged in
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        await this.logout();
      }

      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return await this.loginEmailSession(email, password); // Automatically log in after account creation
      }
      return userAccount;
    } catch (error: unknown) {
      console.error("Error creating email session:", error);
      // If user already exists, try to login instead
      if (error instanceof Error && error.message.includes("already exists")) {
        console.log("User already exists, attempting to login");
        return await this.loginEmailSession(email, password);
      }
      throw error;
    }
  }

  async loginEmailSession(email: string, password: string) {
    try {
      // Check if user is already logged in
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        console.log("User already logged in");
        return currentUser;
      }

      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error: unknown) {
      console.error("Error logging in with email session:", error);
      // If session already exists, try to get current user
      if (
        error instanceof Error &&
        error.message.includes("session is active")
      ) {
        console.log("Session already active, getting current user");
        return await this.getCurrentUser();
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error: unknown) {
      // Don't log error for guests (missing scope is normal for unauthenticated users)
      if (error instanceof Error && error.message.includes("missing scope")) {
        // This is normal for guest users, don't log as error
        return null;
      }
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      // Delete current session
      await this.account.deleteSession("current");
      return true;
    } catch (error: unknown) {
      console.error("Error logging out:", error);
      // If no session exists, consider it successful logout
      if (error instanceof Error && error.message.includes("session")) {
        return true;
      }
      return false;
    }
  }
}

const authService = new AuthService();

export default authService;
