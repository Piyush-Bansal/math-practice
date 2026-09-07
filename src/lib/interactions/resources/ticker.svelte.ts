import gsap from 'gsap';
import { onMount } from 'svelte';

export function useTicker(callback: (deltaTime: number) => void) {
	let tick: (_time: number, deltaTime: number) => void;
	let isActive = $state(false);

	onMount(() => {
		tick = (_time: number, deltaTime: number) => {
			callback(deltaTime);
		};

		return () => {
			gsap.ticker.remove(tick);
			isActive = false;
		};
	});

	return {
		add() {
			gsap.ticker.add(tick);
			isActive = true;
		},
		remove() {
			gsap.ticker.remove(tick);
			isActive = false;
		},
		get isActive() {
			return isActive;
		}
	};
}
