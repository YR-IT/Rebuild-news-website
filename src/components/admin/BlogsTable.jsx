import { Trash2, Pencil, Plus } from 'lucide-react';

export default function BlogsTable({
  blogs = [],
  loading = false,
  truncateText,
  formatDate,
  onEdit,
  onDelete,
  onAdd,
  actionType = 'edit',
}) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading blogs...</div>;
  }

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return <div className="text-center py-8 text-gray-500">No blogs available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left">S.No</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Image</th>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Author</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">
              {actionType === 'edit' ? 'Action' : actionType === 'add' ? 'Add' : 'Delete'}
            </th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id || index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{index + 1}</td>

              <td className="py-3 px-4">
                {blog.categoryId?.name ?? 'N/A'}
              </td>

              <td className="py-3 px-4">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title || 'Blog image'}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </td>

              <td className="py-3 px-4">
                {truncateText(blog.title ?? '', 50)}
              </td>

              <td className="py-3 px-4 text-gray-600">
                {truncateText(blog.description ?? '', 100)}
              </td>

              <td className="py-3 px-4">
                {blog.author ?? 'Unknown'}
              </td>

              <td className="py-3 px-4 text-gray-600">
                {blog.date ? formatDate(blog.date) : 'N/A'}
              </td>

              <td className="py-3 px-4">
                {actionType === 'edit' ? (
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(blog)} className="text-blue-600">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => onDelete(blog._id, blog.title)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : actionType === 'add' ? (
                  <button onClick={() => onAdd(blog._id)} className="text-green-600">
                    <Plus size={18} />
                  </button>
                ) : (
                  <button onClick={() => onDelete(blog._id)} className="text-red-600">
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
