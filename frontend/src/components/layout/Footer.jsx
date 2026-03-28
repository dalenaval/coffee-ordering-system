import { Coffee, MapPin, Phone, Mail, Clock } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <div className="footer-brand">
              <Coffee className="icon-md" />
              <span className="brand-name">Kape Nga Ni</span>
            </div>
            <p className="footer-text">
              Crafting exceptional coffee experiences since 2018. Every cup
              tells a story.
            </p>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-list">
              <li>
                <MapPin className="icon-sm" />
                <span>123 Coffee Lane, Coffee City</span>
              </li>
              <li>
                <Phone className="icon-sm" />
                <span>(555) 123-4567</span>
              </li>
              <li>
                <Mail className="icon-sm" />
                <span>kapeNgaNi@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="footer-section">
            <h3 className="footer-title">Hours</h3>
            <ul className="footer-list">
              <li>
                <Clock className="icon-sm" />
                <span>Mon-Fri: 6am - 8pm</span>
              </li>
              <li className="indent">Sat: 7am - 9pm</li>
              <li className="indent">Sun: 8am - 6pm</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Menu</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Locations</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Kape Nga Ni. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
