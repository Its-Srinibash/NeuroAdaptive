import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimizations
  build: {
    // Generate sourcemaps for production debugging
    sourcemap: true,
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and React DOM
          vendor: ['react', 'react-dom'],
          
          // Separate chunk for components
          components: [
            './src/components/TaskInput/TaskInput.jsx',
            './src/components/StepList/StepList.jsx',
            './src/components/FocusMode/FocusMode.jsx',
            './src/components/DailyRecap/DailyRecap.jsx'
          ]
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Minification
    minify: 'esbuild',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: true, // Allow external connections
    open: true, // Open browser on start
    
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    host: true
  },
  
  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@styles': resolve(__dirname, './src/styles')
    }
  },
  
  // CSS configuration
  css: {
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    
    // PostCSS configuration
    postcss: {
      plugins: []
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
