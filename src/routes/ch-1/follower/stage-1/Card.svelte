<script lang="ts">
	import { CardState } from './state/card.state.svelte';
	import { getGlobalState } from './state/global.state.svelte';

	const { index } = $props();

	const globalState = getGlobalState();

	$effect(() => {
		globalState.indexArr[index] = index;
	});

	const localState = new CardState(globalState, () => index);
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
