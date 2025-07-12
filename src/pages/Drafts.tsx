import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import appwriteService from "../appwrite/services";
import { Button, Container, PostCard } from "../components";
import { useManualProgress } from "../hooks/useNProgress";
import type { RootState } from "../store/store";

interface Post {
  $id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime?: number;
  status: string;
  userID: string;
  $createdAt: string;
  $updatedAt: string;
}

const Drafts: React.FC = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.user) as any;
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { start: startProgress, done: doneProgress } = useManualProgress();

  useEffect(() => {
    // Redirect if not authenticated
    if (!userData) {
      navigate("/login");
      return;
    }

    fetchDrafts();
  }, [userData, navigate]);

  const fetchDrafts = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      setError("");
      startProgress(); // Start NProgress

      // Get only draft posts by current user
      const queries = [
        Query.equal("status", "draft"),
        Query.equal("userID", userData.$id),
        Query.orderDesc("$updatedAt"), // Show most recently updated first
      ];

      const response = await appwriteService.getPosts(queries);

      if (response.posts && response.posts.documents) {
        const draftPosts = response.posts.documents.map((post: any) => ({
          ...post,
          author: {
            name: "Blog Author",
            email: "",
            avatar: null,
          },
          tags: post.tags || [],
          publishedAt:
            post.$updatedAt || post.$createdAt || new Date().toISOString(),
        })) as Post[];

        setDrafts(draftPosts);
      } else {
        setDrafts([]);
      }
    } catch (err: any) {
      console.error("Error fetching drafts:", err);
      setError("Failed to load drafts");
    } finally {
      setLoading(false);
      doneProgress(); // Complete NProgress
    }
  };

  if (!userData) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-16">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading drafts...</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="py-12">
          {/* Header */}
          <div className="mb-8">
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <Link
                    to="/"
                    className="hover:text-gray-700 transition-colors"
                  >
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
                <li className="text-gray-900 font-medium">My Drafts</li>
              </ol>
            </nav>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  My Drafts
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your unpublished posts and drafts
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Link to="/add-post">
                  <Button variant="primary">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Post
                  </Button>
                </Link>
                <Link to="/posts">
                  <Button variant="outline">View Published</Button>
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
              <p className="text-center">{error}</p>
            </div>
          )}

          {/* Drafts List */}
          {drafts.length > 0 ? (
            <>
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">
                  <strong>{drafts.length}</strong> draft
                  {drafts.length !== 1 ? "s" : ""} found. These posts are only
                  visible to you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drafts.map(post => (
                  <div key={post.$id} className="relative">
                    <PostCard
                      id={post.$id}
                      title={post.title}
                      excerpt={post.excerpt}
                      featuredImage={post.featuredImage}
                      author={post.author}
                      category={post.category}
                      tags={post.tags}
                      publishedAt={post.$updatedAt}
                      readTime={post.readTime}
                      variant="default"
                      showAuthor={false}
                      showCategory={true}
                      showTags={true}
                      showExcerpt={true}
                    />

                    {/* Draft Actions Overlay */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 text-center">
                        Last updated:{" "}
                        {new Date(post.$updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No drafts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start writing and save posts as drafts before publishing them.
                </p>
                <Link to="/add-post">
                  <Button variant="primary">Create Your First Draft</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Drafts;
