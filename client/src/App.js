import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './utils/ScrollToTop';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import InquiryPage from './pages/InquiryPage';
import AddProject from './pages/AddProject';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add-project" element={<AddProject />} />
      </Routes>
      <MobileBottomNav />
    </Router>
  );
}

export default App;
