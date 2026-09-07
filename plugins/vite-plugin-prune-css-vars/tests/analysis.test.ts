import { describe, expect, it } from 'vitest';

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { analyseProject } from '../analysis';

const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'prune-css-vars-'));

try {
	describe('analyseProject', () => {
		it('collects used css variables from a project', async () => {
			const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'prune-css-vars-'));

			await fs.writeFile(
				path.join(dir, 'variables.scss'),
				`
			:root {
				--foo: red;
				--bar: blue;
			}

			$foo: var(--foo);
			$bar: var(--bar);
			`
			);

			await fs.writeFile(
				path.join(dir, 'button.scss'),
				`
			@use './variables' as *;

			.button {
				color: $foo;
			}
			`
			);

			const result = await analyseProject({
				include: [path.posix.join(dir.replace(/\\/g, '/'), '**/*.scss')]
			});

			expect(result.used.has('--foo')).toBe(true);
			expect(result.used.has('--bar')).toBe(false);
			expect(result.duration).toBeGreaterThanOrEqual(0);

			await fs.rm(dir, {
				recursive: true,
				force: true
			});
		});
	});
} finally {
	await fs.rm(dir, {
		recursive: true,
		force: true
	});
}
