import { useBounds, useClamp } from '$lib/interactions';
import useLinearInterpolate from '$lib/interactions/resources/linearInterpolate.svelte';
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

	private readonly _dotProduct = $derived.by(
		() =>
			this._displacement &&
			this._displacement?.x * this.globalState.axis.x +
				this._displacement.y * this.globalState.axis.y
	);

	readonly movement = $derived(
		this._dotProduct &&
			useLinearInterpolate(-50, 50, -300, 300, useClamp(this._dotProduct, -300, 300))
	);

	constructor(private readonly globalState: GlobalState) {
		$effect(() => {
			$inspect(this.movement);
		});
	}
}
