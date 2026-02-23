import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Hero from '../components/Hero';
import Connectivity from '../components/Connectivity';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Define Base URL for Netlify vs Localhost
        const API_URL = 'https://ayodhya-estates-web.onrender.com';
        
        // Fetch using the absolute URL
        const response = await fetch(`${API_URL}/api/projects/panchi-vihar`);
        
        if (response.ok) {
          const data = await response.json();
          setProject(data.data);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
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
      <Hero />
      
      {!loading && project && (
        <section className="flagship-section">
          <div className="flagship-container">
            <h2 className="flagship-title">Our Flagship Project: Panchi Vihar</h2>
            
            <div className="flagship-slider-wrapper">
              <Slider {...sliderSettings} className="flagship-slider">
                {project.gallery && project.gallery.map((image, idx) => (
                  <div 
                    key={`flagship-${idx}`} 
                    className="flagship-slide"
                    onClick={() => setSelectedImage(image)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={image} 
                      alt={`Panchi Vihar ${idx + 1}`}
                      className="flagship-image"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="flagship-info">
              <h3>{project.name}</h3>
              <p className="flagship-tagline">{project.tagline}</p>
              <p className="flagship-description">{project.description}</p>
              <Link to="/projects/panchi-vihar" className="btn-explore">
                Explore Panchi Vihar
                <i className="fas fa-arrow-right" aria-hidden="true"></i>
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
            <img src={selectedImage} alt="Full view" className="lightbox-image" />
          </div>
        </div>
      )}
    </main>
  );
};

export default HomePage;
