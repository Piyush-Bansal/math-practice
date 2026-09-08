import { useBounds, useDistance } from '$lib/interactions';
import type GlobalState from './global.state.svelte';

export class CardState {
	card = $state<HTMLDivElement>();

	private readonly _bounds = $derived(this.card && useBounds(this.card));

	private readonly _direction = $derived.by(() => {
		if (!this._bounds) return;
		return useDistance(this.globalState.pointer, this._bounds);
	});

	constructor(private readonly globalState: GlobalState) {
		$effect(() => {
			$inspect(this._direction);
		});
	}
}
