// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr' // npm install vite-plugin-svgr --save-dev

export default defineConfig(({ mode }) => {
  // .env, .env.local 등에서 읽기 (VITE_*만 사용 권장)
  const env = loadEnv(mode, process.cwd(), '');
  const BACKEND = (env.VITE_BACKEND_URL || 'http://localhost:9000').replace(/\/+$/, '');

  return {
    plugins: [react(), svgr()],
    server: {
      port: 5173,
      proxy: {
        // ✅ 백엔드가 /api/** 를 실제로 받으므로 rewrite 제거
        '/api': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        },
        '/images': {
          target: BACKEND,
          changeOrigin: true,
          secure: false,
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@utils': '/src/utils',
        '@contexts': '/src/contexts',
        '@styles': '/src/styles',
        '@assets': '/src/assets'
      }
    }
  };
});