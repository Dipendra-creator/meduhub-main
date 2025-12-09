import { motion } from 'framer-motion';
import './Courses.css';

const courses = [
  {
    id: 1,
    title: 'NISCHAY 3.0',
    subtitle: 'NEET 2026 RAPID REVISION',
    description: 'Fast-track your NEET preparation with focused classes, expert mentors, and high-intensity practice.',
    features: [
      '3 Live Interactive Classes Daily (Phy/Chem/Bio)',
      'Full NCERT Coverage for Class 11 & 12',
      'Doubt Solving during & after class',
      'Recorded Lectures for daily revision',
      'High-yield NEET Question Practice'
    ],
    badge: 'Popular',
    color: 'primary',
    link: 'https://www.meduhub.org/courses/753662?mainCategory=82606'
  },
  {
    id: 2,
    title: 'PRAYAS TEST SERIES',
    subtitle: 'NEET 2026 TEST SERIES',
    description: 'The Prayas Test Series is a structured and comprehensive NEET practice program designed to help students strengthen conceptual clarity, improve accuracy, and build real exam temperament.',
    features: [
      '15 Full-Length NEET Pattern Tests',
      '1 Sample Test to begin your practice',
      '2 Complete syllabus Tests Class 11 (Updated syllabus)',
      '2 Complete syllabus Tests Class 12 (Updated syllabus)',
      'NEET Pattern: 180 Questions (Updated syllabus)'
    ],
    badge: 'Paid',
    color: 'primary',
    link: 'https://www.meduhub.org/courses/733660?mainCategory=82606'
  }
];

export default function Courses({ onRegisterClick }) {
  return (
    <section id="courses" className="courses section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            Master Your Exams with{' '}
            <span className="gradient-text">Result-Driven</span> Courses
          </h2>
          <p>
            Choose from our expertly crafted courses designed to help you
            achieve your dream score.
          </p>
        </motion.div>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className={`course-card course-card-${course.color}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              {/* Badge */}
              <div className={`course-badge course-badge-${course.color}`}>
                {course.badge}
              </div>

              {/* Header */}
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-subtitle">{course.subtitle}</p>
              </div>

              {/* Description */}
              <p className="course-description">{course.description}</p>

              {/* Features */}
              <ul className="course-features">
                {course.features.map((feature, i) => (
                  <li key={i} className="course-feature">
                    <span className="course-feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="course-cta">
                <motion.a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-${course.color} btn-lg`}
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {course.id === 1 ? 'Enroll Now' : 'Enroll Now'}
                </motion.a>
                {course.id === 1 && (
                  <button
                    className="btn btn-outline"
                    style={{ width: '100%', marginTop: 'var(--space-3)' }}
                    onClick={onRegisterClick}
                  >
                    Get More Info
                  </button>
                )}
              </div>

              {/* Background Glow */}
              <div className="course-glow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
