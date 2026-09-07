import type { usePointer } from '../signals/pointer.svelte';
import type { useBounds } from './bounds.svelte';

export function useSpaces(
	pointer: ReturnType<typeof usePointer>,
	bound: ReturnType<typeof useBounds>
) {
	const rect = $derived(bound.rect);

	const local = $derived({
		x: pointer.x - rect.left,
		y: pointer.y - rect.top
	});

	const normalised = $derived({
		x: local.x / rect.width,
		y: local.y / rect.height
	});

	const centred = $derived({
		x: normalised.x * 2 - 1,
		y: normalised.y * 2 - 1
	});

	return {
		get local() {
			return local;
		},

		get normalised() {
			return normalised;
		},

		get centred() {
			return centred;
		}
	};
}
