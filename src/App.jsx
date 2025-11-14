import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import AdminPanel from './pages/admin';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import Login from './pages/Login';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role === 'admin') {
    return children;
  }
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
