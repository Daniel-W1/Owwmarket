import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible'
import macrosPlugin from 'vite-plugin-babel-macros'
import WindiCSS from 'vite-plugin-windicss'


export default {
  plugins: [
     react(),
     envCompatible.default(),  
     macrosPlugin(), 
      WindiCSS(),
     svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
}