import { Editor } from "@tinymce/tinymce-react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import appwriteService from "../appwrite/services";
import config from "../lib/config";

interface RTEProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  height?: number;
  isRequired?: boolean;
  className?: string;
}

const RTE = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Start writing...",
  disabled = false,
  error,
  height = 400,
  isRequired = false,
  className = "",
}: RTEProps<T>) => {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const hasValidApiKey =
    apiKey && apiKey !== "no-api-key" && apiKey !== "your-tinymce-api-key-here";

  const handleImageUpload = async (blobInfo: any) => {
    try {
      const file = blobInfo.blob();
      console.log("🖼️ Uploading image:", file.name, file.size);

      const response = await appwriteService.uploadFile(file);
      console.log("✅ Image uploaded successfully:", response.$id);

      // Return the view URL instead of preview URL (free plan compatible)
      const viewUrl = `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${response.$id}/view?project=${config.appwriteProjectId}`;
      console.log("🔗 Image view URL:", viewUrl);

      return viewUrl;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  };

  // Show warning if no API key is configured
  if (!hasValidApiKey) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 bg-yellow-50">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-yellow-800">
              TinyMCE API Key Required
            </h3>
            <p className="mt-1 text-sm text-yellow-600">
              To use the rich text editor, you need to add a TinyMCE API key.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-yellow-700">
                <strong>Steps to setup:</strong>
              </p>
              <ol className="text-xs text-yellow-700 text-left space-y-1">
                <li>
                  1. Visit{" "}
                  <a
                    href="https://www.tiny.cloud/get-tiny/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    tiny.cloud/get-tiny
                  </a>
                </li>
                <li>2. Sign up for a free account</li>
                <li>3. Get your API key from the dashboard</li>
                <li>
                  4. Add it to your .env file as:{" "}
                  <code className="bg-yellow-200 px-1 rounded">
                    VITE_TINYMCE_API_KEY="your-key"
                  </code>
                </li>
                <li>5. Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Editor Container */}
      <div
        className={`relative rounded-lg border ${
          error
            ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-500"
            : "border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500"
        } focus-within:ring-1 transition-colors duration-200`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Editor
              apiKey={apiKey}
              value={value || ""}
              onEditorChange={content => onChange(content)}
              init={{
                height,
                menubar: false,
                branding: false,
                resize: true,
                statusbar: true,
                elementpath: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "autoresize",
                  "codesample",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | codesample | removeformat | fullscreen preview | help",
                content_style: `
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; 
                    font-size: 14px; 
                    line-height: 1.6; 
                    color: #374151;
                    padding: 16px;
                  }
                  p { margin: 0 0 1em 0; }
                  h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em 0; font-weight: 600; }
                  blockquote { 
                    border-left: 4px solid #e5e7eb; 
                    margin: 1em 0; 
                    padding: 0.5em 1em; 
                    background: #f9fafb; 
                  }
                  code { 
                    background: #f3f4f6; 
                    padding: 2px 4px; 
                    border-radius: 3px; 
                    font-family: 'Monaco', 'Consolas', monospace; 
                  }
                  pre { 
                    background: #1f2937; 
                    color: #f9fafb; 
                    padding: 1em; 
                    border-radius: 6px; 
                    overflow-x: auto; 
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                  }
                  .img-responsive { width: 100%; height: auto; }
                  .rounded { border-radius: 8px; }
                  .rounded-full { border-radius: 50%; }
                `,
                placeholder,
                paste_data_images: true,
                paste_as_text: false,
                paste_auto_cleanup_on_paste: true,
                image_advtab: true,
                image_uploadtab: true,
                image_caption: true,
                image_title: true,
                file_picker_types: "image",
                automatic_uploads: true,
                images_reuse_filename: true,
                images_file_types: "jpeg,jpg,png,gif,webp",
                image_class_list: [
                  { title: "Responsive", value: "img-responsive" },
                  { title: "Rounded", value: "rounded" },
                  { title: "Circle", value: "rounded-full" },
                ],
                file_picker_callback: (
                  callback: any,
                  _value: any,
                  meta: any
                ) => {
                  // Create file input for image selection
                  if (meta.filetype === "image") {
                    const input = document.createElement("input");
                    input.setAttribute("type", "file");
                    input.setAttribute("accept", "image/*");

                    input.onchange = async function () {
                      const file = (this as HTMLInputElement).files?.[0];
                      if (file) {
                        try {
                          console.log("📁 File picker: uploading", file.name);
                          const response =
                            await appwriteService.uploadFile(file);
                          const imageUrl = `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${response.$id}/view?project=${config.appwriteProjectId}`;
                          callback(imageUrl, { alt: file.name });
                        } catch (error) {
                          console.error("File picker upload failed:", error);
                        }
                      }
                    };

                    input.click();
                  }
                },
                images_upload_handler: (blobInfo: any) => {
                  return new Promise((resolve, reject) => {
                    handleImageUpload(blobInfo)
                      .then(imageUrl => {
                        resolve(imageUrl);
                      })
                      .catch(error => {
                        console.error("Image upload error:", error);
                        reject(error.message || "Image upload failed");
                      });
                  });
                },
                setup: (editor: any) => {
                  // Custom setup if needed
                  editor.on("init", () => {
                    if (disabled) {
                      editor.mode.set("readonly");
                    }
                    // Log successful initialization in development
                    if (import.meta.env.DEV) {
                      console.log("✅ TinyMCE Editor initialized successfully");
                    }
                  });
                },
                skin: "oxide",
                content_css: "default",
                directionality: "ltr",
                language: "en",
                browser_spellcheck: true,
                contextmenu: "link image table",
              }}
              disabled={disabled}
            />
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center mt-1">
          <svg
            className="w-4 h-4 mr-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Use the toolbar above to format your content. You can add links, images,
        lists, and more.
      </p>
    </div>
  );
};

export default RTE;
