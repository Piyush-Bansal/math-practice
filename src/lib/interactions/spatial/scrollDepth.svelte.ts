import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import { useClamp } from '../resources/clampValues.svelte';

class WindowScrollDepth {
	#subscriber;
	#depth: number | undefined = undefined;

	constructor() {
		this.#subscriber = createSubscriber((update) => {
			const resizeOff = on(window, 'resize', () => {
				this.#calculateDepth();
				update();
			});
			const scrollOff = on(window, 'scroll', () => {
				this.#calculateDepth();
				update();
			});

			return () => {
				resizeOff();
				scrollOff();
			};
		});
	}

	#calculateDepth() {
		const scrollPosition = window.scrollY;
		const windowHeight = window.innerHeight;
		const totalScrollDepth = document.documentElement.scrollHeight;
		this.#depth = useClamp(scrollPosition / (totalScrollDepth - windowHeight), 0, 1);
	}

	get depth() {
		this.#subscriber();
		return this.#depth;
	}
}

const depth = new WindowScrollDepth();
export const useWindowScrollDepth = () => depth;
