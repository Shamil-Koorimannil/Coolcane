import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CookieBanner from './components/CookieBanner';
import CustomCursor from './components/CustomCursor';
import InitialLoader from './components/InitialLoader';
import Home from './pages/Home';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <InitialLoader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      
      <Footer />
      <CookieBanner />
    </>
  );
}

export default App;
