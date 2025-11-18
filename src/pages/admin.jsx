import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  getCategories, createCategory, deleteCategory, 
  getBlogs, createBlog, updateBlog, deleteBlog,
  getMainStories, addToMainStories, removeFromMainStories,
  getTrendingStories, addToTrendingStories, removeFromTrendingStories,
  getNewsCarousel, createNewsCarousel, deleteNewsCarousel
} from '../services/api';

// Import tab components
import CategoriesTab from '../components/admin/CategoriesTab';
import AddBlogTab from '../components/admin/AddBlogTab';
import AllBlogsTab from '../components/admin/AllBlogsTab';
import MainStoriesTab from '../components/admin/MainStoriesTab';
import TrendingStoriesTab from '../components/admin/TrendingStoriesTab';
import NewsCarouselTab from '../components/admin/NewsCarouselTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import EditBlogModal from '../components/admin/EditBlogModal';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('analytics');

  // Categories state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null, categoryName: '' });

  // Blogs state
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogForm, setBlogForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogSubmitting, setBlogSubmitting] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, blog: null });
  const [deleteBlogModal, setDeleteBlogModal] = useState({ isOpen: false, blogId: null, blogTitle: '' });
  const [isAuth, setIsAuth] = useState(false);

  // Main Stories state
  const [mainStories, setMainStories] = useState([]);
  const [mainStoriesLoading, setMainStoriesLoading] = useState(true);

  // Trending Stories state
  const [trendingStories, setTrendingStories] = useState([]);
  const [trendingStoriesLoading, setTrendingStoriesLoading] = useState(true);

  // News Carousel state
  const [newsCarousel, setNewsCarousel] = useState([]);
  const [newsCarouselLoading, setNewsCarouselLoading] = useState(true);
  const [carouselHeadline, setCarouselHeadline] = useState('');
  const [carouselImageFile, setCarouselImageFile] = useState(null);
  const [carouselImagePreview, setCarouselImagePreview] = useState(null);
  const [carouselSubmitting, setCarouselSubmitting] = useState(false);
  const [deleteCarouselModal, setDeleteCarouselModal] = useState({ isOpen: false, itemId: null, itemHeadline: '' });

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        
      window.location.href = "/login"; // Redirect to login page
      // redirect if missing
    } else {
      setIsAuth(true);         // allow panel to load
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'blogs' || activeTab === 'addBlog') {
      fetchBlogs();
    }
    if (activeTab === 'mainStories') {
      fetchBlogs();
      fetchMainStories();
    }
    if (activeTab === 'trendingStories') {
      fetchBlogs();
      fetchTrendingStories();
    }
    if (activeTab === 'newsCarousel') {
      fetchNewsCarousel();
    }
    if (activeTab === 'categories') {
      fetchCategories();
    }
  }, [activeTab]);

  // Category functions
  async function fetchCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = categoryName.trim().replace(/\s+/g, ' ');
    
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }
    
    if (trimmedName.length < 1 || trimmedName.length > 40) {
      toast.error('Category name must be between 1 and 40 characters');
      return;
    }
    
    const duplicate = categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
    if (duplicate) {
      toast.error('Category already exists');
      return;
    }

    try {
      setSubmitting(true);
      const data = await createCategory(trimmedName);
      setCategories(prev => [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryName('');
      toast.success('Category added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  }

  function openDeleteModal(id, name) {
    setDeleteModal({ isOpen: true, categoryId: id, categoryName: name });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
  }

  async function confirmDelete() {
    const { categoryId } = deleteModal;
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      toast.success('Successfully Deleted');
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
      closeDeleteModal();
    }
  }

  // Blog functions
  async function fetchBlogs() {
    try {
      setBlogsLoading(true);
      const data = await getBlogs();
      setBlogs(data.blogs || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load blogs');
    } finally {
      setBlogsLoading(false);
    }
  }

  function handleBlogFormChange(e) {
    const { name, value } = e.target;
    setBlogForm(prev => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  function resetBlogForm() {
    setBlogForm({
      categoryId: '',
      title: '',
      description: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
    });
    clearImage();
  }

  async function handleBlogSubmit(e) {
    e.preventDefault();

    if (!blogForm.categoryId || !blogForm.title || !blogForm.description || !blogForm.author || !blogForm.date) {
      toast.error('All fields are required');
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    if (blogForm.title.trim().length < 1 || blogForm.title.trim().length > 200) {
      toast.error('Title must be between 1 and 200 characters');
      return;
    }

    if (blogForm.description.trim().length < 10 || blogForm.description.trim().length > 5000) {
      toast.error('Description must be between 10 and 5000 characters');
      return;
    }

    if (blogForm.author.trim().length < 1 || blogForm.author.trim().length > 100) {
      toast.error('Author must be between 1 and 100 characters');
      return;
    }

    try {
      setBlogSubmitting(true);
      const formData = new FormData();
      formData.append('categoryId', blogForm.categoryId);
      formData.append('title', blogForm.title.trim());
      formData.append('description', blogForm.description.trim());
      formData.append('author', blogForm.author.trim());
      formData.append('date', blogForm.date);
      formData.append('image', imageFile);

      await createBlog(formData);
      toast.success('Blog Added Successfully');
      resetBlogForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to add blog');
    } finally {
      setBlogSubmitting(false);
    }
  }

  function openEditModal(blog) {
    setEditModal({ isOpen: true, blog });
  }

  function closeEditModal() {
    setEditModal({ isOpen: false, blog: null });
  }

  async function handleBlogUpdate(e) {
    e.preventDefault();
    const { blog } = editModal;

    if (!blog.categoryId || !blog.title || !blog.description || !blog.author || !blog.date) {
      toast.error('All fields are required');
      return;
    }

    if (blog.title.trim().length < 1 || blog.title.trim().length > 200) {
      toast.error('Title must be between 1 and 200 characters');
      return;
    }

    if (blog.description.trim().length < 10 || blog.description.trim().length > 5000) {
      toast.error('Description must be between 10 and 5000 characters');
      return;
    }

    if (blog.author.trim().length < 1 || blog.author.trim().length > 100) {
      toast.error('Author must be between 1 and 100 characters');
      return;
    }

    try {
      setBlogSubmitting(true);
      const formData = new FormData();
      formData.append('categoryId', blog.categoryId);
      formData.append('title', blog.title.trim());
      formData.append('description', blog.description.trim());
      formData.append('author', blog.author.trim());
      formData.append('date', blog.date);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateBlog(blog._id, formData);
      toast.success('Blog Updated Successfully');
      closeEditModal();
      clearImage();
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to update blog');
    } finally {
      setBlogSubmitting(false);
    }
  }

  function openDeleteBlogModal(id, title) {
    setDeleteBlogModal({ isOpen: true, blogId: id, blogTitle: title });
  }

  function closeDeleteBlogModal() {
    setDeleteBlogModal({ isOpen: false, blogId: null, blogTitle: '' });
  }

  async function confirmDeleteBlog() {
    const { blogId } = deleteBlogModal;
    try {
      await deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
      toast.success('Blog Deleted Successfully');
      closeDeleteBlogModal();
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog');
      closeDeleteBlogModal();
    }
  }

  // Main Stories functions
  async function fetchMainStories() {
    try {
      setMainStoriesLoading(true);
      const data = await getMainStories();
      setMainStories(data.mainStories || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load main stories');
    } finally {
      setMainStoriesLoading(false);
    }
  }

  async function handleAddToMainStories(blogId) {
    try {
      await addToMainStories(blogId);
      toast.success('Added to Main Stories');
      fetchMainStories();
    } catch (error) {
      console.error('Error adding to main stories:', error);
      toast.error(error.message || 'Failed to add to main stories. Please ensure the server is running.');
    }
  }

  async function handleRemoveFromMainStories(blogId) {
    try {
      await removeFromMainStories(blogId);
      toast.success('Removed from Main Stories');
      fetchMainStories();
    } catch (error) {
      toast.error(error.message || 'Failed to remove from main stories');
    }
  }

  // Trending Stories functions
  async function fetchTrendingStories() {
    try {
      setTrendingStoriesLoading(true);
      const data = await getTrendingStories();
      setTrendingStories(data.trendingStories || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load trending stories');
    } finally {
      setTrendingStoriesLoading(false);
    }
  }

  async function handleAddToTrendingStories(blogId) {
    try {
      await addToTrendingStories(blogId);
      toast.success('Added to Trending Stories');
      fetchTrendingStories();
    } catch (error) {
      toast.error(error.message || 'Failed to add to trending stories');
    }
  }

  async function handleRemoveFromTrendingStories(blogId) {
    try {
      await removeFromTrendingStories(blogId);
      toast.success('Removed from Trending Stories');
      fetchTrendingStories();
    } catch (error) {
      toast.error(error.message || 'Failed to remove from trending stories');
    }
  }

  // News Carousel functions
  async function fetchNewsCarousel() {
    try {
      setNewsCarouselLoading(true);
      const data = await getNewsCarousel();
      setNewsCarousel(data.newsCarousel || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load news carousel');
    } finally {
      setNewsCarouselLoading(false);
    }
  }

  function handleCarouselImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setCarouselImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarouselImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearCarouselImage() {
    setCarouselImageFile(null);
    setCarouselImagePreview(null);
  }

  function resetCarouselForm() {
    setCarouselHeadline('');
    clearCarouselImage();
  }

  async function handleCarouselSubmit(e) {
    e.preventDefault();

    if (!carouselHeadline.trim()) {
      toast.error('Headline is required');
      return;
    }

    if (!carouselImageFile) {
      toast.error('Please select an image');
      return;
    }

    if (carouselHeadline.trim().length < 1 || carouselHeadline.trim().length > 200) {
      toast.error('Headline must be between 1 and 200 characters');
      return;
    }

    try {
      setCarouselSubmitting(true);
      const formData = new FormData();
      formData.append('headline', carouselHeadline.trim());
      formData.append('image', carouselImageFile);

      await createNewsCarousel(formData);
      toast.success('Successfully Added');
      resetCarouselForm();
      fetchNewsCarousel();
    } catch (error) {
      toast.error(error.message || 'Failed to add news carousel item');
    } finally {
      setCarouselSubmitting(false);
    }
  }

  function openDeleteCarouselModal(id, headline) {
    setDeleteCarouselModal({ isOpen: true, itemId: id, itemHeadline: headline });
  }

  function closeDeleteCarouselModal() {
    setDeleteCarouselModal({ isOpen: false, itemId: null, itemHeadline: '' });
  }

  async function confirmDeleteCarousel() {
    const { itemId } = deleteCarouselModal;
    try {
      await deleteNewsCarousel(itemId);
      setNewsCarousel(prev => prev.filter(item => item._id !== itemId));
      toast.success('Successfully Deleted');
      closeDeleteCarouselModal();
    } catch (error) {
      toast.error(error.message || 'Failed to delete news carousel item');
      closeDeleteCarouselModal();
    }
  }

  // Utility functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  if (!isAuth) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            style: { background: '#10b981', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#10b981' },
          },
          error: {
            duration: 4000,
            style: { background: '#ef4444', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#ef4444' },
          },
          loading: {
            style: { background: '#3b82f6', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#3b82f6' },
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage store products</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'categories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Category
            </button>
            <button
              onClick={() => setActiveTab('addBlog')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'addBlog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Blog
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'blogs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Blogs
            </button>
            <button
              onClick={() => setActiveTab('mainStories')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'mainStories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Main Stories
            </button>
            <button
              onClick={() => setActiveTab('trendingStories')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'trendingStories' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Trending Stories
            </button>
            <button
              onClick={() => setActiveTab('newsCarousel')}
              className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'newsCarousel' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              News Carousel
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'categories' && (
          <CategoriesTab
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            handleSubmit={handleSubmit}
            submitting={submitting}
            categories={categories}
            loading={loading}
            openDeleteModal={openDeleteModal}
          />
        )}

        {activeTab === 'addBlog' && (
          <AddBlogTab
            blogForm={blogForm}
            handleBlogFormChange={handleBlogFormChange}
            categories={categories}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            clearImage={clearImage}
            blogSubmitting={blogSubmitting}
            handleBlogSubmit={handleBlogSubmit}
          />
        )}

        {activeTab === 'blogs' && (
          <AllBlogsTab
            blogs={blogs}
            blogsLoading={blogsLoading}
            truncateText={truncateText}
            formatDate={formatDate}
            openEditModal={openEditModal}
            openDeleteBlogModal={openDeleteBlogModal}
          />
        )}

        {activeTab === 'mainStories' && (
          <MainStoriesTab
            mainStories={mainStories}
            mainStoriesLoading={mainStoriesLoading}
            blogs={blogs}
            blogsLoading={blogsLoading}
            truncateText={truncateText}
            formatDate={formatDate}
            handleAddToMainStories={handleAddToMainStories}
            handleRemoveFromMainStories={handleRemoveFromMainStories}
          />
        )}

        {activeTab === 'trendingStories' && (
          <TrendingStoriesTab
            trendingStories={trendingStories}
            trendingStoriesLoading={trendingStoriesLoading}
            blogs={blogs}
            blogsLoading={blogsLoading}
            truncateText={truncateText}
            formatDate={formatDate}
            handleAddToTrendingStories={handleAddToTrendingStories}
            handleRemoveFromTrendingStories={handleRemoveFromTrendingStories}
          />
        )}

        {activeTab === 'newsCarousel' && (
          <NewsCarouselTab
            headline={carouselHeadline}
            setHeadline={setCarouselHeadline}
            imageFile={carouselImageFile}
            imagePreview={carouselImagePreview}
            handleImageChange={handleCarouselImageChange}
            clearImage={clearCarouselImage}
            handleSubmit={handleCarouselSubmit}
            submitting={carouselSubmitting}
            newsCarousel={newsCarousel}
            loading={newsCarouselLoading}
            openDeleteModal={openDeleteCarouselModal}
          />
        )}
      </div>

      {/* Delete Category Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteModal.categoryName}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      <EditBlogModal
        editModal={editModal}
        setEditModal={setEditModal}
        categories={categories}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        clearImage={clearImage}
        blogSubmitting={blogSubmitting}
        handleBlogUpdate={handleBlogUpdate}
        closeEditModal={closeEditModal}
      />

      {/* Delete Blog Confirmation Modal */}
      {deleteBlogModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the blog <span className="font-semibold">"{deleteBlogModal.blogTitle}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteBlogModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBlog}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete News Carousel Confirmation Modal */}
      {deleteCarouselModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{deleteCarouselModal.itemHeadline}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteCarouselModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCarousel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
