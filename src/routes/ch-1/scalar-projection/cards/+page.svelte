<script lang="ts">
	import Card from './Card.svelte';
	import { setGlobalState } from './state';

	setGlobalState();
</script>

<div class="container | center">
	<div class="card-wrapper">
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
