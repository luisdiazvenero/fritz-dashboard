/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',  // Añadir ts,tsx
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
			
  			border: 'hsl(var(--border))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		  transitionTimingFunction: {
			'dialog-spring': 'cubic-bezier(0.16, 1, 0.3, 1)'
		  },
		  keyframes: {
			'dialog-in': {
          '0%': { 
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)'
          },
          '100%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          }
        },
        'dialog-out': {
          '0%': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)'
          },
          '100%': {
            opacity: '0',
            transform: 'translate(-50%, -48%) scale(0.96)'
          },
		  "slide-in-from-top-2": {
          "0%": { transform: "translateY(-2%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom-2": {
          "0%": { transform: "translateY(2%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left-2": {
          "0%": { transform: "translateX(-2%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right-2": {
          "0%": { transform: "translateX(2%)" },
          "100%": { transform: "translateX(0)" },
        }
        },
			"accordion-down": {
			  from: { height: 0 },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: 0 },
			},
			// Agrega estas nuevas animaciones
			"toast-hide": {
			  '0%': { opacity: 1 },
			  '100%': { opacity: 0 },
			},
			"toast-slide-in-right": {
			  '0%': { transform: `translateX(calc(100% + 1rem))` },
			  '100%': { transform: 'translateX(0)' },
			},
			"toast-slide-in-bottom": {
			  '0%': { transform: `translateY(calc(100% + 1rem))` },
			  '100%': { transform: 'translateY(0)' },
			},
			"toast-slide-in-top": {
			  '0%': { transform: `translateY(calc(-100% - 1rem))` },
			  '100%': { transform: 'translateY(0)' },
			},
		  },
		  translate: {
			'1/2': '50%',
			'-1/2': '-50%'
		  },
		  zIndex: {
			'100': '100'
		  },
		  animation: {
			'dialog-in': 'dialog-in 0.2s ease-out',
        'dialog-out': 'dialog-out 0.2s ease-in',
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
			// Agrega estas nuevas animaciones
			"toast-hide": "toast-hide 100ms ease-in forwards",
			"toast-slide-in-right": "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			"toast-slide-in-bottom": "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			"toast-slide-in-top": "toast-slide-in-top 150ms cubic-bezier(0.16, 1, 0.3, 1)",
			"slide-in-from-top": "slide-in-from-top-2 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom-2 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left-2 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right-2 0.2s ease-out",
		  },
		  // Variables personalizadas para el diálogo
		  variants: {
			extend: {
			  transform: ['dialog'],
			  translate: ['dialog'],
			  scale: ['dialog']
			}
		  }
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    // Añadir un plugin para asegurar que las transformaciones se generen
    function({ addUtilities }) {
      addUtilities({
        '.translate-center': {
          transform: 'translate(-50%, -50%)'
        },
      })
    }
  ]
}