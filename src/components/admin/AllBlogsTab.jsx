import BlogsTable from './BlogsTable';

export default function AllBlogsTab({
  blogs,
  blogsLoading,
  truncateText,
  formatDate,
  openEditModal,
  openDeleteBlogModal,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">All Blogs</h2>
      
      {blogsLoading ? (
        <div className="text-center py-8 text-gray-500">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No blogs yet. Add your first blog!</div>
      ) : (
        <BlogsTable
          blogs={blogs}
          loading={false}
          truncateText={truncateText}
          formatDate={formatDate}
          onEdit={openEditModal}
          onDelete={openDeleteBlogModal}
          actionType="edit"
        />
      )}
    </div>
  );
}
