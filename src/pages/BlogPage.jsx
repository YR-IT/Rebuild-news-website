import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import { getBlogById } from '../services/api';
import { Home, ChevronRight, User, Calendar } from 'lucide-react';
import Footer from '../components/Footer';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  async function fetchBlog() {
    try {
      setLoading(true);
      const data = await getBlogById(id);
      setBlog(data.blog);
    } catch (err) {
      setError(err.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderContentBlocks = () => {
    if (!blog?.contentBlocks?.length) return null;

    return blog.contentBlocks.map((block, index) => {
      if (block.type === 'text') {
        return (
          <p
            key={index}
            className="mb-6 text-gray-700 leading-relaxed whitespace-pre-wrap"
          >
            {block.content}
          </p>
        );
      }

      if (block.type === 'image') {
        return (
          <div key={index} className="my-8">
            <img
              src={block.content}
              alt="Blog content"
              className="w-full rounded-lg shadow-sm"
              loading="lazy"
            />
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {loading && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">Blog Not Found</p>
            <p className="text-gray-700 mb-4">{error}</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Back to Home
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && blog && (
        <div className="bg-white">
          {/* Hero Image */}
          {blog.image && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
                  <Home size={16} /> Home
                </Link>
                <ChevronRight size={16} />

                {blog.categoryId && (
                  <>
                    <Link
                      to={`/category/${blog.categoryId.slug}`}
                      className="hover:text-blue-600"
                    >
                      {blog.categoryId.name}
                    </Link>
                    <ChevronRight size={16} />
                  </>
                )}

                <span className="font-medium text-gray-900 line-clamp-1">
                  {blog.title}
                </span>
              </div>

              {/* Category */}
              {blog.categoryId && (
                <Link
                  to={`/category/${blog.categoryId.slug}`}
                  className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {blog.categoryId.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {blog.title}
              </h1>

              {/* Meta */}
              <div className="flex gap-6 text-gray-600 mb-10 border-b pb-6">
                <div className="flex gap-2 items-center">
                  <User size={18} />
                  {blog.author || 'Unknown'}
                </div>
                <div className="flex gap-2 items-center">
                  <Calendar size={18} />
                  {formatDate(blog.date)}
                </div>
              </div>

              {/* Content */}
              <article className="prose prose-lg max-w-none">
                {renderContentBlocks()}
              </article>

              {/* Back */}
              {blog.categoryId && (
                <div className="mt-12 pt-8 border-t">
                  <Link
                    to={`/category/${blog.categoryId.slug}`}
                    className="text-blue-600 font-medium"
                  >
                    ← Back to {blog.categoryId.name}
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogPage;
