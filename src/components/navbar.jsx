import {useState, useEffect} from 'react'
import {Search, Linkedin as LinkedinIcon, Menu, X} from 'lucide-react'
import {getCategories, searchBlogs} from '../services/api'

const Navbar = () => {
	const [categories, setCategories] = useState([])
	const [menuOpen, setMenuOpen] = useState(false)
	const [searchOpen, setSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [searching, setSearching] = useState(false)

	const currentDate = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await getCategories()
				setCategories(data.categories || [])
			} catch (error) {
				console.error('Failed to load categories:', error)
			}
		}
		fetchCategories()
	}, [])

	const handleSearch = async (query) => {
		if (!query.trim()) {
			setSearchResults([])
			return
		}
		try {
			setSearching(true)
			const data = await searchBlogs(query)
			setSearchResults(data.blogs || [])
		} catch (error) {
			console.error('Search failed:', error)
			setSearchResults([])
		} finally {
			setSearching(false)
		}
	}

	useEffect(() => {
		const debounce = setTimeout(() => {
			if (searchQuery) {
				handleSearch(searchQuery)
			} else {
				setSearchResults([])
			}
		}, 300)
		return () => clearTimeout(debounce)
	}, [searchQuery])

	// Social icons rendered as brand SVGs from Simple Icons CDN
	// Colors: icon (gray-300), button bg (gray-700), hover bg (gray-600)
	const socialIcons = [
		{name: 'Facebook', brand: 'facebook', url: '#'},
		{name: 'YouTube', brand: 'youtube', url: '#'},
		{name: 'LinkedIn', brand: 'linkedin', url: '#'},
		{name: 'Instagram', brand: 'instagram', url: '#'},
	]

	return (
		<nav className='w-full'>
			{/* Top Bar */}
			<div className='bg-[#1a1a1a] text-white text-sm'>
				<div className='container mx-auto px-4 py-2 flex justify-between items-center'>
					<div className='text-gray-300'>{currentDate}</div>
					<button
						className='p-2 sm:hidden rounded-sm focus:outline-none focus:ring-2 focus:ring-white/40'
						aria-label='Open menu'
						onClick={() => setMenuOpen(true)}
					>
						<Menu size={22} />
					</button>
					<div className='hidden sm:flex items-center gap-6'>
						<a
							href='#'
							className='text-gray-300 hover:text-red-400 transition-colors'>
							Support
						</a>
						<span className='text-gray-500'>|</span>
						<a
							href='#'
							className='text-gray-300 hover:text-red-400 transition-colors'>
							Documentation
						</a>
						<span className='text-gray-500'>|</span>
						<a
							href='#'
							className='text-gray-300 hover:text-red-400 transition-colors'>
							Buy It Now
						</a>
						<div className='flex items-center gap-2 ml-4'>
							{socialIcons.map((social, index) => (
								<a
									key={index}
									href={social.url}
									aria-label={social.name}
									className='w-9 h-9 grid place-items-center rounded-sm bg-black/80 border border-red-700 hover:bg-red-700 transition-colors'>
									{social.brand === 'linkedin' ? (
										<LinkedinIcon
											size={16}
											className='text-red-300'
										/>
									) : (
										<img
											src={`https://cdn.simpleicons.org/${social.brand}/fca5a5`}
											alt={social.name}
											className='w-4 h-4'
											loading='lazy'
											width='16'
											height='16'
										/>
									)}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Logo and Advertisement Section */}
			{/* Desktop (unchanged) */}
			<div className='bg-black text-white py-6 hidden lg:block'>
				<div className='container mx-auto px-4 flex justify-between items-center'>
					{/* Logo */}
					<a
						href='/'
						className='flex items-center gap-3'>
						<img
							src='/Logo/Logo.jpeg'
							alt='Site logo'
							className='h-12 w-auto object-contain'
							loading='eager'
							decoding='async'
						/>
						<div className='leading-tight'>
							<h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight'>
								Rebuilt India
							</h1>
							<p className='text-gray-400 text-xs sm:text-sm mt-0.5'>
								News, Tech, Travel and more
							</p>
						</div>
					</a>

					{/* Advertisement Banner */}
					<div className='bg-linear-to-r from-red-600 to-red-700 px-8 py-4 rounded-lg flex items-center gap-4'>
						<div>
							<div className='text-2xl font-bold'>ADVERTISEMENT SECTION</div>
							<div className='text-sm text-red-200'>
								EASILY ADD BANNER ADVERTISEMENT HERE
							</div>
						</div>
						<div className='bg-white text-black px-4 py-2 rounded font-bold text-sm'>
							ADVERTISEMENT
							<br />
							SECTION
						</div>
					</div>
				</div>
			</div>

			{/* Mobile/Tablet hero center section */}
			<div className='lg:hidden bg-black text-white'>
				{/* Row with logo and text */}
				<div className='container mx-auto px-4 py-3'>
					<div className='flex items-center gap-3'>
						<img
							src='/Logo/Logo.jpeg'
							alt='Site logo'
							className='h-10 w-10 sm:h-12 sm:w-12 object-cover rounded'
							loading='eager'
							decoding='async'
						/>
						<div className='leading-tight'>
							<h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Rebuilt India</h1>
							<p className='text-gray-300 text-xs sm:text-sm mt-0.5'>News, Tech, Travel and more</p>
						</div>
					</div>
				</div>
				{/* Ad banner below title */}
				<div className='container mx-auto px-4 py-3'>
					<div className='bg-linear-to-r from-red-600 to-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-lg flex items-center gap-4'>
						<div className='min-w-0'>
							<div className='text-lg sm:text-xl font-bold leading-tight'>ADVERTISEMENT SECTION</div>
							<div className='text-xs sm:text-sm text-red-200 truncate'>EASILY ADD BANNER ADVERTISEMENT HERE</div>
						</div>
						<div className='hidden sm:block bg-white text-black px-3 py-2 rounded font-bold text-xs sm:text-sm'>
							ADVERTISEMENT
							<br className='hidden sm:block' />
							SECTION
						</div>
					</div>
				</div>
			</div>

			{/* Navigation Menu */}
			<div className='bg-[#b91c1c] text-white hidden lg:block'>
				<div className='container mx-auto px-4'>
					<div className='flex items-center justify-between'>
						<ul className='flex items-center'>
							{/* Home Link */}
							<li>
								<a
									href='/'
									className='flex items-center gap-1 px-4 py-4 text-sm font-medium hover:bg-black transition-colors'>
									HOME
								</a>
							</li>

							{/* Dynamic Category Links */}
							{categories.map((category) => (
								<li key={category._id}>
									<a
										href={`/category/${category.slug}`}
										className='flex items-center gap-1 px-4 py-4 text-sm font-medium hover:bg-black transition-colors'>
										{category.name.toUpperCase()}
									</a>
								</li>
							))}
						</ul>
						<button
							className='p-3 hover:bg-black transition-colors'
							aria-label='Search'
							onClick={() => setSearchOpen(true)}>
							<Search size={20} />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile/Tablet Nav Bar (red) */}
			<div className='lg:hidden bg-[#b91c1c] text-white'>
				<div className='container mx-auto px-4'>
					<div className='flex items-center justify-between py-3'>
						<button
							className='p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/50'
							aria-label='Open menu'
							onClick={() => setMenuOpen(true)}
						>
							<Menu size={24} />
						</button>
						<button
							className='p-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/50'
							aria-label='Search'
							onClick={() => setSearchOpen(true)}
						>
							<Search size={22} />
						</button>
					</div>
				</div>
			</div>

			{/* Off-canvas drawer */}
			{menuOpen && (
				<div className='lg:hidden fixed inset-0 z-50'>
					<div
						className='absolute inset-0 bg-black/50'
						role='button'
						aria-label='Close menu overlay'
						onClick={() => setMenuOpen(false)}
					/>
					<div className='absolute left-0 top-0 h-full w-72 max-w-[85%] bg-white shadow-xl flex flex-col'>
						<div className='flex items-center justify-between p-4 border-b bg-[#b91c1c] text-white'>
							<span className='font-semibold'>Menu</span>
							<button
								className='p-2 rounded-sm hover:bg-white/10'
								aria-label='Close menu'
								onClick={() => setMenuOpen(false)}
							>
								<X size={20} />
							</button>
						</div>
						<nav className='p-2 overflow-y-auto'>
							<ul className='space-y-1'>
								<li>
									<a href='/' className='block px-3 py-2 rounded hover:bg-gray-100'>HOME</a>
								</li>
								{categories.map((category) => (
									<li key={category._id}>
										<a href={`/category/${category.slug}`} className='block px-3 py-2 rounded hover:bg-gray-100'>
											{category.name}
										</a>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>
			)}

			{/* Search Modal */}
			{searchOpen && (
				<div className='fixed inset-0 z-50 flex items-start justify-center pt-20 px-4'>
					<div
						className='absolute inset-0 bg-black/70'
						onClick={() => {
							setSearchOpen(false)
							setSearchQuery('')
							setSearchResults([])
						}}
					/>
					<div className='relative w-full max-w-2xl bg-white rounded-lg shadow-2xl'>
						{/* Search Header */}
						<div className='flex items-center gap-3 p-4 border-b'>
							<Search size={20} className='text-gray-400' />
							<input
								type='text'
								placeholder='Search for blogs, articles, news...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='flex-1 outline-none text-gray-800 placeholder-gray-400'
								autoFocus
							/>
							<button
								onClick={() => {
									setSearchOpen(false)
									setSearchQuery('')
									setSearchResults([])
								}}
								className='p-2 hover:bg-gray-100 rounded-full transition-colors'
								aria-label='Close search'
							>
								<X size={20} className='text-gray-600' />
							</button>
						</div>

						{/* Search Results */}
						<div className='max-h-96 overflow-y-auto'>
							{searching && (
								<div className='p-8 text-center text-gray-500'>
									<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
									<p className='mt-2'>Searching...</p>
								</div>
							)}

							{!searching && searchQuery && searchResults.length === 0 && (
								<div className='p-8 text-center text-gray-500'>
									<p>No results found for "{searchQuery}"</p>
									<p className='text-sm mt-2'>Try different keywords</p>
								</div>
							)}

							{!searching && searchResults.length > 0 && (
								<div className='divide-y'>
									{searchResults.map((blog) => (
										<a
											key={blog._id}
											href={`/blog/${blog._id}`}
											className='flex gap-4 p-4 hover:bg-gray-50 transition-colors'
											onClick={() => {
												setSearchOpen(false)
												setSearchQuery('')
												setSearchResults([])
											}}
										>
											{blog.image && (
												<img
													src={blog.image}
													alt={blog.title}
													className='w-20 h-20 object-cover rounded'
												/>
											)}
											<div className='flex-1 min-w-0'>
												<h3 className='font-semibold text-gray-800 line-clamp-1'>
													{blog.title}
												</h3>
												<p className='text-sm text-gray-600 line-clamp-2 mt-1'>
													{blog.description}
												</p>
												<div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
													{blog.categoryId?.name && (
														<span className='px-2 py-1 bg-red-100 text-red-600 rounded'>
															{blog.categoryId.name}
														</span>
													)}
													<span>{blog.author}</span>
												</div>
											</div>
										</a>
									))}
								</div>
							)}

							{!searching && !searchQuery && (
								<div className='p-8 text-center text-gray-400'>
									<Search size={48} className='mx-auto mb-3 opacity-50' />
									<p>Start typing to search for blogs</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}

export default Navbar
