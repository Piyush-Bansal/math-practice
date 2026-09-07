import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';
import {
	artBoardLarge,
	artBoardMedium,
	artBoardSmall,
	ssLargeHigh,
	ssLargeLow,
	ssMediumLow,
	ssSmallLow
} from '../../../global-state/screenSize.svelte';
import { browser } from '$app/environment';
import { useClamp } from '../resources/clampValues.svelte';

interface Size {
	lg: number;
	md: number;
	sm: number;
}

class FluidSize {
	#subscribe;
	#innerWidth: number | null = null;
	#screenSize: 'lg' | 'md' | 'sm' | null = null;
	#fluidSize: number | null = null;

	constructor(private readonly size: Size) {
		this.#currentBreakPoint();
		this.#calculateSize();

		this.#subscribe = createSubscriber((update) => {
			const off = on(window, 'resize', () => {
				this.#currentBreakPoint();
				this.#calculateSize();
				update();
			});
			return () => off();
		});
	}

	#currentBreakPoint() {
		if (!browser) {
			this.#innerWidth = 0;
			return;
		}
		this.#innerWidth = useClamp(window.innerWidth, ssSmallLow, ssLargeHigh);
		this.#innerWidth >= ssLargeLow
			? (this.#screenSize = 'lg')
			: this.#innerWidth >= ssMediumLow
				? (this.#screenSize = 'md')
				: (this.#screenSize = 'sm');
	}

	#calculateSize() {
		if (!this.#innerWidth) return;
		switch (this.#screenSize) {
			case 'lg': {
				this.#fluidSize = (this.size.lg / artBoardLarge) * this.#innerWidth;
				break;
			}
			case 'md': {
				this.#fluidSize = (this.size.md / artBoardMedium) * this.#innerWidth;
				break;
			}
			case 'sm': {
				this.#fluidSize = (this.size.sm / artBoardSmall) * this.#innerWidth;
				break;
			}
		}
	}

	get value() {
		this.#subscribe();
		return this.#fluidSize;
	}
}

export function useFluidSize(size: Size) {
	return new FluidSize(size);
}
