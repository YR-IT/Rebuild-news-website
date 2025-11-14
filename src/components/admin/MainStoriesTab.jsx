import BlogsTable from './BlogsTable';

export default function MainStoriesTab({
  mainStories,
  mainStoriesLoading,
  blogs,
  blogsLoading,
  truncateText,
  formatDate,
  handleAddToMainStories,
  handleRemoveFromMainStories,
}) {
  const availableBlogs = blogs.filter(blog => !mainStories.some(ms => ms._id === blog._id));

  return (
    <>
      {/* Current Main Stories */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Main Stories</h2>
        
        {mainStoriesLoading ? (
          <div className="text-center py-8 text-gray-500">Loading main stories...</div>
        ) : mainStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No main stories yet. Add blogs from below!</div>
        ) : (
          <BlogsTable
            blogs={mainStories}
            loading={false}
            truncateText={truncateText}
            formatDate={formatDate}
            onDelete={handleRemoveFromMainStories}
            actionType="delete"
          />
        )}
      </div>

      {/* Add to Main Stories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Add to Main Stories</h2>
        
        {blogsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading blogs...</div>
        ) : availableBlogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">All blogs are already in main stories.</div>
        ) : (
          <BlogsTable
            blogs={availableBlogs}
            loading={false}
            truncateText={truncateText}
            formatDate={formatDate}
            onAdd={handleAddToMainStories}
            actionType="add"
          />
        )}
      </div>
    </>
  );
}
