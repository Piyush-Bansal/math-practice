type UseDecay = (
	value: number,
	duration: number,
	deltaTime: number,
	decayRate?: number
) => number;

export const useDecay: UseDecay = function (
	value,
	duration,
	deltaTime,
	decayRate = 0.01
) {
	if (value === 0) return 0;

	const factor = decayRate ** (deltaTime / duration);
	const result = value * factor;

	return Math.abs(result) < 0.1 ? 0 : result;
};
