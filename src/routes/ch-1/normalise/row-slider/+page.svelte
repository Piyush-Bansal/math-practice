<script lang="ts">
	import { observeResize } from '$lib/interactions';
	import useLinearInterpolate from '$lib/interactions/resources/linearInterpolate.svelte';
	import { useWindowScrollDepth } from '$lib/interactions/spatial/scrollDepth.svelte';

	let cardWrapperWidth = $state<number>();

	const windowDepth = $derived(useWindowScrollDepth().depth);

	const amountToMove = $derived.by(() => {
		if (!cardWrapperWidth) return;
		observeResize.track();
		return cardWrapperWidth - window.innerWidth;
	});

	const movement = $derived.by(() => {
		if (!amountToMove || !windowDepth) return 0;
		return useLinearInterpolate(0, amountToMove, 0, 1, windowDepth) * -1;
	});

	$effect(() => {
		$inspect(movement);
	});
</script>

<div class="parent">
	<div class="overflow-hidden">
		<div
			class="card-wrapper"
			bind:offsetWidth={cardWrapperWidth}
			style:transform={`translateX(${movement})px`}
		>
			{#each { length: 7 }}
				<div class="card | ar-16-9"></div>
			{/each}
		</div>
	</div>
</div>

<style>
	.parent {
		height: 200vh;
	}

	.card-wrapper {
		display: flex;
		flex-direction: row;
		gap: 16px;
		width: fit-content;
		position: fixed;

		.card {
			background-color: antiquewhite;
			width: 500px;
		}
	}
</style>
