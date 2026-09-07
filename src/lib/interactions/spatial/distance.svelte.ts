import type { usePointer } from '../signals/pointer.svelte';
import type { useBounds } from './bounds.svelte';

type Pointer = ReturnType<typeof usePointer>;
type Bounds = ReturnType<typeof useBounds>;

export function useDistance(pointer: Pointer, bounds: Bounds) {
	const center = $derived({
		x: bounds.rect.left + bounds.rect.width / 2,
		y: bounds.rect.top + bounds.rect.height / 2
	});

	const x = $derived(pointer.x - center.x);

	const y = $derived(pointer.y - center.y);

	const value = $derived(Math.hypot(x, y));

	return {
		get x() {
			return x;
		},

		get y() {
			return y;
		},

		get value() {
			return value;
		}
	};
}
