<script lang="ts">
	import Card from './Card.svelte';
	import { setGlobalState } from './state/global.state.svelte';

	setGlobalState();
</script>

<div class="container | center">
	<div class="card-wrapper">
		{#each { length: 2 }, index}
			<Card {index} />
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
		gap: $size-7;
	}
</style>
