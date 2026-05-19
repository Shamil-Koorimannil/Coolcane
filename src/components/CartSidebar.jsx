import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const CartSidebar = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-dark/30 backdrop-blur-sm z-[110]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-bg z-[120] shadow-2xl flex flex-col pt-6 pb-12 px-8"
          >
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-syne font-bold text-text-light">Cart</h2>
               <button onClick={onClose} className="text-text-light/50 hover:text-text-light transition-colors">
                 <X size={28} />
               </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-t border-b border-white/10 py-10">
               <span className="text-text-light/60 text-lg">Your cart is currently empty.</span>
            </div>

            <div className="mt-8">
               <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-4">
                  <span className="text-text-light font-medium">Subtotal</span>
                  <span className="text-text-light font-bold">$0.00</span>
               </div>
               <p className="text-text-light/50 text-sm text-center mb-6">
                 Taxes and shipping costs calculated at checkout
               </p>

               <button className="w-full py-4 bg-bg-light text-bg font-bold rounded-full hover:bg-accent transition-colors text-lg">
                 Payment
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
