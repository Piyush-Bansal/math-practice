import { useBounds, useDistance } from '$lib/interactions';
import type GlobalState from './global.state.svelte';

export class CardState {
	card = $state<HTMLDivElement>();
	readonly bounds = $derived(this.card && useBounds(this.card));

	readonly distance = $derived.by(() => {
		if (!this.bounds) return;
		return useDistance(this.globalState.pointer, this.bounds);
	});

	private _index = $state<number>();

	constructor(
		private readonly globalState: GlobalState,
		index: () => number
	) {
		this._index = index();

		$effect(() => {
			if (!this.distance || !this.bounds || !this._index) return;
			if (this.distance?.value < 150) {
				globalState.selection.select(this._index);
				console.log(globalState.selection.current);
			} else {
				globalState.selection.clear();
				console.log(globalState.selection.current);
			}
		});
	}
}
