type UseLerp = (
	startValue: number,
	targetValue: number,
	retention: number,
	deltaTime: number,
	totalDuration: number
) => number;

export const useLerp: UseLerp = function (
	startValue,
	targetValue,
	retention,
	deltaTime,
	totalDuration
) {
	const factor = 1 - retention ** (deltaTime / totalDuration);
	return startValue + (targetValue - startValue) * factor;
};
