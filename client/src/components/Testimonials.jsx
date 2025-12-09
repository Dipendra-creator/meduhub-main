import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Sneha Kapoor',
    role: 'NEET 2024 Aspirant',
    avatar: '👩‍⚕️',
    content: "Meduhub didn't just teach me; they trained me to think like a doctor. Their FMGE-focused crash course cut through the noise and gave me what actually matters.",
    rating: 5
  },
  {
    id: 2,
    name: 'Dr. Rajat Singh',
    role: 'FMGE Cleared',
    avatar: '👨‍⚕️',
    content: "I never thought online prep could feel so personal. The mentors at Meduhub remembered my weak topics and checked on my progress every week. That personal touch? Priceless!",
    rating: 5
  },
  {
    id: 3,
    name: 'Priya Nair',
    role: 'NEET-UG Student',
    avatar: '👩‍🎓',
    content: "Before Meduhub, I was drowning in books without a plan. Their structured timetable and live doubt sessions made all the difference! Scoring above 650 now feels possible and exciting!",
    rating: 5
  },
  {
    id: 4,
    name: 'Riya Sharma',
    role: 'FMGE Aspirant',
    avatar: '👩‍💼',
    content: "I had failed FMGE twice and was losing hope. Meduhub's detailed question analysis and daily tests rebuilt my confidence. This time, I'm going in prepared like never before!",
    rating: 5
  },
  {
    id: 5,
    name: 'Arjun Verma',
    role: 'NEET Topper',
    avatar: '👨‍🎓',
    content: "Every other platform gave me theory, but Meduhub gave me strategy. The mock tests were so close to the real NEET paper, it felt like déjà vu on exam day!",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="testimonials" className="testimonials section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Cheers to our{' '}
            <span className="gradient-text">White Coat Champions!</span>
          </h2>
          <p>
            Hear from our students who achieved their dreams with Meduhub.
          </p>
        </motion.div>

        <div className="testimonials-carousel">
          {/* Navigation Arrows */}
          <button 
            className="testimonial-nav testimonial-nav-prev"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button 
            className="testimonial-nav testimonial-nav-next"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            →
          </button>

          {/* Carousel Track */}
          <div className="testimonials-track">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="testimonial-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">"</div>

                {/* Content */}
                <p className="testimonial-content">
                  {testimonials[activeIndex].content}
                </p>

                {/* Rating */}
                <div className="testimonial-rating">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>

                {/* Author */}
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className="testimonial-author-info">
                    <h4 className="testimonial-name">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="testimonial-role">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="testimonials-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid (Desktop) */}
        <motion.div
          className="testimonials-grid hide-mobile"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`testimonial-card-mini ${index === activeIndex ? 'active' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleDotClick(index)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="testimonial-mini-avatar">
                {testimonial.avatar}
              </div>
              <div className="testimonial-mini-info">
                <h5>{testimonial.name}</h5>
                <p>{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background */}
      <div className="testimonials-bg-glow" />
    </section>
  );
}
