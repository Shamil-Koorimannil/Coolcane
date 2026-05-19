import React from 'react';
import { motion } from 'framer-motion';

// Import flavor images
import chilliOrange from '../assets/flavours/Chilli orange.png';
import grape from '../assets/flavours/Grape.png';
import guava from '../assets/flavours/Guava.png';
import mango from '../assets/flavours/Mango .png';
import papaya from '../assets/flavours/Papaya.png';
import passionFruit from '../assets/flavours/Passion fruit.png';
import pineapple from '../assets/flavours/Pineapple.png';
import redCurrant from '../assets/flavours/Red currant.png';
import waterMelon from '../assets/flavours/Water melon.png';

const ProductGrid = () => {
  const products = [
    { name: 'Chilli Orange', image: chilliOrange, color: '#f79f8e' },
    { name: 'Grape', image: grape, color: '#c387ad' },
    { name: 'Guava', image: guava, color: '#97d299' },
    { name: 'Mango', image: mango, color: '#f7c059' },
    { name: 'Papaya', image: papaya, color: '#f79f8e' },
    { name: 'Passion Fruit', image: passionFruit, color: '#e4dfd8' },
    { name: 'Pineapple', image: pineapple, color: '#f7c059' },
    { name: 'Red Currant', image: redCurrant, color: '#c387ad' },
    { name: 'Watermelon', image: waterMelon, color: '#f79f8e' }
  ];

  const StarRating = () => (
    <div className="flex space-x-1 justify-center my-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="var(--color-star)" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0L12.4 7.6H20L13.8 12.4L16.2 20L10 15.2L3.8 20L6.2 12.4L0 7.6H7.6L10 0Z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section id="flavours" className="py-24 bg-bg-light px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-syne font-bold text-text-dark mb-2">
              Our Fresh Flavors
            </h2>
            <p className="text-lg text-text-dark/80">Experience our 100% natural, live crushed sugarcane juice blends.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((prod, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-4 flex flex-col cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full aspect-[4/5] rounded-xl relative overflow-hidden mb-4 p-4 flex items-center justify-center transition-colors" style={{ backgroundColor: prod.color }}>
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-contain drop-shadow-xl transform transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              
              <h3 className="text-center font-bold text-text-dark font-syne text-lg md:text-xl leading-tight line-clamp-2 min-h-[3rem] flex items-center justify-center">
                {prod.name}
              </h3>
              
              <StarRating />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;

