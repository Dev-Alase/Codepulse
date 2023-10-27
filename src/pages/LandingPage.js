// LandingPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Typed from 'typed.js';
import ParticleEffect from '../Particleeffect';
import './Landingstyle.css';

const LandingPage = () => {
  const introText = "Step into coding's fast lane with our real-time editor—your ideas, instantly tangible. No more waiting; just code, collaborate, and create with unprecedented speed.";

  useEffect(() => {
    // Typed.js typing effect for the subheading
    const typedSubHeading = new Typed('.sub-heading', {
      strings: ["The real-time code editor that unleashes your creativity."],
      typeSpeed: 40,
      showCursor: false,
    });

    // Clean up Typed instances on component unmount
    return () => {
      typedSubHeading.destroy();
    };
  }, []); // Empty dependency array ensures that this effect runs only once after initial render

  return (
    <div>
      <section className="bg-hero" id="home">
        <div className="container">
          <div className="row vh-md-100">
            <div className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center">
            <h1 className="heading-black text-capitalize fadeInLeft">Code-pulse</h1>
              <h2 className="sub-heading text-capitalize fadeInLeft"></h2>
              <p className="lead-typed py-3 fadeInLeft">
                <span className="type-in">{introText}</span>
              </p>

              {/* Link to navigate to Home.js */}
              <Link to="/home" className="btn btn-primary d-inline-flex flex-row align-items-center">
                Get started now
                <em className="ml-2" data-feather="arrow-right"></em>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ParticleEffect />

      {/* Footer Section */}
      <div className="footer">
        &copy; 2023 Codepulse - All Rights Reserved
      </div>
    </div>
  );
};

export default LandingPage;
