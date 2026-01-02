const API_BASE_URL = "https://rebuild-india-backend.vercel.app" || "http://localhost:4000"

function getAuthHeaders() {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}
	return headers
}

function getAuthHeadersForFormData() {
	const token = localStorage.getItem('token')
	const headers = {}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}
	return headers
}

async function handleResponse(response) {
	if (response.status === 204) {
		return null
	}

	// Check if response is JSON
	const contentType = response.headers.get('content-type')
	if (!contentType || !contentType.includes('application/json')) {
		// If not JSON, it's likely an HTML error page
		throw new Error(
			`Server error: ${response.status} ${response.statusText}. Please ensure the API server is running and accessible.`
		)
	}

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'Request failed')
	}

	return data
}

export async function getCategories() {
	const response = await fetch(`${API_BASE_URL}/api/categories/getcategory`, {
		method: 'GET',
	})
	return handleResponse(response)
}

export async function createCategory(name) {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}/api/categories/createcategory`, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({name}),
	})
	return handleResponse(response)
}

export async function sendPageVisit(page, timestamp, userAgent) {
	try {
		const token = localStorage.getItem('token')
		const headers = {
			'Content-Type': 'application/json',
		}
		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}

		const response = await fetch(`${API_BASE_URL}/api/analytics/visit`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				page,
				timestamp,
				userAgent,
			}),
		})
		return handleResponse(response)
	} catch (error) {
		console.error('Error tracking page visit:', error);
	}
}

export async function deleteCategory(id) {
	const response = await fetch(`${API_BASE_URL}/api/categories/deletecategoryid/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	})
	return handleResponse(response)
}

// Blog API functions
export async function getBlogs() {
	const response = await fetch(`${API_BASE_URL}/api/blogs/getblogs`)
	return handleResponse(response)
}

export async function createBlog(formData) {
	const response = await fetch(`${API_BASE_URL}/api/blogs/createblogs`, {
		method: 'POST',
		headers: getAuthHeadersForFormData(),
		body: formData, // FormData for file upload
	})
	return handleResponse(response)
}

export async function updateBlog(id, formData) {
	const response = await fetch(`${API_BASE_URL}/api/blogs/updateblog/${id}`, {
		method: 'PUT',
		headers: getAuthHeadersForFormData(),
		body: formData, // FormData for file upload
	})
	return handleResponse(response)
}

export async function deleteBlog(id) {
	const response = await fetch(`${API_BASE_URL}/api/blogs/deleteblog/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	})
	return handleResponse(response)
}

export async function getBlogsByCategory(slug) {
	const response = await fetch(`${API_BASE_URL}/api/blogs/category/${slug}`)
	return handleResponse(response)
}

export async function getBlogById(id) {
	const response = await fetch(`${API_BASE_URL}/api/blogs/blogbyid/${id}`)
	return handleResponse(response)
}

export async function searchBlogs(query) {
	const response = await fetch(`${API_BASE_URL}/api/blogs?search=${encodeURIComponent(query)}`);
	return handleResponse(response);
}

// Main Stories API functions
export async function getMainStories() {
	const response = await fetch(`${API_BASE_URL}/api/main-stories/getstories`)
	return handleResponse(response)
}

export async function addToMainStories(blogId) {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}/api/main-stories/createstories`, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({blogId}),
	})
	return handleResponse(response)
}

export async function removeFromMainStories(blogId) {
	const response = await fetch(`${API_BASE_URL}/api/main-stories/removefromstories/${blogId}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	})
	return handleResponse(response)
}

// Trending Stories API functions
export async function getTrendingStories() {
	const response = await fetch(`${API_BASE_URL}/api/trending-stories/gettrending`)
	return handleResponse(response)
}

export async function addToTrendingStories(blogId) {
	const token = localStorage.getItem('token')
	const headers = {
		'Content-Type': 'application/json',
	}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}/api/trending-stories/createtrending`, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify({blogId}),
	})
	return handleResponse(response)
}

export async function removeFromTrendingStories(blogId) {
	const response = await fetch(
		`${API_BASE_URL}/api/trending-stories/${blogId}`,
		{
			method: 'DELETE',
			headers: getAuthHeaders(),
		}
	)
	return handleResponse(response)
}

// News Carousel API functions
export async function getNewsCarousel() {
	const response = await fetch(`${API_BASE_URL}/api/news-carousel/getnews`)
	return handleResponse(response)
}

export async function createNewsCarousel(formData) {
	const token = localStorage.getItem('token')
	const headers = {}
	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}/api/news-carousel/createnews`, {
		method: 'POST',
		headers: headers,
		body: formData, // FormData for file upload
	})
	return handleResponse(response)
}

export async function deleteNewsCarousel(id) {
	const response = await fetch(`${API_BASE_URL}/api/news-carousel/deletenews/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	})
	return handleResponse(response)
}

export async function login(email, password) {
	const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password}),
	})
	return handleResponse(response)
}
