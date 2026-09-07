export type Point = {
	x: number;
	y: number;
};

export function createDistanceTrigger(threshold = 40) {
	let lastPosition: Point | null = null;

	return {
		check(position: Point, callback: (position: Point) => void) {
			if (lastPosition === null) {
				lastPosition = {
					x: position.x,
					y: position.y
				};

				return;
			}

			const distance = Math.hypot(
				position.x - lastPosition.x,
				position.y - lastPosition.y
			);

			if (distance < threshold) return;

			lastPosition = {
				x: position.x,
				y: position.y
			};

			callback(position);
		}
	};
}
