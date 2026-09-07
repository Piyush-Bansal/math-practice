import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	compilerOptions: {
		experimental: {
			async: true
		}
	},

	kit: {
		adapter: adapter(),
		alias: {
			$styles: './src/scss',
			$tokens: './src/scss/tokens/functional',
			$breakpoints: './src/scss/abstract/mixins',
			$sizes: './src/scss/abstract/functions',
			$components: './src/components'
		},
		experimental: {
			remoteFunctions: true
		}
	},

	vitePlugin: {
		inspector: {
			toggleKeyCombo: 'control-shift'
		}
	}
};

export default config;
