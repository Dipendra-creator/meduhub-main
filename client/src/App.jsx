import { useState, Suspense, lazy } from 'react';
import './styles/index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Courses from './components/Courses';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';

// Lazy load the 3D scene for better initial load performance
const Scene3D = lazy(() => import('./components/Scene3D'));

// Loading fallback for 3D scene
function Scene3DFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0f1035 50%, #1a0a2e 100%)'
      }}
    />
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('register');

  const handleRegisterClick = () => {
    setModalType('register');
    setIsModalOpen(true);
  };

  const handleInquireClick = () => {
    setModalType('inquiry');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 3D Background Scene */}
      <Suspense fallback={<Scene3DFallback />}>
        <Scene3D />
      </Suspense>

      {/* Navigation */}
      <Navbar onRegisterClick={handleRegisterClick} />

      {/* Main Content */}
      <main>
        <Hero 
          onRegisterClick={handleRegisterClick} 
          onInquireClick={handleInquireClick} 
        />
        <Features />
        <Courses onRegisterClick={handleRegisterClick} />
        <Testimonials />
        <Footer onRegisterClick={handleRegisterClick} />
      </main>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        type={modalType}
      />
    </>
  );
}

export default App;
