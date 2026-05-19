import React from 'react';
import { motion } from 'framer-motion';

const AboutBrand = () => {
  return (
    <section id="about" className="py-24 bg-bg text-text-light px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 text-accent uppercase">About Coolcane</h2>
          <p className="text-lg opacity-80 mb-6 leading-relaxed">
            Coolcane is a modern sugarcane beverage brand designed for today’s fast-moving, youth-driven lifestyle. Built around the idea of transforming a traditional street-side drink into a clean, consistent, and visually appealing experience, Coolcane delivers <strong>live crushed sugarcane juice</strong> with a creative twist.
          </p>
          <p className="text-lg opacity-80 mb-6 leading-relaxed">
            Unlike typical roadside vendors, Coolcane focuses on hygiene, quality, and presentation — making sugarcane juice not just a drink, but a daily refreshment choice people trust and enjoy. Our product is never packed; it is always freshly extracted, live crushed sugarcane juice.
          </p>
          <p className="text-lg opacity-80 mb-6 leading-relaxed">
            From classic flavors to innovative blends like mint, chocolate, fruit infusions, and health-focused mixes, Coolcane turns every glass into a refreshing and memorable experience. Whether it’s a quick stop between classes or a hangout with friends, Coolcane is designed to feel effortless, cool, and energizing.
          </p>


        </div>

        <div className="space-y-12">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-3xl font-syne font-bold mb-4 text-bg-light uppercase">Mission</h3>
            <p className="text-lg opacity-80 leading-relaxed border-l-4 border-accent pl-4">
              To deliver a clean, refreshing, and consistent live crushed sugarcane juice experience by combining natural ingredients, innovative flavors, and high hygiene standards — while making healthy beverages more accessible and enjoyable for everyday consumption.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="text-3xl font-syne font-bold mb-4 text-bg-light uppercase">Vision</h3>
            <p className="text-lg opacity-80 leading-relaxed border-l-4 border-star pl-4">
              To become the most preferred sugarcane beverage brand by redefining traditional juice culture through modern branding, innovation, and customer experience.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-3xl font-syne font-bold mb-4 text-bg-light uppercase">Brand Story</h3>
            <p className="text-lg opacity-80 leading-relaxed border-l-4 border-accent pl-4">
              Coolcane was created from a simple observation: sugarcane juice is one of the most refreshing and natural drinks, yet the experience around it often feels inconsistent, unhygienic, and outdated.<br /><br />
              Coolcane reimagines this everyday drink by bringing structure, cleanliness, and creativity into the process. By combining freshly harvested sugarcane with unique flavor combinations and a strong focus on presentation, the brand transforms a basic refreshment into something exciting and reliable. Designed especially for young consumers and everyday routines, Coolcane is not just about quenching thirst — it’s about creating a refreshing moment people look forward to.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
