const { nativewind } = require('nativewind/preset');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [nativewind()],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        success: '#10B981',
        danger: '#EF4444',
        background: '#000000',
        surface: '#1F2937',
        text: '#FFFFFF',
        textSecondary: '#9CA3AF',
      },
    },
  },
};
