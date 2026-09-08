import type { CardState } from '../state';
import gsap from 'gsap';

class CardBehaviour {
	private _cardState;

	constructor(cardState: CardState) {
		this._cardState = cardState;

		$effect(() => {
			if (!cardState.movement || !this.yTo) return;
			this.yTo(cardState.movement);
		});
	}

	yTo = $derived.by(
		() =>
			this._cardState.card &&
			gsap.quickTo(this._cardState.card, 'y', { duration: 0.2, ease: 'power2.out' })
	);
}

export default CardBehaviour;
