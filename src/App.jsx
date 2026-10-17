import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import CustomCursor from './components/CustomCursor';
import InitialLoader from './components/InitialLoader';
import Home from './pages/Home';
import FranchiseEnquiryPage from './pages/FranchiseEnquiryPage';

// Scroll to top helper component on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isEnquiryPage = location.pathname.startsWith('/franchise-enquiry');

  return (
    <>
      <ScrollToTop />
      {loading && <InitialLoader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      
      {!isEnquiryPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/franchise-enquiry" element={<FranchiseEnquiryPage />} />
      </Routes>

      {!isEnquiryPage && <Footer />}
      <CookieBanner />
    </>
  );
}

export default App;
