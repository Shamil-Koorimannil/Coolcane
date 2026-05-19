import React from 'react';
import { motion } from 'framer-motion';

const Locations = () => {
  const branches = [
    {
      city: "Perinthalmanna",
      name: "Bypass Road",
      address: "Near Bismi Hypermart, Ooty-Calicut Bypass Road, Kerala 679322",
      link: "https://share.google/9n64I35JbqKwwgg7f"
    },
    {
      city: "Kozhikode",
      name: "Mananchira",
      address: "Mananchira, Kozhikode, Kerala 673001",
      link: "https://share.google/F7uPuFEWIhvBIAAvR"
    },
    {
      city: "Perinthalmanna",
      name: "Bus Stand",
      address: "Moosakutty Memorial Bus Stand, Kerala 679322",
      link: "https://share.google/DAldxN5TI5osa5bt6"
    },
    {
      city: "Thrissur",
      name: "Keerankulangara",
      address: "St Thomas College Rd, Keerankulangara, Kerala 680005",
      link: "https://share.google/2HOxCKhdOs97ZwVcS"
    },
    {
      city: "Malappuram",
      name: "Kizhakkethala",
      address: "Kizhakkethala, Malappuram, Kerala 676503",
      link: "https://share.google/1ntRvRHc5XVtlGaRt"
    },
    {
      city: "Pattambi",
      name: "Mele",
      address: "MG Road, Opposite ICICI Bank, Mele, Kerala 679306",
      link: "https://share.google/zvgZxXSJJTSwVBqCA"
    },
    {
      city: "Kozhikode",
      name: "Ashokapuram",
      address: "Ashokapuram, Kozhikode, Kerala 673001",
      link: "https://share.google/4bXH2gbr0Pes5CXbm"
    }
  ];

  return (
    <section id="locations" className="py-32 bg-bg-light px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold tracking-widest uppercase mb-4 text-sm"
            >
              Our Network
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-syne font-black text-text-dark tracking-tight"
            >
              Find a<br/><span className="text-accent">Coolcane.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-dark/70 max-w-md"
          >
            Experience the true taste of live crushed sugarcane juice at any of our fresh locations across Kerala.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {branches.map((branch, i) => (
            <motion.a
              href={branch.link}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden bg-white rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 border border-black/[0.03] hover:shadow-2xl hover:shadow-accent/20 flex flex-col justify-between"
            >
              {/* Dynamic Hover Background */}
              <div className="absolute inset-0 bg-text-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-full bg-bg-light group-hover:bg-white/10 flex items-center justify-center transition-colors duration-500">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" className="text-accent group-hover:text-accent transition-colors duration-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  {/* Pulsing Status Dot */}
                  <div className="flex items-center gap-2 bg-bg-light group-hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors duration-500">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    <span className="text-xs font-bold text-text-dark group-hover:text-white uppercase tracking-wider transition-colors duration-500">Open</span>
                  </div>
                </div>

                <h3 className="text-3xl font-black font-syne text-text-dark group-hover:text-white mb-1 transition-colors duration-500">
                  {branch.city}
                </h3>
                <h4 className="text-lg font-medium text-accent mb-4">
                  {branch.name}
                </h4>
                
                <p className="text-text-dark/60 group-hover:text-white/70 text-sm leading-relaxed min-h-[3rem] transition-colors duration-500">
                  {branch.address}
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-black/5 group-hover:border-white/10 flex items-center justify-between transition-colors duration-500">
                <span className="font-bold text-text-dark group-hover:text-white transition-colors duration-500">View Map</span>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center transform group-hover:translate-x-2 transition-transform duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
