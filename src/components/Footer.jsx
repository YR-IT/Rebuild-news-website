import { useState, useEffect } from 'react'
import { Facebook, Youtube, Linkedin, Instagram } from 'lucide-react'
import { getCategories } from '../services/api'

const Footer = () => {
	const [categories, setCategories] = useState([])

	useEffect(() => {
		async function fetchCategories() {
			try {
				const data = await getCategories()
				setCategories(data.categories?.slice(0, 6) || [])
			} catch (error) {
				console.error('Failed to load categories:', error)
			}
		}
		fetchCategories()
	}, [])

	const currentYear = new Date().getFullYear()

	const socialLinks = [
		{ name: 'Facebook', icon: Facebook, url: '#' },
		{ name: 'YouTube', icon: Youtube, url: '#' },
		{ name: 'LinkedIn', icon: Linkedin, url: '#' },
		{ name: 'Instagram', icon: Instagram, url: '#' },
	]

	const quickLinks = [
		{ name: 'Home', url: '/' },
		{ name: 'About Us', url: '#' },
		{ name: 'Contact', url: '#' },
		{ name: 'Privacy Policy', url: '#' },
		{ name: 'Terms of Service', url: '#' },
	]

	return (
		<footer className='bg-black text-white'>
			{/* Main Footer Content */}
			<div className='bg-[#1a1a1a]'>
				<div className='container mx-auto px-4 py-8 sm:py-10 md:py-12'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{/* About Section */}
						<div className='space-y-4'>
							<div className='flex items-center gap-3'>
								<img
									src='/Logo/Logo.jpeg'
									alt='Rebuilt India Logo'
									className='h-10 w-10 object-cover rounded'
								/>
								<h3 className='text-xl font-bold'>Rebuilt India</h3>
							</div>
							<p className='text-gray-400 text-sm leading-relaxed'>
								Your trusted source for news, technology, travel, and lifestyle content. Stay informed with the latest updates.
							</p>
							<div className='flex gap-3'>
								{socialLinks.map((social) => {
									const Icon = social.icon
									return (
										<a
											key={social.name}
											href={social.url}
											aria-label={social.name}
											className='w-9 h-9 grid place-items-center rounded-sm bg-black/80 border border-red-700 hover:bg-red-700 transition-colors'
										>
											<Icon size={18} />
										</a>
									)
								})}
							</div>
						</div>

						{/* Quick Links */}
						<div className='space-y-4'>
							<h4 className='text-lg font-semibold text-red-500'>Quick Links</h4>
							<ul className='space-y-2'>
								{quickLinks.map((link) => (
									<li key={link.name}>
										<a
											href={link.url}
											className='text-gray-400 hover:text-red-500 text-sm transition-colors'
										>
											{link.name}
										</a>
									</li>
								))}
							</ul>
						</div>

						{/* Categories */}
						<div className='space-y-4'>
							<h4 className='text-lg font-semibold text-red-500'>Categories</h4>
							<ul className='space-y-2'>
								{categories.map((category) => (
									<li key={category._id}>
										<a
											href={`/category/${category.slug}`}
											className='text-gray-400 hover:text-red-500 text-sm transition-colors'
										>
											{category.name}
										</a>
									</li>
								))}
							</ul>
						</div>

						{/* Newsletter */}
						<div className='space-y-4'>
							<h4 className='text-lg font-semibold text-red-500'>Newsletter</h4>
							<p className='text-gray-400 text-sm'>
								Subscribe to get the latest news and updates delivered to your inbox.
							</p>
							<form className='space-y-2' onSubmit={(e) => e.preventDefault()}>
								<input
									type='email'
									placeholder='Your email address'
									className='w-full px-4 py-2 bg-black border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors'
								/>
								<button
									type='submit'
									className='w-full px-4 py-2 bg-[#b91c1c] hover:bg-red-700 text-white text-sm font-medium rounded transition-colors'
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className='bg-black border-t border-gray-800'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400'>
						<p>
							© {currentYear} <span className='text-red-500 font-semibold'>Rebuilt India</span>. All rights reserved.
						</p>
						<p className='text-xs'>
							Designed with ❤️ for news enthusiasts
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
