import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppwriteService } from "../appwrite/services";
import { Button, Container } from "../components";
import { useManualProgress } from "../hooks/useNProgress";
import { logError } from "../lib/errors";
import { formatDate } from "../lib/utils";
import type { RootState } from "../store/store";

const appwriteService = new AppwriteService();

interface SinglePostProps {}

interface Author {
  name: string;
  email: string;
}

interface Post {
  $id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: "active" | "inactive";
  category: string;
  tags: string[];
  userID: string; // Changed from userId to match Appwrite database
  $createdAt: string;
  $updatedAt: string;
  author?: Author;
}

const SinglePost: React.FC<SinglePostProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.user) as any;
  const { start: startProgress, done: doneProgress } = useManualProgress();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) {
      setError("Post not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      startProgress(); // Start NProgress

      const response = await appwriteService.getPost(slug);

      if (response && response.post) {
        const postData = response.post as any;

        // Normalize the post data with author information
        const normalizedPost = {
          ...postData,
          author: {
            name: "Blog Author",
            email: "",
            avatar: null,
          },
          tags: postData.tags || [],
          publishedAt:
            postData.$createdAt ||
            postData.createdAt ||
            new Date().toISOString(),
        };

        setPost(normalizedPost);

        // Set page title
        document.title = `${postData.title} | Blog Platform`;
      } else {
        setError("Post not found");
      }
    } catch (error: any) {
      logError(error, "SinglePost.fetchPost");
      setError("Failed to load post. Please try again.");
    } finally {
      setLoading(false);
      doneProgress(); // Complete NProgress
    }
  };

  const getPreviewUrl = (fileId: string): string => {
    // Use the utility function for consistency (uses /view instead of /preview)
    return getPreviewUrl(fileId);
  };

  const handleDeletePost = async () => {
    if (!post || !slug) return;

    try {
      setDeleting(true);

      // Delete the featured image if it exists
      if (post.featuredImage) {
        try {
          await appwriteService.deleteFile(post.featuredImage);
        } catch (error) {
          logError(error, "SinglePost.deleteFeaturedImage");
          // Continue with post deletion even if image deletion fails
        }
      }

      // Delete the post
      await appwriteService.deletePost(slug);

      // Navigate back to posts page
      navigate("/posts");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Using utility function for date formatting instead of local function

  const isAuthor = userData && post && userData.$id === post.userID;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Container>
          <div className="py-16">
            <div className="animate-pulse space-y-8">
              {/* Header skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>

              {/* Image skeleton */}
              <div className="aspect-video bg-gray-200 rounded-xl"></div>

              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Container>
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "The post you're looking for doesn't exist or has been removed."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(-1)}
                variant="secondary"
                className="w-full"
              >
                Go Back
              </Button>
              <Button
                onClick={() => navigate("/posts")}
                variant="primary"
                className="w-full"
              >
                Browse All Posts
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Container>
        <article className="py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-gray-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="hover:text-gray-700 transition-colors"
                >
                  Posts
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li className="text-gray-900 font-medium truncate">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* Post Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
                <span className="text-gray-400">•</span>
                <time
                  className="text-sm text-gray-500"
                  dateTime={post.$createdAt}
                >
                  {formatDate(post.$createdAt)}
                </time>
              </div>

              {isAuthor && (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => navigate(`/edit-post/${slug}`)}
                    variant="secondary"
                    size="sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Post
                  </Button>

                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                {!imageError ? (
                  <>
                    {imageLoading && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    <img
                      src={getPreviewUrl(post.featuredImage)}
                      alt={post.title}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                      }}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {parse(post.content || "")}
            </div>
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Published on {formatDate(post.$createdAt)}
                  {post.$updatedAt !== post.$createdAt && (
                    <span> • Updated on {formatDate(post.$updatedAt)}</span>
                  )}
                </p>
              </div>

              {/* Share buttons */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could add a toast notification here
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Copy link"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Posts or Navigation */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button onClick={() => navigate(-1)} variant="secondary">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Go Back
            </Button>

            <Button onClick={() => navigate("/posts")} variant="primary">
              View All Posts
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </Container>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Post</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{post?.title}"? This action
              cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeletePost}
                variant="primary"
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                {deleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Post"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
