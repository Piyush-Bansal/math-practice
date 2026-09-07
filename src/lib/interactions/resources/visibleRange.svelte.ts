export function useVisibleRange(
	position: number,
	itemStride: number,
	viewportSize: number,
	overScan = 0
) {
	const first = $derived(
		Math.floor(-(position + itemStride * overScan) / itemStride)
	);

	const last = $derived(
		Math.ceil((-position + viewportSize + itemStride * overScan) / itemStride) -
			1
	);

	return {
		get first() {
			return first;
		},
		get last() {
			return last;
		}
	};
}
