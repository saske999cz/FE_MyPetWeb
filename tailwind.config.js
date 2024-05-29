/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        openPreview: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        closePreview: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-16px)' },
        },
        openReply: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        closeReply: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-16px)' },
        },
      },
      animation: {
        openPreview: 'openPreview 0.5s ease-in-out',
        closePreview: 'closePreview 0.4s ease-in-out',
        openReply: 'openReply 0.5s ease-in-out',
        closeReply: 'closeReply 0.4s ease-in-out',
      },
    },
  },
  variants: {},
  plugins: [],
};
