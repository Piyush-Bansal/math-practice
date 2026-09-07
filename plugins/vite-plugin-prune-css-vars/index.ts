import type { HmrContext, Plugin } from 'vite';

import { analyseProject } from './analysis';
import { pruneUnusedVariables } from './pruner';

import type { PruneCssVarsOptions } from './types';

const STYLE_FILE_REGEX = /\.(scss|sass|svelte)$/;

export default function pruneCssVars(
	options: PruneCssVarsOptions = {}
): Plugin {
	let used = new Set<string>();

	let dirty = true;
	let analysis: Promise<void> | null = null;

	async function ensureAnalysis(): Promise<void> {
		if (!dirty) {
			return;
		}

		if (!analysis) {
			analysis = analyseProject(options)
				.then(({ used: variables, duration }) => {
					used = variables;
					dirty = false;

					if (options.debug) {
						console.log(
							`[prune-css-vars] ${used.size} variables (${duration.toFixed(1)} ms)`
						);
					}
				})
				.finally(() => {
					analysis = null;
				});
		}

		try {
			await analysis;
		} catch (error) {
			throw new Error(
				`[vite-plugin-prune-css-vars] ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	return {
		name: 'vite-plugin-prune-css-vars',

		apply(_config, { command }) {
			return command === 'serve';
		},

		handleHotUpdate(ctx: HmrContext) {
			if (STYLE_FILE_REGEX.test(ctx.file)) {
				dirty = true;
			}
		},

		async transform(code, id) {
			if (!id.endsWith('.scss') && !id.includes('type=style')) {
				return null;
			}

			if (!code.includes('--')) {
				return null;
			}

			await ensureAnalysis();

			return {
				code: pruneUnusedVariables(code, used, options.preserve),
				map: null
			};
		}
	};
}
