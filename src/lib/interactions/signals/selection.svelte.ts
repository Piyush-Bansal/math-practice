// useSelection.ts
import { browser } from '$app/environment';

export interface UseSelection<T> {
	readonly current: T | null;
	readonly previous: T | null;
	readonly currentIndex: number | null;
	readonly previousIndex: number | null;
	readonly direction: -1 | 0 | 1;

	select(value: T): void;
	clear(): void;
	next(): void;
	back(): void;
	loopNext(): void;
	loopBack(): void;
	first(): void;
	last(): void;
	isSelected(value: T): boolean;
}

export function useSelection<T>(getSelection: () => T[]): UseSelection<T> {
	if (!browser) {
		return {
			get current() {
				return null;
			},

			get previous() {
				return null;
			},

			get currentIndex() {
				return null;
			},

			get previousIndex() {
				return null;
			},

			get direction(): -1 | 0 | 1 {
				return 0;
			},

			select() {},
			clear() {},
			next() {},
			back() {},
			loopNext() {},
			loopBack() {},
			first() {},
			last() {},

			isSelected() {
				return false;
			}
		};
	}

	const items = $derived(getSelection());

	let currentIndex = $state<number | null>(null);
	let previousIndex = $state<number | null>(null);

	const current = $derived(currentIndex === null ? null : items[currentIndex]);

	const previous = $derived(
		previousIndex === null ? null : items[previousIndex]
	);

	return {
		get current() {
			return current;
		},

		get previous() {
			return previous;
		},

		get currentIndex() {
			return currentIndex;
		},

		get previousIndex() {
			return previousIndex;
		},

		get direction(): -1 | 0 | 1 {
			if (currentIndex === null || previousIndex === null) {
				return 0;
			}

			return currentIndex > previousIndex ? 1 : -1;
		},

		select(value: T) {
			const index = items.indexOf(value);

			if (index === -1) return;

			previousIndex = currentIndex;
			currentIndex = index;
		},

		clear() {
			currentIndex = null;
			previousIndex = null;
		},

		next() {
			if (currentIndex === null || currentIndex >= items.length - 1) {
				return;
			}

			previousIndex = currentIndex;
			currentIndex += 1;
		},

		back() {
			if (currentIndex === null || currentIndex <= 0) {
				return;
			}

			previousIndex = currentIndex;
			currentIndex -= 1;
		},

		loopNext() {
			if (items.length === 0 || currentIndex === null) return;

			previousIndex = currentIndex;
			currentIndex = (currentIndex + 1) % items.length;
		},

		loopBack() {
			if (items.length === 0 || currentIndex === null) return;

			previousIndex = currentIndex;
			currentIndex = (currentIndex - 1 + items.length) % items.length;
		},

		first() {
			if (items.length === 0) return;

			previousIndex = currentIndex;
			currentIndex = 0;
		},

		last() {
			if (items.length === 0) return;

			previousIndex = currentIndex;
			currentIndex = items.length - 1;
		},

		isSelected(value: T) {
			return current === value;
		}
	};
}
