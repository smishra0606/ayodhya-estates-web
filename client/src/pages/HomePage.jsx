import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Hero from '../components/Hero';
import Connectivity from '../components/Connectivity';
import Footer from '../components/Footer';
import { optimizeThumbnailImage, optimizeHeroImage } from '../utils/imageOptimizer';
import API_URL from '../config/api';
import './HomePage.css';

const HomePage = () => {
  const [project, setProject] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // 🚀 NAYA STATE CLOUDINARY PHOTOS KE LIYE
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Project Details (Text, description etc ke liye)
        const projectRes = await fetch(`${API_URL}/api/projects/panchi-vihar`);
        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData.data);
        }

        // 2. Fetch ALL Cloudinary Photos (Slider ke liye)
        const galleryRes = await fetch(`${API_URL}/api/gallery`);
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGalleryImages(galleryData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedImage]);

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <main>
      <Helmet>
        {/* ... (Tumhare saare purane SEO aur Meta Tags yahan rahenge, unko mat chhedna) ... */}
        <title>Ayodhya Estate | Premium Residential Plots & Property in Ayodhya</title>
      </Helmet>

      <Hero />
      
      {/* 🚀 LOGIC UPDATED: Agar Cloudinary photos hain ya Project hai, toh slider dikhao */}
      {!loading && (galleryImages.length > 0 || project) && (
        <section className="flagship-section">
          <div className="flagship-container">
            <h2 className="flagship-title">Our Flagship Project: Panchi Vihar</h2>
            
            <div className="flagship-slider-wrapper">
              <Slider {...sliderSettings} className="flagship-slider">
                {/* 🚀 CLOUDINARY IMAGES KO SLIDER MEIN MAP KAR RAHE HAIN */}
                {galleryImages.length > 0 
                  ? galleryImages.map((img, idx) => (
                      <div 
                        key={`flagship-${idx}`} 
                        className="flagship-slide"
                        onClick={() => setSelectedImage(img.imageUrl)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img 
                          src={optimizeThumbnailImage(img.imageUrl)} 
                          alt={`Premium residential plots at Ayodhya - View ${idx + 1}`}
                          className="flagship-image"
                          loading="lazy"
                        />
                      </div>
                    ))
                  : project?.gallery?.map((image, idx) => (
                      <div 
                        key={`flagship-${idx}`} 
                        className="flagship-slide"
                        onClick={() => setSelectedImage(image)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img 
                          src={optimizeThumbnailImage(image)} 
                          alt={`Panchi Vihar - View ${idx + 1}`}
                          className="flagship-image"
                          loading="lazy"
                        />
                      </div>
                    ))
                }
              </Slider>
            </div>

            <div className="flagship-info">
              <h3>{project?.name || 'Panchi Vihar'}</h3>
              <p className="flagship-tagline">{project?.tagline || 'Premium Plots Near Ram Mandir'}</p>
              <p className="flagship-description">
                {project?.description || 'Experience the divine atmosphere of Ayodhya with our premium residential plots. Equipped with modern amenities, 24/7 security, and lush green parks.'}
              </p>
              <Link to="/projects/panchi-vihar" className="btn-explore">
                Explore Panchi Vihar
                <i className="fas fa-arrow-right" aria-hidden="true" style={{marginLeft: '8px'}}></i>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <Connectivity connectivityData={project?.connectivity} />
      <Footer />

      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
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
              alt="Panchi Vihar Ayodhya - Full resolution view" 
              className="lightbox-image" 
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;