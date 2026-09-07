<script lang="ts">
	import useLinearInterpolate from '$lib/interactions/resources/linearInterpolate.svelte';

	let sliderValue = $state(50);
	let rotation = $derived(useLinearInterpolate(-20, 20, 0, 100, sliderValue));
</script>

<div class="container | center">
	<div class="square | ar-1-1" style:transform={`rotate(${rotation}deg)`}></div>
	<input type="range" min="0" max="100" step="1" bind:value={sliderValue} />
</div>

<style lang="scss">
	@use '$tokens' as *;
	.container {
		height: 100vh;

		.square {
			height: $comp-size-xl;
			background-color: $clr-sur-action-1;
		}
	}
</style>
