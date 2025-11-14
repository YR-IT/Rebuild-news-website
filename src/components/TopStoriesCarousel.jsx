import { useState, useEffect } from 'react';
import { getNewsCarousel } from '../services/api';

const TopStoriesCarousel = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getNewsCarousel();
        // Duplicate the stories array to create seamless infinite loop
        const duplicatedStories = [...(data.newsCarousel || []), ...(data.newsCarousel || [])];
        setStories(duplicatedStories);
      } catch (error) {
        console.error('Failed to load top stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  if (loading || stories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Top Stories Label */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Top Stories
            </span>
          </div>

          {/* Scrolling Stories Container */}
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10"></div>
            
            <div className="animate-scroll flex gap-6">
              {stories.map((story, index) => (
                <div
                  key={`${story._id}-${index}`}
                  className="flex items-center gap-2 shrink-0 group cursor-pointer"
                >
                  <img
                    src={story.image}
                    alt={story.headline}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-red-600 transition-colors"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors whitespace-nowrap">
                    {story.headline}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TopStoriesCarousel;
