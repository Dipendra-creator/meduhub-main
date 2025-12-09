import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Features.css';

const features = [
  {
    icon: '📚',
    title: 'Comprehensiveness',
    description: 'Prepare for every stage of your medical journey with one trusted platform. From NEET-UG to FMGE and even the upcoming NExT, Meduhub offers dedicated, expert-led courses tailored for each exam.',
    color: 'primary'
  },
  {
    icon: '🎯',
    title: 'Realism',
    description: 'Experience the real exam environment before the big day. Our mock tests and All-India test series replicate the actual exam pattern and difficulty level for NEET and FMGE.',
    color: 'accent'
  },
  {
    icon: '🏆',
    title: 'Expertise',
    description: "Learn from India's top medical educators through interactive live classes, recorded sessions, and comprehensive study material designed to match the latest exam trends.",
    color: 'purple'
  }
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section id="features" className="features section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Why Choose <span className="gradient-text">MEDUHUB</span>?
          </h2>
          <p>
            We combine the best resources, expert faculty, and proven strategies
            to ensure your success in medical entrance exams.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`feature-card feature-card-${feature.color}`}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className="feature-icon-wrapper">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <div className="feature-icon-glow" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="features-bg-decoration" />
    </section>
  );
}
