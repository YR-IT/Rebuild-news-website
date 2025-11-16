import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import AdminPanel from './pages/admin';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import Login from './pages/Login';
import AnalyticsTab from './components/admin/AnalyticsTab';

function App() {
  // Initialize authentication state from localStorage

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
           <AdminPanel/>
          }
        />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route
          path="/login"
          element={<Login  />}
        />
        <Route path='/analytics' element={<AnalyticsTab/>}/>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
