import { useBounds, usePointer } from '$lib/interactions';
import { getContext, setContext } from 'svelte';

class GlobalState {
	readonly pointer = usePointer();
	cardWrapper = $state<HTMLDivElement>();
	readonly wrapperPosition = $derived(this.cardWrapper && useBounds(this.cardWrapper).rect);
}

const key = Symbol('GLOBAL_STATE');
export const setGlobalState = () => setContext(key, new GlobalState());
export const getGlobalState = () => getContext<GlobalState>(key);

export default GlobalState;
