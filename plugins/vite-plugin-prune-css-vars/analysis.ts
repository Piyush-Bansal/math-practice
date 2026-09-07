import { buildAliasMap, collectUsedVariables } from './parser';
import { scanFiles } from './scanner';

import type { PruneCssVarsOptions } from './types';

export interface AnalysisResult {
	used: Set<string>;
	duration: number;
}

export async function analyseProject(
	options: PruneCssVarsOptions = {}
): Promise<AnalysisResult> {
	const start = performance.now();

	// Read all source files.
	const sourceFiles = await scanFiles(options.include, options.exclude);

	// Build alias map.
	const { aliases, definitionFiles } = buildAliasMap(sourceFiles);

	// Resolve the CSS custom properties
	// that are reachable from those aliases.
	const used = collectUsedVariables(sourceFiles, aliases, definitionFiles);

	return {
		used,
		duration: performance.now() - start
	};
}
