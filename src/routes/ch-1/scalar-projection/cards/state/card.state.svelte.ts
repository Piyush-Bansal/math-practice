import { useBounds, useDistance } from '$lib/interactions';
import type GlobalState from './global.state.svelte';

export class CardState {
	card = $state<HTMLDivElement>();

	private readonly _bounds = $derived(this.card && useBounds(this.card));

	private readonly _displacement = $derived.by(() => {
		if (!this._bounds) return;
		const x = this._bounds.rect.left + this._bounds.rect.width / 2 - this.globalState.pointer.x;
		const y = this._bounds.rect.top + this._bounds.rect.height / 2 - this.globalState.pointer.y;
		return { x, y };
	});

	constructor(private readonly globalState: GlobalState) {
		$effect(() => {
			$inspect(this._displacement);
		});
	}
}
