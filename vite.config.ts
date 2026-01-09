import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
<<<<<<< HEAD
  base: '/hindihub4u/',   // 👈 ADD THIS LINE

=======
>>>>>>> ef0d593a0aa5c84fc7a4e090c973a3d883b28840
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD

=======
>>>>>>> ef0d593a0aa5c84fc7a4e090c973a3d883b28840
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
