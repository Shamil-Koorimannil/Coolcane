import React from 'react';
import ProductCarouselHero from '../components/ProductCarouselHero';
import GSAPScrollSection from '../components/GSAPScrollSection';
import Franchise from '../components/Franchise';
import FeaturesSection from '../components/FeaturesSection';
import ProductGrid from '../components/ProductGrid';
import InstagramGrid from '../components/InstagramGrid';
import ReviewSection from '../components/ReviewSection';
import AboutBrand from '../components/AboutBrand';
import Locations from '../components/Locations';

const Home = () => {
  return (
    <main>
      <ProductCarouselHero />
      <AboutBrand />
      <FeaturesSection />
      <GSAPScrollSection />
      <ProductGrid />
      <Locations />
      <ReviewSection />
      <Franchise />
      <InstagramGrid />
    </main>
  );
};

export default Home;
