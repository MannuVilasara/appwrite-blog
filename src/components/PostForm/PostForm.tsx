import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/services";
import {
  CATEGORY_OPTIONS,
  FIELD_CONSTRAINTS,
  STATUS_OPTIONS,
  VALIDATION_PATTERNS,
} from "../../lib/constants";
import { handleApiError, logError } from "../../lib/errors";
import { generateSlug, processTags } from "../../lib/utils";
import type { RootState } from "../../store/store";
import type { PostFormData, PostFormProps } from "../../types";
import { Button, Input, RTE, Select } from "../index";

const PostForm: React.FC<PostFormProps> = ({ post, isEdit = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const user = useSelector((state: RootState) => state.auth.user) as any;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      category: post?.category || "",
      tags: post?.tags?.join(", ") || "",
      status: post?.status || "draft",
    },
  });

  // Watch title to auto-generate slug
  const watchedTitle = watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !isEdit) {
      const slug = generateSlug(watchedTitle);
      setValue("slug", slug);
    }
  }, [watchedTitle, setValue, isEdit]);

  // Categories for dropdown
  const categoryOptions = CATEGORY_OPTIONS;

  // Status options
  const statusOptions = STATUS_OPTIONS;

  // Handle image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const onSubmit = async (data: PostFormData) => {
    if (!user?.$id) {
      setSubmitError("You must be logged in to create a post");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Process tags
      const tagsArray = processTags(data.tags);

      // Handle featured image upload
      let featuredImageId = post?.featuredImage;
      if (data.featuredImage && data.featuredImage[0]) {
        try {
          const uploadResponse = await appwriteService.uploadFile(
            data.featuredImage[0]
          );
          featuredImageId = uploadResponse.$id;
        } catch (error) {
          logError(error, "PostForm.uploadFile");
          setSubmitError("Failed to upload featured image");
          setIsSubmitting(false);
          return;
        }
      }

      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        tags: tagsArray,
        status: data.status,
        featuredImage: featuredImageId,
        userID: user.$id,
      };

      if (isEdit && post) {
        // Update existing post (exclude slug to prevent changes)
        const { slug, ...updateData } = postData;
        await appwriteService.updatePost(post.$id, updateData);

        // Use the original post's slug for navigation
        // Note: In our setup, the slug is stored as the document ID
        const navigationSlug = post.slug || post.$id;
        navigate(`/post/${navigationSlug}`);
      } else {
        // Create new post
        await appwriteService.createPost(postData);
        navigate(`/post/${data.slug}`);
      }
    } catch (error: any) {
      logError(error, "PostForm.onSubmit");
      setSubmitError(handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Post" : "Create New Post"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEdit
            ? "Update your blog post with the latest information"
            : "Share your thoughts and ideas with the world"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Global Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{submitError}</span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Input
              label="Post Title"
              placeholder="Enter an engaging title for your post"
              error={errors.title?.message}
              isRequired
              {...register("title", {
                required: "Title is required",
                ...FIELD_CONSTRAINTS.title,
              })}
            />

            {/* Slug */}
            <Input
              label="URL Slug"
              placeholder="post-url-slug"
              helperText={
                isEdit
                  ? "Slug cannot be changed after publishing to maintain URL consistency."
                  : "This will be used in the post URL. Use lowercase letters, numbers, and hyphens only."
              }
              error={errors.slug?.message}
              isRequired={!isEdit}
              disabled={isEdit}
              {...register("slug", {
                required: isEdit ? false : "Slug is required",
                ...VALIDATION_PATTERNS.slug,
                ...FIELD_CONSTRAINTS.slug,
              })}
            />

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Write a brief summary of your post (150-300 characters)"
                rows={3}
                className={`
                  w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200 resize-vertical
                  ${
                    errors.excerpt
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }
                `}
                {...register("excerpt", {
                  required: "Excerpt is required",
                  ...FIELD_CONSTRAINTS.excerpt,
                })}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.excerpt.message}
                </p>
              )}
            </div>

            {/* Content Editor */}
            <RTE
              name="content"
              control={control}
              label="Post Content"
              placeholder="Start writing your blog post here..."
              height={500}
              isRequired
              error={errors.content?.message}
            />
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Publish Settings
              </h3>

              {/* Status */}
              <div className="mb-4">
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <Select
                      label="Status"
                      options={statusOptions}
                      placeholder="Select status"
                      error={errors.status?.message}
                      isRequired
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      label="Category"
                      options={categoryOptions}
                      placeholder="Select a category"
                      error={errors.category?.message}
                      isRequired
                      {...field}
                    />
                  )}
                />
              </div>

              {/* Tags */}
              <Input
                label="Tags"
                placeholder="Enter tags separated by commas"
                helperText="e.g., react, javascript, web development"
                error={errors.tags?.message}
                {...register("tags", {
                  ...VALIDATION_PATTERNS.tags,
                })}
              />
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Featured Image
              </h3>

              {/* Image Preview */}
              {(imagePreview || post?.featuredImage) && (
                <div className="mb-4">
                  <img
                    src={imagePreview || post?.featuredImage}
                    alt="Featured image preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register("featuredImage")}
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px, max 5MB
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Publishing..."
                  : isEdit
                    ? "Update Post"
                    : "Publish Post"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate("/posts")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
