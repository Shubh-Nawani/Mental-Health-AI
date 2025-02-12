import React from 'react';
import './LoginPage.css'; // Import the external CSS file

import doctor from './assets/doctor-4.jpg'
import team from './assets/team.jpg'

const Login = () => {
  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="left-side">
        <div className="content">
          <h1 className="title">Welcome</h1>
          <p className="description">
            Begin your journey to better mental well-being with personalized, confidential support.
          </p>

          <div className="image-container">
            <img src={doctor} alt="Virtual Doctor Consultation" className="image" />
          </div>

          <button className="google-button">
            <img
              src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/google.svg"
              alt="Google Logo"
              className="google-logo"
            />
            <span>Continue with Google</span>
          </button>

          <p className="privacy-message">
            Your privacy and well-being are our top priorities. <br />
            Start your confidential support session today.
          </p>

          <footer className="footer">
            © 2024 AI Mental Health Consultant. All Rights Reserved.
          </footer>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <div className="right-content">
          <h2 className="right-title">AI-Powered Mental Health Support</h2>
          <p className="right-description">
            Experience personalized, on-demand mental health guidance in a private,
            immersive environment. Our AI-powered platform is here to support you 24/7.
          </p>

          <div className="image-container">
            <img src={team} alt="Professional Medical Team" className="image" />
          </div>

          <div className="features">
            
            <div className="feature">
              <span className="emoji">🔒</span>
              <span>Secure & Private Sessions</span>
            </div>
            <div className="feature">
              <span className="emoji">⏰</span>
              <span>24/7 Available Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
