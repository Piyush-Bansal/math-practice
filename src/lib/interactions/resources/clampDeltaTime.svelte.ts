export function clampDeltaTime(deltaTime: number, minFps = 30) {
	return Math.min(deltaTime / 1_000, 1 / minFps);
}
