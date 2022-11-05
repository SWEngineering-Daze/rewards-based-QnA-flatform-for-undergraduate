// Learn more at https://tailwindcss.com/docs/configuration
import { Config } from 'tailwindcss';

export default (): Config => ({
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
  content: [],
});
