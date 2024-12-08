```bash
function vue-tailwind-daisyui() {
  npm create vue@latest

  cd app

  npm install
  npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
  npm install -D @tailwindcss/typography
  npx tailwindcss init -p
  npm install daisyui

  TAILWIND_CONFIG="
    module.exports = {
      purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
      darkMode: false,
      theme: {
        extend: {},
      },
      variants: {
        extend: {},
      },
      plugins: [require("daisyui"), require("@tailwindcss/typography")],
    }
  "

  echo "$TAILWIND_CONFIG" > tailwind.config.js

  POSTCSS_CONFIG="
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    }
  "

  echo "$POSTCSS_CONFIG" > postcss.config.js

  INDEX_CSS="
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  "

  echo "$INDEX_CSS" > src/assets/index.css

  echo "Done ✨"
}
```
