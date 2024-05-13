/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js}',
    './components/**/*.{ts,tsx,js}',
    './app/**/*.{ts,tsx,js}',
    './src/**/*.{ts,tsx,js}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'skyblue': {
            '500': '#95cade',
        },
        'royal-blue': {
            '50': '#ecf4ff',
            '100': '#ddeaff',
            '200': '#c2d9ff',
            '300': '#9cbeff',
            '400': '#7598ff',
            '500': '#5271ff',
            '600': '#3649f5',
            '700': '#2a39d8',
            '800': '#2533ae',
            '900': '#263389',
            '950': '#161b50',
        },  
        'cornflower': {
            '50': '#f3f8fc',
            '100': '#e7f2f7',
            '200': '#c9e3ee',
            '300': '#95cade',
            '400': '#63b1cd',
            '500': '#3f98b8',
            '600': '#2e7b9b',
            '700': '#27637d',
            '800': '#235369',
            '900': '#224758',
            '950': '#172e3a',
        },
        'pastel-purple': {
            '50': '#f8f8fa',
            '100': '#f3f1f6',
            '200': '#e9e6ee',
            '300': '#d7d1e1',
            '400': '#c1b6cf',
            '500': '#a998ba',
            '600': '#9680a7',
            '700': '#846d94',
            '800': '#6e5b7c',
            '900': '#5b4c66',
            '950': '#3c3144',
        },  
        'almost-black': {
            '50': '#f7f7f8',
            '100': '#eeedf1',
            '200': '#d8d8df',
            '300': '#b6b6c3',
            '400': '#8f8ea2',
            '500': '#717087',
            '600': '#5b5a6f',
            '700': '#4b495b',
            '800': '#3d3c49',
            '900': '#393842',
            '950': '#26252c',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}