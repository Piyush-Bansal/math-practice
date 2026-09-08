<script lang="ts">
	import { useClamp, usePointer } from '$lib/interactions';

	const pointer = usePointer();
	let btn = $state<HTMLDivElement>();

	const btnDimensions = $derived.by(() => {
		if (!btn)
			return {
				left: 0,
				top: 0
			};
		const left = btn.getBoundingClientRect().left;
		const top = btn.getBoundingClientRect().top;
		const height = btn.offsetHeight;
		const width = btn.offsetWidth;
		return {
			left: left + width / 2,
			top: top + height / 2
		};
	});

	const displacement = $derived.by(() => {
		const x = pointer.x - btnDimensions.left;
		const y = pointer.y - btnDimensions.top;

		return {
			x,
			y,
			value: Math.hypot(x, y)
		};
	});

	// const direction = $derived.by(() => {
	// 	const magnitude = Math.hypot(displacement.x, displacement.y);
	// 	if (magnitude > 0) {
	// 		return {
	// 			x: displacement.x / magnitude,
	// 			y: displacement.y / magnitude
	// 		};
	// 	} else {
	// 		return {
	// 			x: 0,
	// 			y: 0
	// 		};
	// 	}
	// });

	const strength = $derived(useClamp(1 - displacement.value / 200, 0, 1));

	const movement = $derived.by(() => {
		const x = strength < 0.1 ? 0 : useClamp(strength * displacement.x, -40, 40);
		const y = strength < 0.1 ? 0 : useClamp(strength * displacement.y, -40, 40);
		return { x, y };
	});

	$effect(() => {
		$inspect(movement);
	});
</script>

<div class="container | center">
	<div
		class="btn"
		bind:this={btn}
		style={`transform: translate(${movement.x}px, ${movement.y}px);`}
	></div>
</div>

<style lang="scss">
	@use '$tokens' as *;

	.container {
		height: 100vh;

		.btn {
			height: $size-5;
			aspect-ratio: 1/1;
			background-color: $clr-sur-action-1;
			border-radius: $br-full;
			cursor: pointer;
			transition: transform 0.6 ease-out;
		}
	}
</style>
