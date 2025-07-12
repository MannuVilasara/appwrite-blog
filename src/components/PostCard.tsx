import React from "react";
import { Link } from "react-router-dom";
import { formatDateCompact } from "../lib/dateUtils";
import { getFilePreviewUrl, isFileId } from "../lib/fileUtils";

interface Author {
  name: string;
  email: string;
  avatar?: string;
}

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage?: string;
  author: Author;
  category?: string;
  tags?: string[];
  publishedAt: string;
  readTime?: number;
  status?: "draft" | "published" | "archived";
  variant?: "default" | "compact" | "featured";
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  excerpt,
  featuredImage,
  author,
  category,
  tags = [],
  publishedAt,
  readTime,
  status = "published",
  variant = "default",
  showAuthor = true,
  showCategory = true,
  showTags = true,
  showExcerpt = true,
  className = "",
}) => {
  // Convert file ID to view URL if needed (free plan compatible)
  const imageUrl =
    featuredImage && isFileId(featuredImage)
      ? getFilePreviewUrl(featuredImage)
      : featuredImage;

  // Truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  // Base card styles
  const baseCardStyles = `
    bg-white rounded-xl shadow-sm border border-gray-200
    hover:shadow-lg hover:border-gray-300
    transition-all duration-300 overflow-hidden
    group cursor-pointer
  `;

  // Variant styles
  const variantStyles = {
    default: "flex flex-col",
    compact: "flex flex-row h-32",
    featured: "flex flex-col lg:flex-row lg:h-80",
  };

  const cardClasses = `${baseCardStyles} ${variantStyles[variant]} ${className}`;

  // Status badge
  const StatusBadge = () => {
    if (status === "published") return null;

    const statusColors = {
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`
        absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-md
        ${statusColors[status]}
      `}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (variant === "compact") {
    return (
      <Link to={`/post/${id}`} className={cardClasses}>
        <StatusBadge />

        {/* Image */}
        {imageUrl && (
          <div className="w-32 h-full flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Category */}
            {showCategory && category && (
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                {category}
              </span>
            )}

            {/* Title */}
            <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {truncateText(title, 60)}
            </h3>
          </div>

          {/* Meta */}
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span>{formatDateCompact(publishedAt)}</span>
            {readTime && (
              <>
                <span className="mx-2">•</span>
                <span>{readTime} min read</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link to={`/post/${id}`} className={cardClasses}>
        <StatusBadge />

        {/* Image */}
        {imageUrl && (
          <div className="w-full lg:w-1/2 h-64 lg:h-full">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            {/* Category & Tags */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {showCategory && category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {category}
                </span>
              )}
              {showTags &&
                tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4">
              {title}
            </h2>

            {/* Excerpt */}
            {showExcerpt && excerpt && (
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {truncateText(excerpt, 200)}
              </p>
            )}
          </div>

          {/* Author & Meta */}
          <div className="flex items-center justify-between">
            {showAuthor && (
              <div className="flex items-center">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {author.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatDateCompact(publishedAt)}</span>
                    {readTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{readTime} min read</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/post/${id}`} className={cardClasses}>
      <div className="relative">
        <StatusBadge />

        {/* Image */}
        {imageUrl && (
          <div className="aspect-video w-full">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Category & Tags */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            {showCategory && category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                {category}
              </span>
            )}
            {showTags &&
              tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
            {title}
          </h3>

          {/* Excerpt */}
          {showExcerpt && excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}
        </div>

        {/* Author & Meta */}
        <div className="pt-4 border-t border-gray-100">
          {showAuthor ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {author.name}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <span>{formatDateCompact(publishedAt)}</span>
                {readTime && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{readTime} min read</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <span>{formatDateCompact(publishedAt)}</span>
              {readTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{readTime} min read</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
