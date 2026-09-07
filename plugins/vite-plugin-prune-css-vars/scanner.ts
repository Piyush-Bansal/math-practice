import fg from 'fast-glob';
import fs from 'node:fs/promises';

export interface SourceFile {
	file: string;
	source: string;
}

const DEFAULT_INCLUDE = ['src/**/*.{scss,sass,svelte}'];

const DEFAULT_EXCLUDE = ['node_modules/**', '.svelte-kit/**', 'dist/**'];

export async function scanFiles(
	include: ReadonlyArray<string> = DEFAULT_INCLUDE,
	exclude: ReadonlyArray<string> = DEFAULT_EXCLUDE
): Promise<SourceFile[]> {
	const files = await fg([...include], {
		ignore: [...exclude],
		absolute: true,
		onlyFiles: true
	});

	return Promise.all(
		files.map(async (file) => ({
			file,
			source: await fs.readFile(file, 'utf8')
		}))
	);
}
