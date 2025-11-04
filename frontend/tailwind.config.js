/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      /* 🎨 Paleta de colores institucional */
      colors: {
        colegio: {
          azul: "#1e40af",       // Azul profundo
          azulClaro: "#3b82f6",  // Azul brillante (acento)
          morado: "#6366f1",     // Púrpura (segundo acento)
          gris: "#94a3b8",       // Texto secundario
          blanco: "#f8fafc",     // Fondo claro
          oscuro: "#0f172a",     // Fondo oscuro principal
        },
      },

      /* 🧠 Tipografías */
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },

      /* 🌈 Gradientes reutilizables */
      backgroundImage: {
        'gradient-azul': 'linear-gradient(to right, #1e40af, #3b82f6)',
        'gradient-azul-morado': 'linear-gradient(to right, #2563eb, #6366f1)',
        'gradient-claro': 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
      },

      /* 💫 Sombras suaves */
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.4)',
        card: '0 8px 30px rgba(0,0,0,0.25)',
      },

      /* 🧩 Animaciones personalizadas */
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        blob: 'blob 7s infinite',
        slideUp: 'slideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      },

      /* 📱 Breakpoints personalizados */
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      /* 🧩 Bordes y transiciones */
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
