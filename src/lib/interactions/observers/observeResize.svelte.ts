import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

class ResizeObserverBridge {
	#subscribe;

	constructor() {
		this.#subscribe = createSubscriber((update) => {
			const off = on(window, 'resize', update);
			return () => off();
		});
	}

	track() {
		this.#subscribe();
	}
}

export const observeResize = new ResizeObserverBridge();
