import { useBounds, usePointer, useSpaces } from '$lib/interactions';

export const useLocalPointer = (node: HTMLElement) => {
	const pointer = usePointer();
	const bounds = $derived(useBounds(node));
	const localPointer = $derived(useSpaces(pointer, bounds).local);
	return {
		get local() {
			return localPointer;
		}
	};
};
