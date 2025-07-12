#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Validating Blog Setup...\n");

// Check if .env file exists
const envPath = path.join(__dirname, "..", ".env");
if (!fs.existsSync(envPath)) {
  console.log("❌ .env file not found");
  console.log("   Create .env file from .env.example");
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};

envContent.split("\n").forEach(line => {
  if (line.includes("=") && !line.startsWith("#")) {
    const [key, value] = line.split("=");
    envVars[key] = value.replace(/"/g, "");
  }
});

console.log("📋 Environment Variables:");

// Check Appwrite variables
const appwriteVars = [
  "VITE_APPWRITE_URL",
  "VITE_APPWRITE_PROJECT_ID",
  "VITE_APPWRITE_DATABASE_ID",
  "VITE_APPWRITE_COLLECTION_ID",
  "VITE_APPWRITE_BUCKET_ID",
];

let appwriteConfigured = true;

appwriteVars.forEach(varName => {
  const value = envVars[varName];
  if (value && value.length > 0) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    appwriteConfigured = false;
  }
});

// Check TinyMCE API key
const tinymceKey = envVars["VITE_TINYMCE_API_KEY"];
let tinymceConfigured = false;

if (
  tinymceKey &&
  tinymceKey !== "your-tinymce-api-key-here" &&
  tinymceKey.length > 10
) {
  console.log("✅ VITE_TINYMCE_API_KEY: Set");
  tinymceConfigured = true;
} else {
  console.log("❌ VITE_TINYMCE_API_KEY: Missing or invalid");
  console.log("   Get your free API key at: https://www.tiny.cloud/get-tiny/");
}

console.log("\n🎯 Setup Status:");

if (appwriteConfigured) {
  console.log("✅ Appwrite: Configured");
} else {
  console.log("❌ Appwrite: Missing configuration");
  console.log("   Check your Appwrite console for the correct IDs");
}

if (tinymceConfigured) {
  console.log("✅ TinyMCE: Configured");
} else {
  console.log("❌ TinyMCE: Needs API key");
  console.log("   1. Visit https://www.tiny.cloud/get-tiny/");
  console.log("   2. Sign up for free account");
  console.log("   3. Get API key from dashboard");
  console.log("   4. Add to .env file");
}

console.log("\n📚 Next Steps:");

if (!appwriteConfigured) {
  console.log("1. Complete Appwrite setup in your console");
}

if (!tinymceConfigured) {
  console.log("2. Get TinyMCE API key and add to .env");
}

console.log(
  "3. Configure Appwrite database permissions (Role: Any, Permission: Read)"
);
console.log("4. Restart development server: npm run dev");

if (appwriteConfigured && tinymceConfigured) {
  console.log("\n🎉 Setup looks good! Start the dev server with: npm run dev");
} else {
  console.log(
    "\n⚠️  Complete the missing configuration and run this script again."
  );
}
