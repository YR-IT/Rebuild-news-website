import { useState, useEffect } from 'react';
import { getBlogsByCategory } from '../services/api';

const Pill = ({ text, color = 'bg-red-600' }) => (
  <span className={`text-[10px] font-semibold text-white px-2 py-1 rounded ${color}`}>
    {text}
  </span>
);

const Health = () => {
  const [healthBlogs, setHealthBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthBlogs();
  }, []);

  async function fetchHealthBlogs() {
    try {
      setLoading(true);
      const data = await getBlogsByCategory('health');
      setHealthBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching health blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section className="bg-gray-50 animate-fade-up">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 py-6">
          <h2 className="text-gray-800 font-semibold mb-3">Health</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading health articles...</div>
          </div>
        </div>
      </section>
    );
  }

  if (healthBlogs.length === 0) {
    return null; // Don't show section if no health blogs
  }

  // First blog is the featured one (latest)
  const featuredBlog = healthBlogs[0];
  // Next 4 blogs are shown in the sidebar
  const sidebarBlogs = healthBlogs.slice(1, 5);

  return (
    <section className="bg-gray-50 animate-fade-up">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 py-6">
        <h2 className="text-gray-800 font-semibold mb-3">Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Featured Blog - Large Card */}
          <div className="md:col-span-8">
            <div className="bg-white border border-gray-200 rounded overflow-hidden card-hover h-full">
              <div className="relative h-52 md:h-60">
                <img 
                  src={featuredBlog.image} 
                  alt={featuredBlog.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-3">
                <Pill text={featuredBlog.categoryId?.name?.toUpperCase() || 'HEALTH'} />
                <h3 className="mt-1.5 text-xl font-semibold text-gray-900 line-clamp-2">
                  {featuredBlog.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(featuredBlog.date)} / {featuredBlog.author}
                </p>
                <p className="text-[13px] text-gray-700 mt-2 leading-relaxed line-clamp-3">
                  {featuredBlog.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Blogs - 4 Small Tiles */}
          <div className="md:col-span-4 space-y-3">
            {sidebarBlogs.length > 0 ? (
              sidebarBlogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="bg-white border border-gray-200 rounded p-3 flex gap-3 items-start card-hover"
                >
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-20 h-16 object-cover rounded shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <Pill text={blog.categoryId?.name?.toUpperCase() || 'HEALTH'} />
                    <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                      {blog.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {formatDate(blog.date)} / {blog.author}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                No additional health articles available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Health;
