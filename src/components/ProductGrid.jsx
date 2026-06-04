import React from 'react';
import { motion } from 'framer-motion';

// Import all flavor images (including the 10 newly added ones)
import abc from '../assets/Flavours/ABC .png';
import amla from '../assets/Flavours/Amla.png';
import beetroot from '../assets/Flavours/Beetroot.png';
import blueberry from '../assets/Flavours/Blue berry.png';
import chilliOrange from '../assets/Flavours/Chilli orange.png';
import chilli from '../assets/Flavours/Chilli.png';
import cucumber from '../assets/Flavours/Cucumber.png';
import ginger from '../assets/Flavours/Ginger.png';
import grape from '../assets/Flavours/Grape.png';
import guava from '../assets/Flavours/Guava.png';
import mango from '../assets/Flavours/Mango .png';
import mint from '../assets/Flavours/Mint.png';
import papaya from '../assets/Flavours/Papaya.png';
import passionFruit from '../assets/Flavours/Passion fruit.png';
import pineapple from '../assets/Flavours/Pineapple.png';
import redCurrant from '../assets/Flavours/Red currant.png';
import strawberry from '../assets/Flavours/Strawberry .png';
import waterMelon from '../assets/Flavours/Water melon.png';
import cranberry from '../assets/Flavours/cranberry.png';

const ProductGrid = () => {
  const products = [
    { name: 'ABC (Apple Beet Carrot)', image: abc, color: '#a03b30' },
    { name: 'Amla (Gooseberry)', image: amla, color: '#a6c280' },
    { name: 'Beetroot', image: beetroot, color: '#8c2641' },
    { name: 'Blueberry', image: blueberry, color: '#3d528b' },
    { name: 'Chilli Orange', image: chilliOrange, color: '#fba074' },
    { name: 'Chilli Cane', image: chilli, color: '#bf433b' },
    { name: 'Cucumber', image: cucumber, color: '#7ba876' },
    { name: 'Ginger Cane', image: ginger, color: '#dfb76c' },
    { name: 'Grape', image: grape, color: '#c387ad' },
    { name: 'Guava', image: guava, color: '#97d299' },
    { name: 'Mango', image: mango, color: '#f7c059' },
    { name: 'Mint Cane', image: mint, color: '#579d71' },
    { name: 'Papaya', image: papaya, color: '#f9804e' },
    { name: 'Passion Fruit', image: passionFruit, color: '#e4dfd8' },
    { name: 'Pineapple', image: pineapple, color: '#f7d359' },
    { name: 'Red Currant', image: redCurrant, color: '#dc5d6e' },
    { name: 'Strawberry', image: strawberry, color: '#e05367' },
    { name: 'Watermelon', image: waterMelon, color: '#f67b82' },
    { name: 'Cranberry', image: cranberry, color: '#bd2b45' }
  ];

  return (
    <section id="flavours" className="py-24 bg-bg-light px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-syne font-black text-text-dark mb-2 tracking-tight">
              OUR FRESH FLAVORS
            </h2>
            <p className="text-lg text-text-dark/70 font-sans tracking-wide">
              100% natural, live crushed sugarcane juice blends. Refreshment redefined.
            </p>
          </div>
        </div>

        {/* Multi-column grid optimized for smaller frames and high visual focus */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {products.map((prod, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05, duration: 0.5 }}
              className="flex flex-col items-center cursor-pointer group relative"
            >
              {/* Image Frame Container - Curved frame with box-fit image and no padding */}
              <div 
                className="w-full aspect-[4/5] rounded-[2rem] flex items-center justify-center relative overflow-hidden transition-all duration-500 mb-4 p-0 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
                style={{ 
                  backgroundColor: `${prod.color}12`, // very soft tint
                  border: `1.5px solid ${prod.color}25` // matching border
                }}
              >
                {/* Product Image - Box fit (object-cover) to fill the curved frame directly */}
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105 relative z-10" 
                />
              </div>
              
              {/* Product Title */}
              <h3 className="text-center font-syne font-bold text-text-dark text-base md:text-lg leading-tight px-1 group-hover:text-accent transition-colors duration-300">
                {prod.name}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;
