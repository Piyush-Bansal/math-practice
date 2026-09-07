export function useLoop(index: number, length: number) {
	return ((index % length) + length) % length;
}
