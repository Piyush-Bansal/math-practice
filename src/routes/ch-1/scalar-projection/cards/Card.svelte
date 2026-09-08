<script lang="ts">
	import CardBehaviour from './behaviour/card.behaviour.svelte';
	import { CardState, getGlobalState } from './state';

	const globalState = getGlobalState();
	const localState = new CardState(globalState);
	new CardBehaviour(localState);
</script>

<div class="card | ar-2-3" bind:this={localState.card}></div>

<style lang="scss">
	@use '$tokens' as *;
	.card {
		width: $size-7;
		background-color: $clr-sur-action-1;
		border-radius: $br-soft;
		will-change: translate;
	}
</style>
