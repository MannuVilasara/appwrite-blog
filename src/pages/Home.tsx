import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/services";
import { Button, Container, PostCard } from "../components";
import { useManualProgress } from "../hooks/useNProgress";
import { logError } from "../lib/errors";

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
}

const Home: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { start: startProgress, done: doneProgress } = useManualProgress();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        startProgress(); // Start NProgress
        const response = await appwriteService.getPosts();

        if (response.posts && response.posts.documents) {
          const publishedPosts = response.posts.documents
            .filter(
              (post: any) =>
                post.status === "published" || post.status === "active"
            )
            .map((post: any) => ({
              ...post,
              author: {
                name: "Blog Author",
                email: "",
                avatar: null,
              },
              tags: post.tags || [],
              publishedAt:
                post.$createdAt || post.createdAt || new Date().toISOString(),
            })) as Post[];

          // Get featured posts (first 3)
          setFeaturedPosts(publishedPosts.slice(0, 3));

          // Get recent posts (next 6)
          setRecentPosts(publishedPosts.slice(3, 9));
        } else {
          // Handle case when no posts are returned (guest user)
          setFeaturedPosts([]);
          setRecentPosts([]);
        }
      } catch (err: any) {
        logError(err, "Home.fetchPosts");
        // Don't show error for permission issues (guest users)
        if (err.message && err.message.includes("not authorized")) {
          setFeaturedPosts([]);
          setRecentPosts([]);
        } else {
          setError("Failed to load posts");
        }
      } finally {
        setLoading(false);
        doneProgress(); // Complete NProgress
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Discover amazing stories, insights, and perspectives from our
              community of writers. Explore topics ranging from technology to
              lifestyle and everything in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("recent-posts")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Articles
              </Button>
              <Link to="/posts">
                <Button variant="outline" size="lg">
                  View All Posts
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Articles
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hand-picked stories that we think you'll love
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main featured post */}
              {featuredPosts[0] && (
                <div className="lg:row-span-2">
                  <PostCard
                    id={featuredPosts[0].$id}
                    title={featuredPosts[0].title}
                    excerpt={featuredPosts[0].excerpt}
                    featuredImage={featuredPosts[0].featuredImage}
                    author={featuredPosts[0].author}
                    category={featuredPosts[0].category}
                    tags={featuredPosts[0].tags}
                    publishedAt={featuredPosts[0].publishedAt}
                    readTime={featuredPosts[0].readTime}
                    variant="featured"
                    showAuthor={true}
                    showCategory={true}
                    showTags={true}
                    showExcerpt={true}
                  />
                </div>
              )}

              {/* Secondary featured posts */}
              <div className="space-y-6">
                {featuredPosts.slice(1, 3).map(post => (
                  <PostCard
                    key={post.$id}
                    id={post.$id}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    author={post.author}
                    category={post.category}
                    tags={post.tags}
                    publishedAt={post.publishedAt}
                    readTime={post.readTime}
                    variant="compact"
                    showAuthor={true}
                    showCategory={true}
                    showTags={false}
                    showExcerpt={false}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
      {/* Recent Posts */}
      <section id="recent-posts" className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Articles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay up to date with our latest posts and insights
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
              <p className="text-center">{error}</p>
            </div>
          )}

          {recentPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map(post => (
                  <PostCard
                    key={post.$id}
                    id={post.$id}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    author={post.author}
                    category={post.category}
                    tags={post.tags}
                    publishedAt={post.publishedAt}
                    readTime={post.readTime}
                    variant="default"
                    showAuthor={true}
                    showCategory={true}
                    showTags={true}
                    showExcerpt={true}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/posts">
                  <Button variant="outline" size="lg">
                    View All Posts
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30c4.21 0 7.863 2.613 9.288 6.286"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to share your thoughts and ideas with the
                    community.
                  </p>
                  <Link to="/add-post">
                    <Button variant="primary">Write Your First Post</Button>
                  </Link>
                </div>
              </div>
            )
          )}
        </Container>
      </section>
      {/* Newsletter Section
      <section className="py-16 bg-blue-600">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Get the latest posts and updates delivered directly to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section> */}
    </div>
  );
};

export default Home;
