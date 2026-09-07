import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

export class Bounds {
	#subscriber;
	#rafID: null | number = null;

	#dimensions = $state({ width: 0, height: 0, top: 0, left: 0 });

	constructor(private readonly element: HTMLElement) {
		this.#measure(this.element);

		this.#subscriber = createSubscriber(() => {
			const removeScroll = on(window, 'scroll', () => this.#onScroll(), {
				passive: true
			});
			const removeResize = on(window, 'resize', () =>
				this.#measure(this.element)
			);

			return () => {
				removeScroll();
				removeResize();
			};
		});
	}

	#onScroll() {
		if (this.#rafID !== null) return;

		this.#rafID = requestAnimationFrame(() => {
			this.#rafID = null;
			this.#measure(this.element);
		});
	}

	#measure(node: HTMLElement) {
		const measurements = node.getBoundingClientRect();
		this.#dimensions.width = measurements.width;
		this.#dimensions.height = measurements.height;
		this.#dimensions.top = measurements.top;
		this.#dimensions.left = measurements.left;
	}

	get rect() {
		this.#subscriber();
		return this.#dimensions;
	}
}

export function useBounds(node: HTMLElement) {
	return new Bounds(node);
}
