<script lang="ts">
	import Card from './Card.svelte';
	import { getGlobalState, setGlobalState } from './state';

	setGlobalState();
	const globalState = getGlobalState();
</script>

<div class="container | center">
	<div class="card-wrapper" bind:this={globalState.cardWrapper}>
		{#each { length: 5 }}
			<Card />
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$tokens' as *;

	.container {
		height: 100vh;
	}
	.card-wrapper {
		display: flex;
		flex-direction: row;
		gap: $gutter;
	}
</style>
