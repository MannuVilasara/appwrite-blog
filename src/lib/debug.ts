// Debug utility to check Appwrite configuration and permissions
import config from "../lib/config";

export const debugAppwrite = () => {
  console.group("🔍 Appwrite Debug Info");

  console.log("📋 Configuration:");
  console.log("- URL:", config.appwriteUrl);
  console.log(
    "- Project ID:",
    config.appwriteProjectId ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "- Database ID:",
    config.appwriteDatabaseId ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "- Collection ID:",
    config.appwriteCollectionId ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "- Bucket ID:",
    config.appwriteBucketId ? "✅ Set" : "❌ Missing"
  );

  console.log("\n📝 TinyMCE Configuration:");
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const hasValidApiKey =
    apiKey && apiKey !== "no-api-key" && apiKey !== "your-tinymce-api-key-here";
  console.log(
    "- API Key:",
    hasValidApiKey ? "✅ Set" : "❌ Missing or invalid"
  );
  if (!hasValidApiKey) {
    console.log(
      "  → Get your free API key at: https://www.tiny.cloud/get-tiny/"
    );
  }

  console.log("\n📝 Common Issues & Solutions:");
  console.log("1. Guest access denied:");
  console.log("   - Go to Appwrite Console > Database > Collection");
  console.log("   - Add permission: Role: Any, Action: Read");

  console.log("2. TinyMCE not loading:");
  console.log("   - Add VITE_TINYMCE_API_KEY to your .env file");
  console.log("   - Restart the development server");

  console.log("3. User already exists error:");
  console.log("   - This is normal - the app will try to login instead");

  console.log("4. Session already active:");
  console.log("   - The app handles this automatically");

  console.log("5. Missing account scope:");
  console.log("   - This is normal for guest users");

  console.groupEnd();
};

export const createSamplePosts = async () => {
  console.log("🚀 Creating sample posts for testing...");
  // This would create sample posts if user is authenticated
  // Implementation depends on your needs
};
