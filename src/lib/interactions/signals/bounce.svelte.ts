import { Spring } from 'svelte/motion';

function getSpringConstants(
	bounce: number,
	duration: number,
	initialValue: unknown,
	mass = 1.0
) {
	// 1. Clamp bounce to a safe range to prevent infinite explosion or negative damping
	let b = Math.min(0.99, Math.max(0.0, bounce));

	// 2. Map bounce to damping ratio
	let dampingRatio = 1.0 - b;

	// 3. Compute angular frequency based on desired duration
	let naturalFrequency = 6.9 / (dampingRatio * duration);

	// 4. Solve for physical properties
	let stiffness = mass * Math.pow(naturalFrequency, 2);
	let damping = 2.0 * mass * dampingRatio * naturalFrequency;

	return new Spring(initialValue, {
		stiffness: stiffness,
		damping: damping
	});
}
