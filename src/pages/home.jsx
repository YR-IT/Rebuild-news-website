import Navbar from '../components/navbar'
import TopStoriesCarousel from '../components/TopStoriesCarousel'
import MainStories from '../components/MainStories'
import TrendingStories from '../components/TrendingStories'
import CategorySections from '../components/CategorySections'
import LatestBlogs from '../components/LatestBlogs'
import Footer from '../components/Footer'
import usePageTracking from '../Pagevisit'

const Home = () => {
	usePageTracking("home")
	return (
		
		<div>
			<Navbar />
			<TopStoriesCarousel />
			<MainStories />
			<TrendingStories />
			<section className='bg-gray-50'>
				<div className='container mx-auto px-4 py-6'>
					<div className='grid grid-cols-1 md:grid-cols-10 gap-6'>
						<div className='md:col-span-7 space-y-6'>
							<CategorySections />
						</div>
						<div className='md:col-span-3 space-y-6 md:sticky md:top-4 h-fit'>
							<LatestBlogs />
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	)
}

export default Home
