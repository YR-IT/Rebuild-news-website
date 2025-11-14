import { Trash2, Pencil, Plus } from 'lucide-react';

export default function BlogsTable({
  blogs,
  loading,
  truncateText,
  formatDate,
  onEdit,
  onDelete,
  onAdd,
  actionType = 'edit', // 'edit', 'add', or 'delete'
}) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading blogs...</div>;
  }

  if (blogs.length === 0) {
    return <div className="text-center py-8 text-gray-500">No blogs available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">S.No</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">
              {actionType === 'edit' ? 'Action' : actionType === 'add' ? 'Add' : 'Delete'}
            </th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-600">{index + 1}</td>
              <td className="py-3 px-4 text-gray-900">{blog.categoryId?.name || 'N/A'}</td>
              <td className="py-3 px-4">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="py-3 px-4 text-gray-900">{truncateText(blog.title, 50)}</td>
              <td className="py-3 px-4 text-gray-600">{truncateText(blog.description, 100)}</td>
              <td className="py-3 px-4 text-gray-900">{blog.author}</td>
              <td className="py-3 px-4 text-gray-600">{formatDate(blog.date)}</td>
              <td className="py-3 px-4">
                {actionType === 'edit' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(blog)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit blog"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(blog._id, blog.title)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : actionType === 'add' ? (
                  <button
                    onClick={() => onAdd(blog._id)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Add to featured"
                  >
                    <Plus size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => onDelete(blog._id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Remove from featured"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
