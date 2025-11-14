import { useState, useEffect } from 'react';
import { getBlogs } from '../services/api';

const Pill = ({ text, color = 'bg-red-600' }) => (
  <span className={`text-[10px] font-semibold text-white px-2 py-1 rounded ${color}`}>
    {text}
  </span>
);

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-3 flex gap-3 items-start card-hover">
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="w-20 h-16 object-cover rounded shrink-0" 
      />
      <div className="min-w-0 flex-1">
        <Pill text={blog.categoryId?.name?.toUpperCase() || 'BLOG'} />
        <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
          {blog.title}
        </h4>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {formatDate(blog.date)} / {blog.author}
        </p>
      </div>
    </div>
  );
};

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  async function fetchLatestBlogs() {
    try {
      setLoading(true);
      const data = await getBlogs();
      // Get the 10 most recent blogs (already sorted by date in backend)
      setBlogs((data.blogs || []).slice(0, 10));
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-50 animate-fade-up">
      <div className="w-full px-0">
        <h2 className="text-gray-800 font-semibold mb-3 px-4 sm:px-0">Our Latest Blogs</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 text-sm">Loading latest blogs...</div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-12">
            No blogs available yet.
          </div>
        ) : (
          <div className="space-y-3 px-4 sm:px-0">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogs;
