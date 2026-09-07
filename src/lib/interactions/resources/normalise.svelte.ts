export function useNormalise(value: number, max: number, min: number = 0) {
	return (value - min) / (max - min);
}
