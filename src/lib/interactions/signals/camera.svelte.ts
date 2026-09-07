import { useBounds } from '../spatial/bounds.svelte';
import { useSpaces } from '../spatial/coordinate-space.svelte';
import type { usePointer } from './pointer.svelte';

export const useOrbitCamera = function (
	pointer: ReturnType<typeof usePointer>,
	wrapper: HTMLElement,
	translationStrength = 30,
	rotationStrength = 30
) {
	const bounds = $derived(useBounds(wrapper));
	const pointerRelativePosition = $derived(useSpaces(pointer, bounds).centred);

	return {
		get rotateX() {
			return pointerRelativePosition.y * rotationStrength;
		},
		get rotateY() {
			return pointerRelativePosition.x * rotationStrength * -1;
		},
		get translateX() {
			return pointerRelativePosition.x * translationStrength;
		},
		get translateY() {
			return pointerRelativePosition.y * translationStrength;
		}
	};
};
