import config from "../lib/config";
import { Client, Account, ID } from "appwrite";

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
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                this.loginEmailSession(email, password); // Automatically log in after account creation
            }
            return userAccount;
        } catch (error) {
            console.error("Error creating email session:", error);
            throw error;
        }
    }

    async loginEmailSession(email: string, password: string) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.error("Error logging in with email session:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
        return null; // Return null if no user is found
    }

    async logout() {
        try {
            await this.account.deleteSession("current");
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
        }
        return false;
    }

}

const authService = new AuthService();

export default authService;