import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Hero from '../components/Hero';
import Connectivity from '../components/Connectivity';
import Features from '../components/Features';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import API_URL from '../config/api';
import { optimizeThumbnailImage, optimizeHeroImage } from '../utils/imageOptimizer';

const PanchiViharPage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🚀 Direct Cloudinary API Fetch Logic
  useEffect(() => {
    const fetchCloudinaryPhotos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          setGalleryImages(data);
        }
      } catch (err) {
        console.error("Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCloudinaryPhotos();
  }, []);

  // Lightbox scroll lock
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  // Slider ki settings (Autoplay, Fade, Speed)
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <main>
      <Hero />
      <Connectivity />
      
      {/* 🚀 NAYA SLIDER: Purane Gallery Component ki jagah yahan lagega */}
      {!loading && galleryImages.length > 0 && (
        <section className="project-gallery-section" style={{ padding: '4rem 5%', backgroundColor: '#f9f9f9' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#8b6f4c', fontSize: '2.5rem' }}>
              <i className="fas fa-images icon-saffron" style={{marginRight: '15px'}}></i>
              Project Glimpses
            </h2>
            
            <div className="slider-container" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <Slider {...sliderSettings}>
                {galleryImages.map((img, idx) => (
                  <div 
                    key={`panchi-vihar-slide-${idx}`} 
                    onClick={() => setSelectedImage(img.imageUrl)}
                    style={{ cursor: 'pointer', outline: 'none' }}
                  >
                    <img 
                      src={optimizeThumbnailImage(img.imageUrl)} 
                      alt={`Panchi Vihar Ayodhya Premium View ${idx + 1}`}
                      style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>
      )}

      <Features />
      <AboutSection />
      <Footer />

      {/* 🚀 Lightbox: Photo par click karne par Zoom wala popup */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)} style={{ zIndex: 9999 }}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <i className="fas fa-times"></i>
            </button>
            <img 
              src={optimizeHeroImage(selectedImage)} 
              alt="Panchi Vihar Full Resolution" 
              className="lightbox-image" 
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default PanchiViharPage;