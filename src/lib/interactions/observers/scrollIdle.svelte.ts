import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

export class ScrollIdle {
	#subscribe;
	#idle = $state(true);

	constructor(delay = 200) {
		this.#subscribe = createSubscriber((update) => {
			let timeout: ReturnType<typeof setTimeout>;

			const offScroll = on(window, 'scroll', () => {
				this.#idle = false;

				update();

				clearTimeout(timeout);
				timeout = setTimeout(() => {
					this.#idle = true;
					update();
				}, delay);
			});

			return () => {
				clearTimeout(timeout);
				offScroll();
			};
		});
	}

	get isIdle() {
		this.#subscribe();
		return this.#idle;
	}
}

export const scrollIdle = new ScrollIdle(200);
