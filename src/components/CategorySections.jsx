import { useState, useEffect } from 'react';
import { getCategories, getBlogsByCategory } from '../services/api';

const Pill = ({ text, color = 'bg-red-600' }) => (
  <span className={`text-[10px] font-semibold text-white px-2 py-1 rounded ${color}`}>
    {text}
  </span>
);

const CategorySection = ({ category }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryBlogs();
  }, [category.slug]);

  async function fetchCategoryBlogs() {
    try {
      setLoading(true);
      const data = await getBlogsByCategory(category.slug);
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error(`Error fetching ${category.name} blogs:`, error);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="bg-gray-50 animate-fade-up">
        <div className="max-w-6xl mx-auto px-2 sm:px-3 py-6">
          <h2 className="text-gray-800 font-semibold mb-3">{category.name}</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading {category.name.toLowerCase()} articles...</div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null; 
  }

  const featuredBlog = blogs[0];
  const sidebarBlogs = blogs.slice(1, 5);

  return (
    <section className="bg-gray-50 animate-fade-up">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 py-6">
        <h2 className="text-gray-800 font-semibold mb-3">{category.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div
              className="bg-white border border-gray-200 rounded overflow-hidden card-hover h-full block"
              onClick={() => window.location.href = `/blog/${featuredBlog.id || featuredBlog._id}`}
            >
              <div className="relative h-52 md:h-60">
                <img
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <Pill text={featuredBlog.categoryId?.name?.toUpperCase() || category.name.toUpperCase()} />
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
          <div className="md:col-span-4 space-y-3">
            {sidebarBlogs.length > 0 ? (
              sidebarBlogs.map((blog) => (
                <div
                  key={blog.id || blog._id}
                  className="bg-white border border-gray-200 rounded p-3 flex gap-3 items-start card-hover"
                  onClick={() => window.location.href = `/blog/${blog.id || blog._id}`}
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-20 h-16 object-cover rounded shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <Pill text={blog.categoryId?.name?.toUpperCase() || category.name.toUpperCase()} />
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
                No additional articles available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategorySections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>

      <div className="flex items-center justify-center py-12">

      </div>
        <div className="text-gray-500">Loading categories...</div>
  
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      {categories.map((category) => (
        <CategorySection key={category._id} category={category} />
      ))}
    </>
  );
};

export default CategorySections;
