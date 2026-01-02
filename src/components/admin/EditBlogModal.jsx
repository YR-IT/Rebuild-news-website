import { X, ImagePlus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  if (!isOpen || !blog) return null;

  const [contentBlocks, setContentBlocks] = useState([]);

  /* Populate content blocks on open */
  useEffect(() => {
    if (blog.contentBlocks?.length) {
      setContentBlocks(
        blog.contentBlocks.map(block => ({
          type: block.type,
          content: block.content || '',
          id: block._id || Date.now() + Math.random(),
        }))
      );
    } else {
      setContentBlocks([{ type: 'text', content: '', id: Date.now() }]);
    }
  }, [blog]);

  const addTextBlock = (index) => {
    const blocks = [...contentBlocks];
    blocks.splice(index + 1, 0, {
      type: 'text',
      content: '',
      id: Date.now(),
    });
    setContentBlocks(blocks);
  };

  const addImageBlock = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const blocks = [...contentBlocks];
        blocks.splice(index + 1, 0, {
          type: 'image',
          content: reader.result,
          file,
          id: Date.now(),
        });
        setContentBlocks(blocks);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const updateBlock = (index, value) => {
    const blocks = [...contentBlocks];
    blocks[index].content = value;
    setContentBlocks(blocks);
  };

  const removeBlock = (index) => {
    if (contentBlocks.length === 1) return;
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const modifiedForm = {
      ...blogForm,
      contentBlocks,
    };

    handleBlogSubmit(e, modifiedForm);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Edit Blog</h3>
          <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">

          {/* Category */}
          <select
            name="categoryId"
            value={blogForm.categoryId?._id || blogForm.categoryId || ''}
            onChange={handleBlogFormChange}
            className="w-full border rounded-lg px-4 py-2"
            disabled={blogSubmitting}
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* Title */}
          <input
            type="text"
            name="title"
            value={blogForm.title || ''}
            onChange={handleBlogFormChange}
            maxLength={200}
            required
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* CONTENT BLOCKS */}
          <div className="space-y-4">
            {contentBlocks.map((block, index) => (
              <div key={block.id}>
                {block.type === 'text' ? (
                  <div className="relative">
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      rows={4}
                      className="w-full border rounded-lg px-4 py-2 resize-none"
                    />
                    {contentBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={block.content}
                      alt=""
                      className="max-h-80 rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => addTextBlock(index)}
                    className="px-3 py-1 bg-gray-100 rounded text-sm flex gap-1"
                  >
                    <Plus size={14} /> Text
                  </button>
                  <button
                    type="button"
                    onClick={() => addImageBlock(index)}
                    className="px-3 py-1 bg-gray-100 rounded text-sm flex gap-1"
                  >
                    <ImagePlus size={14} /> Image
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Image */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} className="h-32 rounded border" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Author */}
          <input
            type="text"
            name="author"
            value={blogForm.author || ''}
            onChange={handleBlogFormChange}
            maxLength={100}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={blogForm.date?.split('T')[0] || ''}
            onChange={handleBlogFormChange}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={closeModal} className="px-6 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
              {blogSubmitting ? 'Updating...' : 'Update Blog'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
