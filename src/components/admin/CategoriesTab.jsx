import { Trash2 } from 'lucide-react';

export default function CategoriesTab({
  categoryName,
  setCategoryName,
  handleSubmit,
  submitting,
  categories,
  loading,
  openDeleteModal,
}) {
  return (
    <>
      {/* Add Category Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Adding...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* All Categories Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Serial No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Delete</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-900">{category.name}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openDeleteModal(category._id, category.name)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
