import BlogsTable from './BlogsTable';

export default function TrendingStoriesTab({
  trendingStories,
  trendingStoriesLoading,
  blogs,
  blogsLoading,
  truncateText,
  formatDate,
  handleAddToTrendingStories,
  handleRemoveFromTrendingStories,
}) {
  const availableBlogs = blogs.filter(blog => !trendingStories.some(ts => ts._id === blog._id));

  return (
    <>
      {/* Current Trending Stories */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Trending Stories</h2>
        
        {trendingStoriesLoading ? (
          <div className="text-center py-8 text-gray-500">Loading trending stories...</div>
        ) : trendingStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No trending stories yet. Add blogs from below!</div>
        ) : (
          <BlogsTable
            blogs={trendingStories}
            loading={false}
            truncateText={truncateText}
            formatDate={formatDate}
            onDelete={handleRemoveFromTrendingStories}
            actionType="delete"
          />
        )}
      </div>

      {/* Add to Trending Stories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Add to Trending Stories</h2>
        
        {blogsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading blogs...</div>
        ) : availableBlogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">All blogs are already in trending stories.</div>
        ) : (
          <BlogsTable
            blogs={availableBlogs}
            loading={false}
            truncateText={truncateText}
            formatDate={formatDate}
            onAdd={handleAddToTrendingStories}
            actionType="add"
          />
        )}
      </div>
    </>
  );
}
