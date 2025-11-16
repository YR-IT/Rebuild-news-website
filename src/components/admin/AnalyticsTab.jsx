import { useState, useEffect } from 'react';
import { Clock, Users, BarChart } from 'lucide-react';

// A mock API function. Replace this with your actual API call.
const getAnalyticsData = async (page) => {

  // In a real app, you would fetch from your backend:
  const response = await fetch(`https://rebuilt-backend-beta.vercel.app/api/analytics/stats/${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics data');
  }
  return response.json();

  // Returning mock data as per your request
};

const formatTime = (seconds) => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalyticsData('home');
        setAnalytics(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-500">No analytics data available.</div>;
  }

  const stats = [
    { name: 'Total Visits', value: analytics.totalVisits.toLocaleString(), icon: Users },
    { name: 'Average Time Spent', value: formatTime(analytics.averageTimeSpent), icon: Clock },
    { name: 'Total Time Spent (All Users)', value: formatTime(analytics.totalTimeSpent), icon: BarChart },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Page Analytics: <span className="capitalize font-bold text-blue-600">{analytics.page}</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-start gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}