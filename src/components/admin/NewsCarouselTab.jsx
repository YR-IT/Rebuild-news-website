import { Trash2, X } from 'lucide-react';

export default function NewsCarouselTab({
  headline,
  setHeadline,
  imageFile,
  imagePreview,
  handleImageChange,
  clearImage,
  handleSubmit,
  submitting,
  newsCarousel,
  loading,
  openDeleteModal,
}) {
  return (
    <>
      {/* Add New Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a New</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter headline"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    disabled={submitting}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Current Carousel Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Current Carousel</h2>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading carousel items...</div>
        ) : newsCarousel.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No carousel items yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Serial No.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Headline</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsCarousel.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={item.image}
                        alt={item.headline}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-900">{item.headline}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openDeleteModal(item._id, item.headline)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete item"
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
