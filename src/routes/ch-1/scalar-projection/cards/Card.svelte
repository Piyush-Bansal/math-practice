<script lang="ts">
	import { CardState, getGlobalState } from './state';

	const globalState = getGlobalState();
	const localState = new CardState(globalState);
</script>

<div class="card | ar-2-3" bind:this={localState.card}></div>

<style lang="scss">
	@use '$tokens' as *;
	.card {
		width: $size-7;
		background-color: $clr-sur-action-1;
		border-radius: $br-soft;
	}
</style>
