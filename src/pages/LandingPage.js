// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import ParticleEffect from '../Particleeffect';
import './Landingstyle.css';
import './Landingstyle.js';

const LandingPage = () => (
  <div>
    {/* Navigation Section */}
    <section className="py-7 py-md-0 bg-hero" id="home">
      <div className="container">
        <div className="row vh-md-100">
          <div className="col-md-8 col-sm-10 col-12 mx-auto my-auto text-center">
            <h1 className="heading-black text-capitalize">Code-pulse</h1>
            <h2 className="sub-heading text-capitalize">Quickly build landing pages with Knight</h2>
            <p className="lead py-3">Knight is a platform that helps freelancers and companies build beautiful landing pages in minutes. Sign up for free.</p>
            
            {/* Link to navigate to Home.js */}
            <Link to="/home">
              <button className="btn btn-primary d-inline-flex flex-row align-items-center">
                Get started now
                <em className="ml-2" data-feather="arrow-right"></em>
              </button>
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

export default LandingPage;
