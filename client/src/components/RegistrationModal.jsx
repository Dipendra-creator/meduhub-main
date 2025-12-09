import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStates, getCities } from '../data/indiaLocations';
import './RegistrationModal.css';

export default function RegistrationModal({ isOpen, onClose, type = 'register' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const states = getStates();

  // Update cities when state changes
  useEffect(() => {
    if (formData.state) {
      setCities(getCities(formData.state));
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        state: '',
        city: ''
      });
      setErrors({});
      setSubmitStatus(null);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }

    if (!formData.city) {
      newErrors.city = 'Please select your city';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          inquiryType: type
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setSubmitStatus('error');
        console.error('Submission error:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>

            {/* Success State */}
            {submitStatus === 'success' ? (
              <motion.div
                className="modal-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your {type === 'register' ? 'registration' : 'inquiry'} has been submitted successfully. Our team will contact you soon!</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="modal-header">
                  <div className="modal-icon">
                    {type === 'register' ? '🎓' : '💬'}
                  </div>
                  <h2 className="modal-title">
                    {type === 'register' ? 'Register Now' : 'Inquire Now'}
                  </h2>
                  <p className="modal-subtitle">
                    {type === 'register' 
                      ? 'Join thousands of successful medical aspirants!' 
                      : 'Have questions? We\'re here to help!'}
                  </p>
                </div>

                {/* Form */}
                <form className="modal-form" onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className={`form-group ${errors.name ? 'error' : ''}`}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  {/* Phone */}
                  <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                    <label htmlFor="phone">Phone Number</label>
                    <div className="phone-input">
                      <span className="phone-prefix">+91</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div className={`form-group ${errors.email ? 'error' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  {/* State */}
                  <div className={`form-group ${errors.state ? 'error' : ''}`}>
                    <label htmlFor="state">State</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select your state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>

                  {/* City */}
                  <div className={`form-group ${errors.city ? 'error' : ''}`}>
                    <label htmlFor="city">City</label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.state}
                    >
                      <option value="">
                        {formData.state ? 'Select your city' : 'First select a state'}
                      </option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  {/* Error Status */}
                  {submitStatus === 'error' && (
                    <div className="submit-error">
                      Something went wrong. Please try again or call us at +91 93199 81617
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-xl submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="loading-spinner" />
                    ) : (
                      <>
                        {type === 'register' ? '🚀 Submit Registration' : '📩 Send Inquiry'}
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Footer */}
                <p className="modal-footer-text">
                  By submitting, you agree to our{' '}
                  <a href="https://www.meduhub.org/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="https://www.meduhub.org/term-conditions" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
