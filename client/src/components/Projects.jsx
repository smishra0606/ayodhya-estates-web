import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // At the top of your component or inside the useEffect
const fetchProjects = async () => {
  try {
    setLoading(true);
    
    // FORCE the full Render URL here
    const API_URL = 'https://ayodhya-estates-web.onrender.com';
    const response = await fetch(`${API_URL}/api/projects`);

    // Guard against HTML response
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received HTML instead of JSON. Check the API URL.");
    }

    const jsonData = await response.json();
    
    // Note: Your backend response structure is { success: true, data: [...] }
    if (jsonData.success) {
      setProjects(jsonData.data);
    }
  } catch (err) {
    console.error("Projects Fetch Error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.status === activeFilter);

  const truncateDescription = (text = '', maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="projects-message-container">
        <p className="projects-message">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-message-container">
        <p className="projects-message error">Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h1>Our Divine Portfolio</h1>
        <p>Discover premium residential and commercial landmarks crafted by Ayodhya Estates.</p>
      </div>

      <div className="filter-container">
        <button
          className={activeFilter === 'All' ? 'active-filter' : ''}
          onClick={() => setActiveFilter('All')}
        >
          All
        </button>
        <button
          className={activeFilter === 'Ongoing' ? 'active-filter' : ''}
          onClick={() => setActiveFilter('Ongoing')}
        >
          Ongoing
        </button>
        <button
          className={activeFilter === 'Upcoming' ? 'active-filter' : ''}
          onClick={() => setActiveFilter('Upcoming')}
        >
          Upcoming
        </button>
        <button
          className={activeFilter === 'Completed' ? 'active-filter' : ''}
          onClick={() => setActiveFilter('Completed')}
        >
          Completed
        </button>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <Link 
            key={project._id} 
            to={`/projects/${project.slug}`}
            className="project-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="image-wrapper">
              <img 
                src={project.heroImage} 
                alt={project.name}
              />
              <span className="status-badge">{project.status}</span>
            </div>

            <div className="card-content">
              <h3>{project.name}</h3>
              <p className="location">
                <i className="fas fa-map-marker-alt"></i>
                {project.location || project.tagline || 'Ayodhya'}
              </p>
              <p className="description">
                {truncateDescription(project.description)}
              </p>
            </div>

            <div className="card-highlights">
              {Array.isArray(project.amenities) && project.amenities.slice(0, 2).map((amenity, index) => (
                <span key={index}>{amenity}</span>
              ))}
            </div>

            <div className="card-footer">
              <div className="btn-view">
                View Project
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="projects-message-container">
          <p className="projects-message">No projects found in this category.</p>
        </div>
      )}
    </section>
  );
};

export default Projects;
