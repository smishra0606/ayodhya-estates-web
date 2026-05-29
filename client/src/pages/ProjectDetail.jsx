import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../components/Footer';
import Connectivity from '../components/Connectivity'; 
import Features from '../components/Features'; 
import './ProjectDetail.css';
import { optimizeHeroImage, optimizeThumbnailImage } from '../utils/imageOptimizer';
import { fetchProjectBySlug } from '../utils/fetchWithTimeout';
import API_URL from '../config/api';

// 🚀 CUSTOM ARROWS BANA DIYE HAIN (Saffron color ke sath)
const CustomNextArrow = ({ onClick }) => (
  <button 
    onClick={onClick}
    style={{
      position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
      background: 'rgba(139, 111, 76, 0.85)', color: 'white', border: 'none', borderRadius: '50%',
      width: '45px', height: '45px', zIndex: 10, cursor: 'pointer', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'background 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 111, 76, 1)'}
    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(139, 111, 76, 0.85)'}
  >
    <i className="fas fa-chevron-right"></i>
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button 
    onClick={onClick}
    style={{
      position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
      background: 'rgba(139, 111, 76, 0.85)', color: 'white', border: 'none', borderRadius: '50%',
      width: '45px', height: '45px', zIndex: 10, cursor: 'pointer', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'background 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 111, 76, 1)'}
    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(139, 111, 76, 0.85)'}
  >
    <i className="fas fa-chevron-left"></i>
  </button>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_BASE = API_URL;

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Requesting project:", slug);
      const data = await fetchProjectBySlug(API_BASE, slug);
      setProject(data);

      try {
        const galleryRes = await fetch(`${API_BASE}/api/gallery`); 
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(galleryData);
        } else {
          console.error("Gallery failed with status:", galleryRes.status);
        }
      } catch (galleryErr) {
        console.error("Gallery fetch error:", galleryErr);
      }

    } catch (err) {
      console.error("Fetch failure:", err);
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [slug, API_BASE]);

  useEffect(() => {
    if (slug) {
      loadProject();
    }
  }, [slug, loadProject]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  const handleRetry = () => {
    loadProject();
  };

  const sliderSettings = {
    dots: true,
    arrows: true,
    nextArrow: <CustomNextArrow />, // 🚀 Naye Buttons yahan add ho gaye
    prevArrow: <CustomPrevArrow />, // 🚀 Naye Buttons yahan add ho gaye
    infinite: true,
    speed: 800,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  if (loading) {
    return (
      <div className="project-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading divine details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-error">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">{error || 'Project not found'}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          {error && (
            <button onClick={handleRetry} className="error-button" style={{ cursor: 'pointer' }}>
              <i className="fas fa-redo" style={{ marginRight: '0.5rem' }}></i> Retry
            </button>
          )}
          <a href="/" className="error-button">Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div 
        className="project-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${optimizeHeroImage(project.heroImage)})`
        }}
      >
        <div className="project-hero-content">
          <h1 className="project-hero-title">{project.name}</h1>
          <p className="project-hero-tagline">{project.tagline}</p>
          <span className="project-badge">{project.status}</span>
        </div>
      </div>

      <Features amenitiesData={project?.amenities} />

      {(galleryImages.length > 0 || (project.gallery && project.gallery.length > 0)) && (
        <section className="project-gallery" style={{ padding: '4rem 0', backgroundColor: '#f9f9f9' }}>
          <div className="project-container">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Project Gallery</h2>
            
            {/* 🚀 position: 'relative' add kiya taaki arrows theek jagah rahein */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', position: 'relative' }}>
              <Slider {...sliderSettings}>
                {galleryImages.length > 0 
                  ? galleryImages.map((img, idx) => (
                      <div 
                        key={`slide-${idx}`} 
                        onClick={() => setSelectedImage(img.imageUrl)}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        <img 
                          src={optimizeThumbnailImage(img.imageUrl)} 
                          alt={`${project.name} View ${idx + 1}`} 
                          style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    ))
                  : project.gallery.map((image, idx) => (
                      <div 
                        key={`slide-fallback-${idx}`} 
                        onClick={() => setSelectedImage(image)}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        <img 
                          src={optimizeThumbnailImage(image)} 
                          alt={`${project.name} View ${idx + 1}`} 
                          style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    ))
                }
              </Slider>
            </div>
          </div>
        </section>
      )}

      <Connectivity connectivityData={project?.connectivity} />

      <section className="project-about">
        <div className="project-container">
          <div className="about-content">
            <h2 className="section-title">About The Project</h2>
            <p className="about-description">{project.description}</p>
          </div>
        </div>
      </section>

      <section className="project-cta">
        <div className="project-container">
          <div className="interest-split-container">
            <div className="interest-map-col">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.5829124!2d82.0173!3d26.7322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a071e5e5e5e5d%3A0x0!2zMjbCsDQzJzU1LjgiTiA4MsKwMDEnMDQuNCJF!5e0!3m2!1sen!2sin!4v1708600000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Panchi Vihar Location Map"
              ></iframe>
            </div>
            <div className="interest-form-col">
              <h2 className="cta-title">Interested in This Project?</h2>
              <p className="cta-description">Get in touch with our team to learn more about this exclusive property</p>
              <a href="/inquiry" className="cta-button">Schedule Inquiry</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)} style={{ zIndex: 9999 }}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <i className="fas fa-times"></i>
            </button>
            <img 
              src={optimizeHeroImage(selectedImage)} 
              alt={`${project.name} High Resolution`} 
              className="lightbox-image" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;