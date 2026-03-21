import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-overlay"></div>

      <header className="landing-header">
        <div className="landing-logo">Kape Nga Ni</div>

        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login" className="landing-login-btn">
            Staff Login
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-left">
          <span className="landing-badge">Modern Café Ordering Platform</span>

          <h1>
            A smarter way to bring
            <span> Kape Nga Ni </span>
            online.
          </h1>

          <p>
            Transform your kiosk ordering experience into a modern web-based
            platform for customers, staff, and administrators. Fast ordering,
            centralized operations, and seamless management in one system.
          </p>

          <div className="landing-actions">
            <Link to="/login" className="landing-primary-btn">
              Get Started
            </Link>
            <a href="#features" className="landing-secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

        <div className="landing-hero-right">
          <div className="landing-dashboard-card">
            <div className="dashboard-topbar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="dashboard-content">
              <div className="dashboard-sidebar">
                <div className="sidebar-box active"></div>
                <div className="sidebar-box"></div>
                <div className="sidebar-box"></div>
                <div className="sidebar-box"></div>
              </div>

              <div className="dashboard-main">
                <div className="dashboard-panel large"></div>
                <div className="dashboard-grid">
                  <div className="dashboard-panel"></div>
                  <div className="dashboard-panel"></div>
                  <div className="dashboard-panel"></div>
                  <div className="dashboard-panel"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="section-heading">
          <h2>Core Features</h2>
          <p>
            Built for kiosk-to-web migration with modern tools and scalable
            architecture.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-box">
            <div className="feature-icon">☕</div>
            <h3>Digital Menu</h3>
            <p>
              Present your café products in a clean and responsive menu for web,
              tablet, and mobile.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🛒</div>
            <h3>Cart & Checkout</h3>
            <p>
              Let customers browse, customize, add to cart, and complete orders
              with ease.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📋</div>
            <h3>Order Monitoring</h3>
            <p>
              Help staff manage incoming orders and update order statuses in
              real time.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📊</div>
            <h3>Admin Control</h3>
            <p>
              Manage users, products, categories, and business operations from a
              centralized dashboard.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="landing-section about-section">
        <div className="about-card">
          <div className="about-text">
            <h2>Why this platform works</h2>
            <p>
              Kape Nga Ni is powered by a modern stack:
              <strong> React + Vite </strong> for the frontend,
              <strong> FastAPI </strong> for the backend API, and
              <strong> PostgreSQL </strong> for reliable data storage.
            </p>
            <p>
              This setup gives your business a fast interface, clean API
              integration, and a scalable system ready for future growth.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
