import type { SourceFile } from './scanner';

export interface AliasMap {
	aliases: Map<string, string>;
	definitionFiles: Set<string>;
}

const ALIAS_REGEX = /\$([\w-]+)\s*:\s*var\(\s*(--[\w-]+)\s*\)\s*;/g;

const SCSS_VARIABLE_REGEX = /\$([\w-]+)/g;

const CSS_VARIABLE_REGEX = /var\(\s*(--[\w-]+)/g;

export function buildAliasMap(files: ReadonlyArray<SourceFile>): AliasMap {
	const aliases = new Map<string, string>();
	const definitionFiles = new Set<string>();

	for (const { file, source } of files) {
		ALIAS_REGEX.lastIndex = 0;

		let match: RegExpExecArray | null;
		let hasAliases = false;

		while ((match = ALIAS_REGEX.exec(source))) {
			aliases.set(match[1], match[2]);
			hasAliases = true;
		}

		if (hasAliases) {
			definitionFiles.add(file);
		}
	}

	return {
		aliases,
		definitionFiles
	};
}

export function collectUsedVariables(
	files: ReadonlyArray<SourceFile>,
	aliases: ReadonlyMap<string, string>,
	definitionFiles: ReadonlySet<string>
): Set<string> {
	const used = new Set<string>();

	for (const { file, source } of files) {
		if (definitionFiles.has(file)) {
			continue;
		}

		SCSS_VARIABLE_REGEX.lastIndex = 0;

		let match: RegExpExecArray | null;

		while ((match = SCSS_VARIABLE_REGEX.exec(source))) {
			const cssVariable = aliases.get(match[1]);

			if (cssVariable) {
				used.add(cssVariable);
			}
		}

		CSS_VARIABLE_REGEX.lastIndex = 0;

		while ((match = CSS_VARIABLE_REGEX.exec(source))) {
			used.add(match[1]);
		}
	}

	return used;
}
