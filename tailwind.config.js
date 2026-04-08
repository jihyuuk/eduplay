/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Border Width (v3는 0, 2, 4, 8만 기본 제공)
      borderWidth: {
        '1': '1px',
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
      },

      // 2. Border Radius (v3는 3xl이 끝, v4는 무제한)
      borderRadius: {
        '4xl': '2rem',    // 32px
        '5xl': '3rem',    // 48px
        '6xl': '4rem',    // 64px
        'full-strong': '9999px',
      },

      // 3. Spacing (Margin, Padding, Gap, Width, Height 모두 적용)
      // v3는 12(3rem) 다음이 14(3.5rem)입니다. 13, 15 같은 홀수를 썼다면 추가해야 합니다.
      spacing: {
        '3': '0.75rem', // 12px 추가
        '5': '1.25rem', // 20px 추가
        '13': '3.25rem',  // 52px
        '15': '3.75rem',  // 60px
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
      },
      
      // 4. 혹시 그림자(Shadow)도 큼직한 걸 쓰셨다면
      boxShadow: {
        '4xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}