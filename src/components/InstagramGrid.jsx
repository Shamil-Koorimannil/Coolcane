import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Instagram = ({ size, className }) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;

const MOCK_POSTS = [
  { id: 1, image: "https://picsum.photos/400/500?random=11", link: "https://www.instagram.com/coolcane_india" },
  { id: 2, image: "https://picsum.photos/400/500?random=12", link: "https://www.instagram.com/coolcane_india" },
  { id: 3, image: "https://picsum.photos/400/500?random=13", link: "https://www.instagram.com/coolcane_india" },
  { id: 4, image: "https://picsum.photos/400/500?random=14", link: "https://www.instagram.com/coolcane_india" },
  { id: 5, image: "https://picsum.photos/400/500?random=15", link: "https://www.instagram.com/coolcane_india" },
  { id: 6, image: "https://picsum.photos/400/500?random=16", link: "https://www.instagram.com/coolcane_india" },
  { id: 7, image: "https://picsum.photos/400/500?random=17", link: "https://www.instagram.com/coolcane_india" },
  { id: 8, image: "https://picsum.photos/400/500?random=18", link: "https://www.instagram.com/coolcane_india" },
];

const InstagramGrid = () => {
  const [displayPosts, setDisplayPosts] = useState(MOCK_POSTS.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayPosts(current => {
        const newPosts = [...current];
        const indexToReplace = Math.floor(Math.random() * 4);
        const availablePosts = MOCK_POSTS.filter(p => !current.find(cp => cp.id === p.id));
        if (availablePosts.length > 0) {
          const randomNewPost = availablePosts[Math.floor(Math.random() * availablePosts.length)];
          newPosts[indexToReplace] = randomNewPost;
        }
        return newPosts;
      });
    }, 4000); // Change one post every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="instagram" className="py-24 bg-bg-light px-4 border-t border-text-dark/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <a href="https://www.instagram.com/coolcane_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group mb-16">
          <span className="text-xl font-bold font-syne text-accent mb-4">@coolcane_india</span>
          <h2 className="text-4xl md:text-5xl font-syne font-bold text-text-dark text-center">
            For a dose of energy in your feed.
          </h2>
        </a>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {displayPosts.map((post, i) => (
            <motion.a 
              key={i} 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-bg group block"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={post.id}
                  src={post.image} 
                  alt={`Instagram Post`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-text-dark/0 group-hover:bg-text-dark/20 transition-colors duration-500 flex items-center justify-center z-10 pointer-events-none">
                 <Instagram size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100 transform" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.a 
          href="https://www.instagram.com/coolcane_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="mt-12 flex items-center justify-center w-16 h-16 rounded-full bg-text-dark text-bg-light hover:bg-accent hover:text-text-dark transition-colors"
        >
          <Instagram size={24} />
        </motion.a>

      </div>
    </section>
  );
};

export default InstagramGrid;
