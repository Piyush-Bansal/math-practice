import type { usePointer } from '../signals/pointer.svelte';

export function useVelocity(pointer: ReturnType<typeof usePointer>) {
	const previousPosition = { x: 0, y: 0, time: performance.now() };

	let dX = $state(0);
	let dY = $state(0);
	let dt = $state(0);

	$effect(() => {
		const deltaX = pointer.x - previousPosition.x;
		previousPosition.x = pointer.x;
		dX = deltaX;

		const deltaY = pointer.y - previousPosition.y;
		previousPosition.y = pointer.y;
		dY = deltaY;

		const now = performance.now();
		const timeDelta = Math.max(now - previousPosition.time, 1);
		previousPosition.time = now;
		dt = timeDelta;
	});

	const angleRadian = $derived(Math.atan2(dY, dX));
	const angleDegree = $derived(angleRadian * (180 / Math.PI));

	const velocityX = $derived(dX / dt);
	const velocityY = $derived(dY / dt);
	const speed = $derived(Math.hypot(velocityX, velocityY));

	return {
		get speed() {
			return speed;
		},
		get angleRadian() {
			return angleRadian;
		},
		get angleDegree() {
			return angleDegree;
		},
		get velocityX() {
			return velocityX;
		},
		get velocityY() {
			return velocityY;
		}
	};
}
