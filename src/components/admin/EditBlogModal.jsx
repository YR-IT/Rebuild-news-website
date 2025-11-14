import { X } from 'lucide-react';

export default function EditBlogModal({
  editModal,
  setEditModal,
  categories,
  imagePreview,
  handleImageChange,
  clearImage,
  blogSubmitting,
  handleBlogUpdate,
  closeEditModal,
}) {
  if (!editModal.isOpen || !editModal.blog) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        {/* Modal Header with X button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h3 className="text-xl font-semibold text-gray-900">Edit Blog</h3>
          <button
            onClick={closeEditModal}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="px-6 py-6">
          <form onSubmit={handleBlogUpdate} className="space-y-6">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={editModal.blog.categoryId?._id || editModal.blog.categoryId}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  blog: { ...prev.blog, categoryId: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={blogSubmitting}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editModal.blog.title}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  blog: { ...prev.blog, title: e.target.value }
                }))}
                placeholder="Enter blog title"
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={blogSubmitting}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editModal.blog.description}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  blog: { ...prev.blog, description: e.target.value }
                }))}
                placeholder="Enter blog description"
                rows={6}
                maxLength={5000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={blogSubmitting}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {!imagePreview && <span className="text-gray-500 font-normal">(Keep existing or upload new)</span>}
              </label>
              
              {/* Show existing image */}
              {!imagePreview && editModal.blog.image && (
                <div className="mb-3">
                  <img
                    src={editModal.blog.image}
                    alt="Current"
                    className="h-32 w-auto rounded-lg border border-gray-300 object-cover"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={blogSubmitting}
              />
              
              {imagePreview && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-auto rounded-lg border border-gray-300 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-md"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1">New image preview</p>
                </div>
              )}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editModal.blog.author}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  blog: { ...prev.blog, author: e.target.value }
                }))}
                placeholder="Enter author name"
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={blogSubmitting}
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={editModal.blog.date?.split('T')[0] || ''}
                onChange={(e) => setEditModal(prev => ({
                  ...prev,
                  blog: { ...prev.blog, date: e.target.value }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={blogSubmitting}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={blogSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={blogSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {blogSubmitting ? 'Updating...' : 'Update Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
