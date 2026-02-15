/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 古风配色
        'xuan-gold': '#C9A962',
        'xuan-red': '#8B2323',
        'xuan-dark': '#1A1A1A',
        'xuan-paper': '#F5E6D3',
        'xuan-ink': '#2C2C2C',
        'xuan-jade': '#4A7C59',
        // 五行配色
        'wuxing-metal': '#C0C0C0',
        'wuxing-wood': '#228B22',
        'wuxing-water': '#1E3A5F',
        'wuxing-fire': '#B22222',
        'wuxing-earth': '#8B7355',
      },
      fontFamily: {
        'kai': ['KaiTi', 'STKaiti', 'serif'],
        'song': ['SimSun', 'STSong', 'serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.png')",
      },
    },
  },
  plugins: [],
}
