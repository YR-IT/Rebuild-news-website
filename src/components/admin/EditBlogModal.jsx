import { X } from 'lucide-react';

export default function EditBlogModal({
  isOpen,
  blog,
  blogForm,
  handleBlogFormChange,
  categories,
  imagePreview,
  handleImageChange,
  clearImage,
  blogSubmitting,
  handleBlogSubmit,
  closeModal,
}) {
  // Safety guard
  if (!isOpen || !blog) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Edit Blog</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleBlogSubmit} className="px-6 py-6 space-y-6">

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              value={blogForm.categoryId?._id || blogForm.categoryId || ''}
              onChange={handleBlogFormChange}
              disabled={blogSubmitting}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={blogForm.title || ''}
              onChange={handleBlogFormChange}
              maxLength={200}
              required
              disabled={blogSubmitting}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={blogForm.description || ''}
              onChange={handleBlogFormChange}
              rows={6}
              required
              disabled={blogSubmitting}
              className="w-full px-4 py-2 border rounded-lg resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Featured Image</label>

            {!imagePreview && blogForm.image && (
              <img
                src={blogForm.image}
                alt="Current"
                className="h-32 mb-3 rounded border"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={blogSubmitting}
              className="w-full"
            />

            {imagePreview && (
              <div className="relative inline-block mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 rounded border"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={blogForm.author || ''}
              onChange={handleBlogFormChange}
              maxLength={100}
              required
              disabled={blogSubmitting}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={blogForm.date?.split('T')[0] || ''}
              onChange={handleBlogFormChange}
              required
              disabled={blogSubmitting}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              disabled={blogSubmitting}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={blogSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {blogSubmitting ? 'Updating...' : 'Update Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
