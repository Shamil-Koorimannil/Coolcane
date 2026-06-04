import React from 'react';
import ProductCarouselHero from '../components/ProductCarouselHero';
import GSAPScrollSection from '../components/GSAPScrollSection';
import Franchise from '../components/Franchise';
import FeaturesSection from '../components/FeaturesSection';
import ProductGrid from '../components/ProductGrid';
import InstagramGrid from '../components/InstagramGrid';
import ReviewSection from '../components/ReviewSection';
import AboutBrand from '../components/AboutBrand';
import ShopsGallery from '../components/ShopsGallery';
import Roadmap from '../components/Roadmap';

const Home = () => {
  return (
    <main>
      <ProductCarouselHero />
      <AboutBrand />
      <Roadmap />
      <FeaturesSection />
      <GSAPScrollSection />
      <ProductGrid />
      <ShopsGallery />
      <ReviewSection />
      <Franchise />
      <InstagramGrid />
    </main>
  );
};

export default Home;
