import { motion } from 'framer-motion';
import './Footer.css';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Courses', href: '#courses' },
  { name: 'About Us', href: 'https://www.meduhub.org/about-us' },
  { name: 'Contact Us', href: 'https://www.meduhub.org/contact-us' }
];

const resources = [
  { name: 'Study Material', href: 'https://www.meduhub.org/study-material' },
  { name: 'MeduFly', href: 'https://www.meduhub.org/medufly' },
  { name: 'Free Videos', href: 'https://www.youtube.com/@meduhub' }
];

const legal = [
  { name: 'Privacy Policy', href: 'https://www.meduhub.org/privacy-policy' },
  { name: 'Terms & Conditions', href: 'https://www.meduhub.org/term-conditions' },
  { name: 'Refund Policy', href: 'https://www.meduhub.org/refund-policy' },
  { name: 'Cancellation', href: 'https://www.meduhub.org/cancellation' }
];

export default function Footer({ onRegisterClick }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="footer">
      <div className="container">
        {/* CTA Section */}
        <motion.div
          className="footer-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of successful medical aspirants and achieve your dream score.</p>
          <div className="footer-cta-buttons">
            <motion.button
              className="btn btn-primary btn-xl"
              onClick={onRegisterClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </motion.button>
            <motion.a
              href="tel:+919319981617"
              className="btn btn-outline btn-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📞 Call Us
            </motion.a>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-column footer-brand">
            <img
              src="https://cdn-diy-public.classplus.co/prod/logonew_1754980753969.png"
              alt="Meduhub Logo"
              className="footer-logo"
            />
            <p className="footer-description">
              Stay ahead in your preparation with Meduhub. We bring you the best
              faculties, resources, and guidance to help you excel in FMGE, NEET-UG,
              NExT, and more.
            </p>
            <div className="footer-tagline">
              <span className="gradient-text">Grow. Learn. Earn.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="footer-column-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4 className="footer-column-title">Resources</h4>
            <ul className="footer-links">
              {resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4 className="footer-column-title">Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📍</span>
                <p>
                  MEDUHUB EDUTECH<br />
                  8th Floor, Windsor Group<br />
                  Plot Number 1-C, Raipur Khadar<br />
                  Sector 126, Noida<br />
                  Uttar Pradesh 201313
                </p>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">📞</span>
                <a href="tel:+919319981617">+91 93199 81617</a>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">✉️</span>
                <a href="mailto:contact@meduhub.in">contact@meduhub.in</a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="footer-legal">
          <div className="footer-legal-links">
            {legal.map((link, index) => (
              <span key={link.name}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
                {index < legal.length - 1 && <span className="separator">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {currentYear} Meduhub Edutech. All rights reserved.</p>
          <p className="footer-credit">
            Made with ❤️ for Medical Aspirants
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="footer-bg-gradient" />
    </footer>
  );
}
