import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

class Pointer {
	#subscriber;

	#positions = $state({
		x: 0,
		y: 0
	});

	constructor() {
		this.#subscriber = createSubscriber((update) => {
			const off = on(window, 'pointermove', (e) => {
				this.#positions.x = e.clientX;
				this.#positions.y = e.clientY;
			});
			return () => off();
		});
	}

	get x() {
		this.#subscriber();
		return this.#positions.x;
	}

	get y() {
		this.#subscriber();
		return this.#positions.y;
	}
}

const pointer = new Pointer();

export const usePointer = () => pointer;
