import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMainStories } from '../services/api';

const Tag = ({ children, color = 'bg-red-600' }) => (
  <span className={`text-white text-[10px] font-semibold px-2 py-1 rounded ${color}`}>
    {children}
  </span>
);

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative rounded overflow-hidden card-hover h-[400px] group">
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 p-6 text-white space-y-3">
        <div className="flex gap-2">
          <Tag color="bg-red-600">MAIN STORIES</Tag>
          <Tag>{blog.categoryId?.name?.toUpperCase() || 'FEATURED'}</Tag>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-200 line-clamp-2">
          {blog.description}
        </p>
        <p className="text-xs text-gray-300">
          {formatDate(blog.date)} / {blog.author}
        </p>
      </div>
    </div>
  );
};

const MainStories = () => {
  const [mainStories, setMainStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchMainStories();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (mainStories.length <= 2) return; // Don't auto-slide if 2 or fewer items

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = mainStories.length - 2;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [mainStories.length]);

  async function fetchMainStories() {
    try {
      setLoading(true);
      const data = await getMainStories();
      setMainStories(data.mainStories || []);
    } catch (error) {
      console.error('Error fetching main stories:', error);
      // Set empty array on error so component doesn't break
      setMainStories([]);
    } finally {
      setLoading(false);
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = mainStories.length - 2;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = mainStories.length - 2;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  if (loading) {
    return (
      <section className="bg-gray-50 animate-fade-up">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-gray-500">Loading main stories...</div>
          </div>
        </div>
      </section>
    );
  }

  if (mainStories.length === 0) {
    return null; // Don't show section if no main stories
  }

  // If only 1 story, show it centered
  if (mainStories.length === 1) {
    return (
      <section className="bg-gray-50 animate-fade-up">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Main Stories</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <BlogCard blog={mainStories[0]} />
          </div>
        </div>
      </section>
    );
  }

  // Show 2 blogs at a time
  const visibleBlogs = mainStories.slice(currentIndex, currentIndex + 2);
  
  // If we're at the end and need to wrap around
  if (visibleBlogs.length < 2 && mainStories.length >= 2) {
    visibleBlogs.push(mainStories[0]);
  }

  return (
    <section className="bg-gray-50 animate-fade-up">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Main Stories</h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleBlogs.map((blog, idx) => (
              <div 
                key={`${blog._id}-${idx}`}
                className="animate-fade-in"
              >
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        {mainStories.length > 2 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: mainStories.length - 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-8 bg-red-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MainStories;
