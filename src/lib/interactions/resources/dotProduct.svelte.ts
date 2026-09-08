export const dotProduct = (a: number[], b: number[]): number => {
	if (a.length !== b.length) {
		throw new Error('Vectors must have the same length');
	}

	let result = 0;

	for (let i = 0; i < a.length; i++) {
		result += a[i] * b[i];
	}

	return result;
};
