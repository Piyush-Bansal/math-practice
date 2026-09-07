import { onDestroy } from 'svelte';
import type { usePointer } from './pointer.svelte';
import type { useVelocity } from './velocity.svelte';
import { browser } from '$app/environment';

class UseDrag {
	#isDragging = $state(false);

	#startX = $state(0);
	#startY = $state(0);

	#lastX = $state(0);
	#lastY = $state(0);

	#deltaX = $state(0);
	#deltaY = $state(0);

	#distanceX = $state(0);
	#distanceY = $state(0);

	constructor(
		private readonly _pointer: ReturnType<typeof usePointer>,
		private readonly _velocity: ReturnType<typeof useVelocity>
	) {
		onDestroy(() => {
			this.#end();
		});
	}

	start() {
		if (!browser) return;
		this.#isDragging = true;
		this.#startX = this.#lastX = this._pointer.x;
		this.#startY = this.#lastY = this._pointer.y;

		window.addEventListener('pointerup', this.#handlePointerUp);
		window.addEventListener('pointercancel', this.#handlePointerUp);
		window.addEventListener('pointermove', this.#handlePointerMove);
	}

	#handlePointerUp = () => {
		this.#end();
	};

	#handlePointerMove = () => {
		this.#deltaX = this._pointer.x - this.#lastX;
		this.#deltaY = this._pointer.y - this.#lastY;
		this.#lastX = this._pointer.x;
		this.#lastY = this._pointer.y;
		this.#distanceX = this._pointer.x - this.#startX;
		this.#distanceY = this._pointer.y - this.#startY;
	};

	cancel() {
		this.#end();
	}

	#end() {
		if (!browser) return;
		this.#isDragging = false;
		window.removeEventListener('pointerup', this.#handlePointerUp);
		window.removeEventListener('pointercancel', this.#handlePointerUp);
		window.removeEventListener('pointermove', this.#handlePointerMove);
	}

	get isDragging() {
		return this.#isDragging;
	}

	get deltaX() {
		return this.#deltaX;
	}

	get deltaY() {
		return this.#deltaY;
	}

	get distanceX() {
		return this.#distanceX;
	}

	get distanceY() {
		return this.#distanceY;
	}

	get velocityX() {
		return this._velocity.velocityX;
	}

	get velocityY() {
		return this._velocity.velocityY;
	}
}

export function useDrag(
	pointer: ReturnType<typeof usePointer>,
	velocity: ReturnType<typeof useVelocity>
) {
	return new UseDrag(pointer, velocity);
}
