import { X, ImagePlus, Plus } from 'lucide-react';
import { useState } from 'react';

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
  const [contentBlocks, setContentBlocks] = useState([
    { type: 'text', content: '', id: Date.now() }
  ]);

  const addTextBlock = (afterIndex) => {
    const newBlocks = [...contentBlocks];
    newBlocks.splice(afterIndex + 1, 0, {
      type: 'text',
      content: '',
      id: Date.now()
    });
    setContentBlocks(newBlocks);
  };

  const addImageBlock = (afterIndex) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newBlocks = [...contentBlocks];
          newBlocks.splice(afterIndex + 1, 0, {
            type: 'image',
            content: event.target.result,
            file: file,
            id: Date.now()
          });
          setContentBlocks(newBlocks);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateBlock = (index, content) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].content = content;
    setContentBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    if (contentBlocks.length > 1) {
      const newBlocks = contentBlocks.filter((_, i) => i !== index);
      setContentBlocks(newBlocks);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Combine content blocks into the description field
    const combinedContent = contentBlocks.map(block => {
      if (block.type === 'text') {
        return block.content;
      } else {
        return `[IMAGE:${block.id}]`; // Placeholder for images
      }
    }).join('\n\n');

    // Create a modified event with updated description
    const modifiedForm = {
      ...blogForm,
      description: combinedContent,
      contentBlocks: contentBlocks // Pass the blocks separately
    };

    handleBlogSubmit(e, modifiedForm);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Add Blog</h2>
      <div className="space-y-6">
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

        {/* Content Blocks (Text + Images) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="space-y-4">
            {contentBlocks.map((block, index) => (
              <div key={block.id} className="relative">
                {block.type === 'text' ? (
                  <div className="relative">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      placeholder="Enter content..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={blogSubmitting}
                    />
                    {contentBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={block.content}
                      alt={`Content image ${index + 1}`}
                      className="max-w-full h-auto rounded-lg border border-gray-300"
                      style={{ maxHeight: '400px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Add Block Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => addTextBlock(index)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    disabled={blogSubmitting}
                  >
                    <Plus size={14} />
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => addImageBlock(index)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    disabled={blogSubmitting}
                  >
                    <ImagePlus size={14} />
                    Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image <span className="text-red-500">*</span>
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
          onClick={handleFormSubmit}
          disabled={blogSubmitting || categories.length === 0}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {blogSubmitting ? 'Adding Blog...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}