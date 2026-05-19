import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
const Facebook = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Linkedin = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const Instagram = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;

const Footer = () => {
  const canvasRef = useRef(null);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 250;
    };
    window.addEventListener('resize', resize);
    resize();

    // Game Variables
    let animationFrameId;
    let score = 0;
    let isGameOver = false;
    let speed = 4.5;
    
    // Player
    const player = {
      x: 50,
      y: 150,
      w: 30,
      h: 50,
      dy: 0,
      jumpForce: 13,
      gravity: 0.65,
      isJumping: false,
      color: '#8dc63f' // accent
    };

    // Ground
    const groundY = 200;

    // Obstacles
    let obstacles = [];
    let frameCount = 0;
    let nextSpawnFrame = 0;

    // SVGs as Images for Canvas
    // Coolcane Bottle
    const playerImg = new Image();
    const bottleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 30 50">
      <path d="M5 10 L25 10 L30 45 Q30 50 25 50 L5 50 Q0 50 0 45 Z" fill="#8dc63f"/>
      <rect x="5" y="15" width="20" height="25" fill="#fefae0" opacity="0.9"/>
      <line x1="10" y1="10" x2="10" y2="50" stroke="#143601" stroke-width="1" opacity="0.1"/>
      <line x1="20" y1="10" x2="20" y2="50" stroke="#143601" stroke-width="1" opacity="0.1"/>
      <path d="M10 10 L10 5 Q15 0 20 5 L20 10 Z" fill="#143601"/>
    </svg>`;
    playerImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(bottleSvg);

    // Sugarcane Obstacle (replacing Cactus)
    const obstImg = new Image();
    const caneSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 20 40">
      <rect x="5" y="0" width="10" height="40" fill="#a3c139"/>
      <line x1="5" y1="10" x2="15" y2="10" stroke="#143601" stroke-width="2" opacity="0.3"/>
      <line x1="5" y1="20" x2="15" y2="20" stroke="#143601" stroke-width="2" opacity="0.3"/>
      <line x1="5" y1="30" x2="15" y2="30" stroke="#143601" stroke-width="2" opacity="0.3"/>
      <path d="M15 15 Q20 10 25 15 M5 25 Q0 20 -5 25" stroke="#143601" stroke-width="1.5" fill="none" opacity="0.5"/>
    </svg>`;
    obstImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(caneSvg);

    const resetGame = () => {
      score = 0;
      speed = 4.5;
      obstacles = [];
      frameCount = 0;
      nextSpawnFrame = 60;
      player.y = groundY - player.h;
      player.dy = 0;
      isGameOver = false;
    };

    const jump = () => {
      if (!player.isJumping && !isGameOver) {
        player.dy = -player.jumpForce;
        player.isJumping = true;
      } else if (isGameOver) {
        resetGame();
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    // Prevent default scrolling when tapping canvas
    const handleTouch = (e) => {
        e.preventDefault();
        jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('mousedown', jump);

    const checkCollision = (rect1, rect2) => {
      // Create smaller hitboxes for leniency
      const r1 = { x: rect1.x + 5, y: rect1.y + 5, w: rect1.w - 10, h: rect1.h - 10 };
      const r2 = { x: rect2.x + 5, y: rect2.y + 5, w: rect2.w - 10, h: rect2.h - 10 };
      return (
        r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.y + r1.h > r2.y
      );
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isGameOver) {
        // Update Player
        player.y += player.dy;
        player.dy += player.gravity;

        if (player.y + player.h >= groundY) {
          player.y = groundY - player.h;
          player.dy = 0;
          player.isJumping = false;
        }

        // Spawn Obstacles Logic
        frameCount++;
        if (frameCount >= nextSpawnFrame) {
          // Determine how many obstacles to cluster (1, 2, or 3)
          const numObstacles = Math.floor(Math.random() * 3) + 1;
          const baseDelay = Math.max(70, 150 - Math.floor(speed * 10));

          for (let i = 0; i < numObstacles; i++) {
             obstacles.push({
               x: canvas.width + (i * 20), // stagger them slightly if multiple
               y: groundY - 40,
               w: 20,
               h: 40
             });
          }

          // calculate next spawn frame. Randomize space.
          nextSpawnFrame = frameCount + baseDelay + Math.floor(Math.random() * 60) + (numObstacles * 10);
        }

        // Update Obstacles
        for (let i = 0; i < obstacles.length; i++) {
          obstacles[i].x -= speed;

          if (checkCollision(player, obstacles[i])) {
            isGameOver = true;
          }
        }

        // Remove offscreen
        obstacles = obstacles.filter(obs => obs.x + obs.w > -50);

        // Score & Speed
        score++;
        if (score % 500 === 0) speed += 0.5;
      }

      // Draw Ground
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.strokeStyle = '#fefae0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Player
      if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
      } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.w, player.h);
      }

      // Draw Obstacles
      obstacles.forEach(obs => {
        if (obstImg.complete) {
          ctx.drawImage(obstImg, obs.x, obs.y, 30, obs.h); // visual width slightly larger for leaves
        } else {
          ctx.fillStyle = '#a3c139';
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
      });

      // Draw UI
      ctx.fillStyle = '#fefae0';
      ctx.font = '16px "Syne", sans-serif';
      ctx.fillText(`Score: ${Math.floor(score / 10)}`, 20, 30);
      
      if (!player.isJumping && score < 100) {
         ctx.fillText('Press SPACE or Tap to Jump', canvas.width / 2 - 100, 30);
      }

      if (isGameOver) {
        ctx.fillStyle = 'rgba(20, 54, 1, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#8dc63f';
         ctx.font = 'bold 32px "Syne", sans-serif';
         ctx.fillText('GAME OVER', canvas.width / 2 - 90, canvas.height / 2 - 20);
         
         ctx.fillStyle = '#fefae0';
         ctx.font = '16px "Syne", sans-serif';
         ctx.fillText(`Final Score: ${Math.floor(score / 10)}`, canvas.width / 2 - 60, canvas.height / 2 + 10);
         ctx.fillText('Press SPACE or Tap to Restart', canvas.width / 2 - 110, canvas.height / 2 + 40);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    playerImg.onload = () => {
        obstImg.onload = () => {
            loop();
        }
    };
    
    // Fallback if images fail to load
    setTimeout(() => { if (!animationFrameId) loop(); }, 500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('mousedown', jump);
    };
  }, []);

  return (
    <footer className="bg-bg text-text-light relative overflow-hidden flex flex-col">
      {/* Background Floating Clouds */}
      <motion.div 
        animate={{ x: [0, 200, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 opacity-10 pointer-events-none z-0 text-accent"
      >
        <svg width="100" height="50" viewBox="0 0 100 50" fill="currentColor">
           <path d="M20 40 Q10 40 10 30 Q10 20 20 20 Q25 10 35 15 Q40 5 55 10 Q70 0 80 15 Q95 15 90 30 Q100 40 80 40 Z"/>
        </svg>
      </motion.div>
      <motion.div 
        animate={{ x: [0, -200, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 opacity-10 pointer-events-none z-0 text-accent"
      >
        <svg width="150" height="75" viewBox="0 0 100 50" fill="currentColor">
           <path d="M20 40 Q10 40 10 30 Q10 20 20 20 Q25 10 35 15 Q40 5 55 10 Q70 0 80 15 Q95 15 90 30 Q100 40 80 40 Z"/>
        </svg>
      </motion.div>

      {/* Mini Game Container */}
      <div className="w-full relative z-10 border-t border-white/10 cursor-pointer">
         <canvas ref={canvasRef} className="block w-full touch-none" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-12 flex flex-col items-center gap-8 relative z-10">
        
        {/* Socials & Links */}
        <div className="w-full flex justify-center space-x-6">
          <a href="https://www.instagram.com/coolcane_india" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Instagram size={24} /></a>
          <a href="#" className="hover:text-accent transition-colors"><Facebook size={24} /></a>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-text-light/60">
           <span>2026 &copy; Coolcane India</span>
           <div className="flex space-x-6">
             <a href="#" className="hover:text-accent transition-colors">Terms of Use</a>
             <a href="#" className="hover:text-accent transition-colors">Franchise Policy</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
