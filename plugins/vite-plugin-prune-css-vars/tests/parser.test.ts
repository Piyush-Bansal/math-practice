import { describe, expect, it } from 'vitest';

import { buildAliasMap, collectUsedVariables } from '../parser';

import type { SourceFile } from '../scanner';

describe('buildAliasMap', () => {
	it('builds an alias map from Sass variables', () => {
		const files: SourceFile[] = [
			{
				file: 'tokens.scss',
				source: `
					$foo: var(--foo);
					$bar: var(--bar);
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		expect(aliases.get('foo')).toBe('--foo');
		expect(aliases.get('bar')).toBe('--bar');
		expect(definitionFiles.has('tokens.scss')).toBe(true);
	});

	it('ignores files without aliases', () => {
		const files: SourceFile[] = [
			{
				file: 'styles.scss',
				source: `
					div {
						color: red;
					}
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		expect(aliases.size).toBe(0);
		expect(definitionFiles.size).toBe(0);
	});
});

describe('collectUsedVariables', () => {
	it('collects used css variables', () => {
		const files: SourceFile[] = [
			{
				file: 'tokens.scss',
				source: `
					$foo: var(--foo);
					$bar: var(--bar);
				`
			},
			{
				file: 'component.scss',
				source: `
					div {
						color: $foo;
					}
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		const used = collectUsedVariables(files, aliases, definitionFiles);

		expect(used.has('--foo')).toBe(true);
		expect(used.has('--bar')).toBe(false);
	});

	it('collects direct css variable usages', () => {
		const files: SourceFile[] = [
			{
				file: 'variables.scss',
				source: `
					$foo: var(--foo);
				`
			},
			{
				file: 'component.scss',
				source: `
					.box {
						width: var(--bar);
					}
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		const used = collectUsedVariables(files, aliases, definitionFiles);

		expect(used.has('--bar')).toBe(true);
		expect(used.has('--foo')).toBe(false);
	});

	it('does not scan alias definition files', () => {
		const files: SourceFile[] = [
			{
				file: 'tokens.scss',
				source: `
					$foo: var(--foo);
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		const used = collectUsedVariables(files, aliases, definitionFiles);

		expect(used.size).toBe(0);
	});

	it('deduplicates variables', () => {
		const files: SourceFile[] = [
			{
				file: 'tokens.scss',
				source: `
					$foo: var(--foo);
				`
			},
			{
				file: 'component.scss',
				source: `
					color: $foo;
					background: $foo;
				`
			}
		];

		const { aliases, definitionFiles } = buildAliasMap(files);

		const used = collectUsedVariables(files, aliases, definitionFiles);

		expect(used.size).toBe(1);
		expect(used.has('--foo')).toBe(true);
	});
});
