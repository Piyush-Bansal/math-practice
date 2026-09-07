import { useNormalise } from './normalise.svelte';

type LinearInterpolate = (
	minOutput: number,
	maxOutput: number,
	inputMin: number,
	inputMax: number,
	value: number
) => number;

const useLinearInterpolate: LinearInterpolate = function (
	minOutput,
	maxOutput,
	inputMin,
	inputMax,
	value
) {
	if (inputMin != 0 && inputMax != 1) {
		const normalisedInput = useNormalise(value, inputMax, inputMin);
		return minOutput + normalisedInput * (maxOutput - minOutput);
	} else {
		return minOutput + value * (maxOutput - minOutput);
	}
};

export default useLinearInterpolate;
