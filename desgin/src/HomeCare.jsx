import React from 'react';
import { Heart, Download, Star, ArrowRight, Menu, Pill as Pills } from 'lucide-react';
import './HomeCare.css';

import user1 from './assets/img-1.jpg';
import user2 from './assets/img-2.jpg';
import user3 from './assets/img-3.jpg';
import user4 from './assets/doctor-3.jpg';

import doctor from './assets/doctor-1.jpg'

import profile from './assets/doctor-2.jpg';

const images = [user1, user2, user3,user4];

const HomeCare = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-header">
              <span className="hero-label">AI-POWERED MENTAL HEALTH SUPPORT</span>
              <h1 className="hero-title">Your Virtual Mental Health Consultant</h1>
              <p className="hero-description">
                Access private, empathetic, and real-time mental health guidance anytime, anywhere with our AI-powered virtual consultant.
              </p>
            </div>

            <div className="button-group">
              <button className="button button-primary">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="button button-secondary">
                Learn More
              </button>
            </div>
            
            <div className="rating-card">
            <div className="user-avatars">
            {images.map((image, i) => (
               <div key={i} className="avatar">
                  <img src={image} alt={`User ${i + 1}`} />
                </div>
                   ))}
               </div>
              <div className="rating">
                <span className="rating-number">4.8</span>
                <Star className="w-6 h-6 text-purple-500 fill-purple-500" />
              </div>
              <p className="rating-text">
                400+ reviews from satisfied users
              </p>
            </div>
          </div>

          <div className="mobile-preview">
            <div className="preview-gradient" />
            <div className="mobile-device">
              <div className="device-notch" />
              <div className="device-screen">
                <div className="status-bar">
                  <span className="text-sm">9:41</span>
                  <div className="status-icons">
                    <div className="status-icon status-icon-square" />
                    <div className="status-icon status-icon-circle" />
                  </div>
                </div>

                <div className="app-header">
                  <div className="avatar">
                    <img 
                      src={profile} 
                      alt="User" 
                    />
                  </div>
                  <div className="user-info">
                    <p className="doctor-name">Hello, Kate!</p>
                    <p className="rating-text">New York</p>
                  </div>
                </div>

                <h2>How Are You Feeling Today?</h2>

                <div className="appointment-card">
                  <p className="appointment-header">Your Session Today</p>
                  <div className="appointment-content">
                    <div className="doctor-avatar">
                      <img 
                        src={doctor} 
                        alt="Consultant" 
                      />
                    </div>
                    <div className="doctor-info">
                      <p className="doctor-name">AI Consultant</p>
                      <p className="doctor-specialty">Mental Health Support</p>
                    </div>
                    <div className="appointment-time">
                      <p>20 Sep 2024</p>
                      <p>10:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="services-section">
                  <h3>Services</h3>
                  <div className="services-grid">
                    <button className="service-button">
                      <div className="service-icon">
                        <Heart />
                      </div>
                      <span>Emotional Checkup</span>
                    </button>
                    <button className="service-button">
                      <div className="service-icon">
                        <Pills />
                      </div>
                      <span>Stress Management</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCare;