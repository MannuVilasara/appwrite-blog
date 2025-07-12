import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/services";
import { AuthLayout, PostForm } from "../components";

const EditPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError("Post slug is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await appwriteService.getPost(slug);

        if (response.post) {
          setPost(response.post);
        } else {
          setError("Post not found");
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <AuthLayout authentication={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout authentication={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Post
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate("/posts")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Back to Posts
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout authentication={true}>
      <PostForm post={post} isEdit={true} />
    </AuthLayout>
  );
};

export default EditPost;
