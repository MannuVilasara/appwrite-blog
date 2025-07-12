import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import appwriteService from "../appwrite/services";
import { Button, Container, Input, PostCard, Select } from "../components";
import { useManualProgress } from "../hooks/useNProgress";

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

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { start: startProgress, done: doneProgress } = useManualProgress();

  // Filter states
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  // Categories for filter
  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "travel", label: "Travel" },
    { value: "coding", label: "Coding" },
    { value: "business", label: "Business" },
    { value: "health", label: "Health & Wellness" },
    { value: "food", label: "Food & Cooking" },
    { value: "entertainment", label: "Entertainment" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        startProgress(); // Start NProgress

        // Build queries based on filters
        const queries = [Query.equal("status", "published")];

        if (selectedCategory) {
          queries.push(Query.equal("category", selectedCategory));
        }

        // Add sorting
        switch (sortBy) {
          case "newest":
            queries.push(Query.orderDesc("$createdAt"));
            break;
          case "oldest":
            queries.push(Query.orderAsc("$createdAt"));
            break;
          case "title":
            queries.push(Query.orderAsc("title"));
            break;
          case "title-desc":
            queries.push(Query.orderDesc("title"));
            break;
          default:
            queries.push(Query.orderDesc("$createdAt"));
        }

        const response = await appwriteService.getPosts(queries);

        if (response.posts && response.posts.documents) {
          let filteredPosts = response.posts.documents.map((post: any) => ({
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

          // Apply search filter (client-side for now)
          if (searchTerm) {
            filteredPosts = filteredPosts.filter(
              post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some(tag =>
                  tag.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
          }

          setPosts(filteredPosts);
        }
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
        doneProgress(); // Complete NProgress
      }
    };

    fetchPosts();
  }, [selectedCategory, sortBy]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURLParams();
    // Trigger a re-fetch or filter existing posts
    const filteredPosts = posts.filter(
      post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setPosts(filteredPosts);
  };

  // Update URL parameters
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  };

  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateURLParams();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateURLParams();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setSearchParams({});
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <Container>
          <div className="py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                All Posts
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Explore our collection of articles covering various topics and
                interests
              </p>

              {/* Search and Filters */}
              <div className="bg-gray-50 rounded-xl p-6">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Search posts by title, content, or tags..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        leftIcon={
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
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        }
                      />
                    </div>
                    <Button type="submit" variant="primary">
                      Search
                    </Button>
                  </div>
                </form>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Select
                      label="Category"
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={e => handleCategoryChange(e.target.value)}
                      selectSize="sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      label="Sort by"
                      options={sortOptions}
                      value={sortBy}
                      onChange={e => handleSortChange(e.target.value)}
                      selectSize="sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    size="sm"
                  >
                    Clear Filters
                  </Button>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedCategory) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">
                      Active filters:
                    </span>
                    {searchTerm && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Category:{" "}
                        {
                          categoryOptions.find(
                            cat => cat.value === selectedCategory
                          )?.label
                        }
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <Container>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
              <p className="text-center">{error}</p>
            </div>
          )}

          {posts.length > 0 ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {posts.length} post{posts.length === 1 ? "" : "s"} found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
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
            </>
          ) : (
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
                  No posts found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory
                    ? "Try adjusting your search criteria or filters."
                    : "Be the first to share your thoughts and ideas."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {(searchTerm || selectedCategory) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                  <Link to="/add-post">
                    <Button variant="primary">Write a Post</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Posts;
