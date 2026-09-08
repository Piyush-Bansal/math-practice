import { dotProduct, useBounds, useClamp } from '$lib/interactions';
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
			dotProduct(
				[this._displacement.x, this._displacement.y],
				[this.globalState.axis.x, this.globalState.axis.y]
			)
	);

	readonly movement = $derived.by(() => {
		if (!this._dotProduct || !this._bounds?.rect) return;
		const halfWidth = this._bounds?.rect.width / 2;
		return useLinearInterpolate(
			-50,
			50,
			-halfWidth,
			halfWidth,
			useClamp(this._dotProduct, -halfWidth, halfWidth)
		);
	});

	constructor(private readonly globalState: GlobalState) {
		$effect(() => {
			$inspect(this.movement);
		});
	}
}
