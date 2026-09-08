import { usePointer, useSelection } from '$lib/interactions';
import { getContext, setContext } from 'svelte';

class GlobalState {
	pointer = usePointer();
	indexArr: number[] = [];
	selection = $derived(useSelection(() => this.indexArr));
}

const key = Symbol('GLOBAL_STATE');
export const setGlobalState = () => setContext(key, new GlobalState());
export const getGlobalState = () => getContext<GlobalState>(key);

export default GlobalState;
