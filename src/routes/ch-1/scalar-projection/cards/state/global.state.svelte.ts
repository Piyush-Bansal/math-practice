import { useBounds, usePointer } from '$lib/interactions';
import { getContext, setContext } from 'svelte';

class GlobalState {
	readonly pointer = usePointer();

	readonly axis = { x: 1, y: 0 };
}

const key = Symbol('GLOBAL_STATE');
export const setGlobalState = () => setContext(key, new GlobalState());
export const getGlobalState = () => getContext<GlobalState>(key);

export default GlobalState;
