import type { useDistance } from '../spatial/distance.svelte';

export function useProximity(
	distance: ReturnType<typeof useDistance>,
	{ radius = 300 }
) {
	let strength = $derived(1 - distance.value / radius);

	return {
		get strength() {
			return strength;
		}
	};
}
