import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Plugin, PluginOption } from 'vite';

import pluginPurgeCss from 'vite-plugin-purgecss-updated-v5';
import pruneCssVars from './plugins/vite-plugin-prune-css-vars';

const removeEmptyRulesets = (): Plugin => ({
	name: 'remove-empty-rulesets',
	enforce: 'post',
	generateBundle(_, bundle) {
		Object.entries(bundle).forEach(([fileName, file]) => {
			if (
				fileName.endsWith('.css') &&
				'source' in file &&
				typeof file.source === 'string'
			) {
				file.source = file.source
					.replace(/\:root\s*\{\s*\}/g, '')
					.replace(/@media[^{]*\{\s*(?:(?!\{).)*?\s*\}/g, '')
					.replace(/\n{3,}/g, '\n\n')
					.trim();
			}
		});
	}
});

export default defineConfig(({ command }) => ({
	plugins: [
		sveltekit(),

		command === 'serve' &&
			pruneCssVars({
				debug: true
			}),

		command === 'build' &&
			pluginPurgeCss({
				content: ['./src/**/*.{html,js,svelte,ts}'],
				fontFace: true,
				keyframes: true,
				variables: true
			}),

		command === 'build' && removeEmptyRulesets()
	].filter(Boolean) as PluginOption[]
}));