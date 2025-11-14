import { X } from 'lucide-react';

export default function AddBlogTab({
  blogForm,
  handleBlogFormChange,
  categories,
  imagePreview,
  handleImageChange,
  clearImage,
  blogSubmitting,
  handleBlogSubmit,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Add Blog</h2>
      <form onSubmit={handleBlogSubmit} className="space-y-6">
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={blogForm.categoryId}
            onChange={handleBlogFormChange}
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
          {categories.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No categories available. Please add a category first.</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={blogForm.title}
            onChange={handleBlogFormChange}
            placeholder="Enter blog title"
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={blogSubmitting}
            required
          />
          <p className="text-sm text-gray-500 mt-1">{blogForm.title.length}/200 characters</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={blogForm.description}
            onChange={handleBlogFormChange}
            placeholder="Enter blog description"
            rows={6}
            maxLength={5000}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={blogSubmitting}
            required
          />
          <p className="text-sm text-gray-500 mt-1">{blogForm.description.length}/5000 characters</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={blogSubmitting}
          />
          {imagePreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs h-auto rounded-lg border border-gray-300"
                style={{ maxWidth: '300px' }}
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X size={16} />
              </button>
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
            name="author"
            value={blogForm.author}
            onChange={handleBlogFormChange}
            placeholder="Enter author name"
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={blogSubmitting}
            required
          />
          <p className="text-sm text-gray-500 mt-1">{blogForm.author.length}/100 characters</p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={blogForm.date}
            onChange={handleBlogFormChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={blogSubmitting}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={blogSubmitting || categories.length === 0}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {blogSubmitting ? 'Adding Blog...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
