import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css'; // Import custom CSS
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const ProjectFeatures = [
  { title: 'Manage Stock Levels', description: 'Real-time tracking & adjustments.' },
  { title: 'Order & Shipment Mgmt', description: 'Streamlined processing & tracking.' },
  { title: 'Product Management', description: 'Easy add, edit & categorize.' },
  { title: 'Reporting & Analytics', description: 'Insights on sales & stock.' },
];

function HomePage() {
  const navigate = useNavigate();
  const [currentFeaturePage, setCurrentFeaturePage] = useState(0);
  const featuresPerPage = 2;
  const totalFeaturePages = 2;
  const intervalRef = useRef(null);

  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        setCurrentFeaturePage((prevPage) => (prevPage + 1) % totalFeaturePages);
      }, 3000);
    };

    const stopAutoScroll = () => {
      clearInterval(intervalRef.current);
    };

    startAutoScroll();

    return () => stopAutoScroll();
  }, [totalFeaturePages]);

  const goToFeaturePage = (pageNumber) => {
    setCurrentFeaturePage(pageNumber);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentFeaturePage((prevPage) => (prevPage + 1) % totalFeaturePages);
    }, 3000);
  };

  const getFeaturesForPage = (pageNumber) => {
    const startIndex = pageNumber * featuresPerPage;
    const endIndex = Math.min(startIndex + featuresPerPage, ProjectFeatures.length);
    return ProjectFeatures.slice(startIndex, endIndex);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Inventory Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
              <Nav.Link onClick={handleRegisterClick}>Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <section className="hero">
        <div className="hero-content">
          <h1 className="display-3">Streamline Your Inventory</h1>
          <p className="lead">Manage, track, and grow your business with ease.</p>
          
            <p className="lead">
              <Button variant="primary" className="mr-3" onClick={handleLoginClick}>
                Login
              </Button>
              &nbsp;
              <Button variant="success" onClick={handleRegisterClick}>
                Register
              </Button>
            </p>
           
          
        </div>
      </section>

      <section className="features-carousel-section bg-white py-5">
        <div className="container">
          <h2 className="text-center mb-3">Key Features</h2>
          <div className="features-carousel-container">
            <div
              className="features-carousel-wrapper"
              style={{
                transform: `translateX(-${currentFeaturePage * 50}%)`,
              }}
            >
              {Array.from({ length: totalFeaturePages }).map((_, pageIndex) => (
                <div className="features-page" key={pageIndex}>
                  {getFeaturesForPage(pageIndex).map((feature, index) => (
                    <div className="feature-card" key={index}>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="page-indicator">
              {Array.from({ length: totalFeaturePages }).map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentFeaturePage ? 'active' : ''}`}
                  onClick={() => goToFeaturePage(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-light py-3 text-center border-top">
        <p>&copy; {new Date().getFullYear()} Inventory System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;