import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import franchiseEnquiryHandler from './api/franchise-enquiry.js';
import statusHandler from './api/status.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side and client-side environment variables into process.env
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return {
    base: '/',
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
    plugins: [
      react(),
      {
        name: 'spa-fallback-static-routes',
        closeBundle() {
          const distDir = path.resolve(__dirname, 'dist');
          const indexHtmlPath = path.join(distDir, 'index.html');
          if (fs.existsSync(indexHtmlPath)) {
            const routes = ['franchise-enquiry'];
            routes.forEach((route) => {
              const routeDir = path.join(distDir, route);
              if (!fs.existsSync(routeDir)) {
                fs.mkdirSync(routeDir, { recursive: true });
              }
              fs.copyFileSync(indexHtmlPath, path.join(routeDir, 'index.html'));
            });
          }
        },
      },
      {
        name: 'vite-api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/api/franchise-enquiry') {
              try {
                await franchiseEnquiryHandler(req, res);
              } catch (err) {
                console.error('Vite API Middleware Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
              }
              return;
            }

            if (url === '/api/status' || url === '/api/franchise-status') {
              try {
                await statusHandler(req, res);
              } catch (err) {
                console.error('Vite Status Middleware Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
              }
              return;
            }

            next();
          });
        },
      },
    ],
  };
});
