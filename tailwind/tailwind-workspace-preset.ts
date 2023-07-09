import defaultTheme from 'tailwindcss/defaultTheme'
import { themeColors } from './colors'

const fontFamily = defaultTheme.fontFamily
fontFamily.sans = [
  'Inconsolata',
  'monospace',
  'Courier New',
  'Roboto',
  'system-ui'
]

export default {
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily,
    extend: {
      colors: themeColors
    }
  }
}
