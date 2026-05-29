import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PropertySlider.css';

// 🚀 DYNAMIC URL setup
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://ayodhya-estates-web.onrender.com/api';

const PropertySlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/gallery`);
        if (response.data && Array.isArray(response.data)) {
          setImages(response.data);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      }
    };
    fetchImages();
  }, []);

  if (images.length === 0) return null; // Jab tak load nahi hota, kuch nahi dikhayega

  return (
    <div className="property-slider-wrapper">
      <div className="property-slider-container">
        {images.map((img, index) => (
          <div className="slider-card" key={img._id || index}>
            <img src={img.imageUrl} alt="Ayodhya Estate Property" loading="lazy" />
            <div className="slider-badge">
              <i className="fas fa-star icon-saffron" style={{marginRight: '5px', color: '#8b6f4c'}}></i>
              {img.status || 'Premium Plot'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySlider;
