import { Brain, Wand2, MessageCircle, Shield } from "lucide-react";
import "./LandingPage.css";


const LandingPage = () => {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <Brain className="logo-icon" />
          <span>MindGuide.AI</span>
        </div>

        <div className="nav-items">
          <div className="nav-links">
            <span>HOME</span>
            <span>FEATURES</span>
            <span>ABOUT</span>
            <span>SUPPORT</span>
          </div>
          <button className="button-secondary">EMPOWER YOUR MIND</button>
          <button className="menu-button">☰</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="left-section">
          <div className="header">
            <p className="subtitle">YOUR AI COMPANION</p>
            <h1 className="title">
              Empowering Mental Health
              <br />
              with AI Tech
              <span className="wave-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M3,12 Q12,2 21,12 Q12,22 3,12" />
                </svg>
              </span>
            </h1>
          </div>

          <div className="features">
            <div className="feature-card">
              <Wand2 className="feature-icon" />
              <div>
                <p className="feature-title">Personalized Support</p>
                <p className="feature-description">
                  AI-powered emotional guidance
                </p>
              </div>
            </div>

            <div className="feature-card">
              <MessageCircle className="feature-icon" />
              <div>
                <p className="feature-title">24/7 Availability</p>
                <p className="feature-description">
                  Instant mental health support
                </p>
              </div>
            </div>

            <div className="feature-card">
              <Shield className="feature-icon" />
              <div>
                <p className="feature-title">Private & Secure</p>
                <p className="feature-description">
                  End-to-end encrypted sessions
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="right-section">
          <div className="sketchfab-embed-wrapper">
            <iframe
              title="Brain"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xr-spatial-tracking
              execution-while-out-of-viewport
              execution-while-not-rendered
              web-share
              src="https://sketchfab.com/models/484379a72ebd4eb69f04cb1db476e0df/embed?autospin=1&autostart=1&preload=1&ui_hint=0&ui_theme=dark&dnt=1&camera=1,-5,1,0,0,0"

            ></iframe>
            <p style={{ fontSize: "13px", fontWeight: "normal", margin: "10px", color: "#4A4A4A" }}>
              <a
                href="https://sketchfab.com/3d-models/brain-484379a72ebd4eb69f04cb1db476e0df?utm_medium=embed&utm_campaign=share-popup&utm_content=484379a72ebd4eb69f04cb1db476e0df"
                target="_blank"
                rel="nofollow"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >

              </a>
              
              <a
                href="https://sketchfab.com/tkkjee?utm_medium=embed&utm_campaign=share-popup&utm_content=484379a72ebd4eb69f04cb1db476e0df"
                target="_blank"
                rel="nofollow"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >

              </a>
              <a
                href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=484379a72ebd4eb69f04cb1db476e0df"
                target="_blank"
                rel="nofollow"
                style={{ fontWeight: "bold", color: "#1CAAD9" }}
              >
              </a>
            </p>
          </div>
        </div>
      </main>
      {/* <Login></Login> */}
    </div>
  );
};


export default LandingPage;