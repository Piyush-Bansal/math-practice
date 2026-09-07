import { browser } from '$app/environment';

export type ImageData = {
	id: string | number;
	src: string;
};

export type LoadImagesResult = {
	loaded: ImageData[];
	failed: ImageData[];
};

type LoadImagesCallbacks = {
	onLoad?: (image: ImageData) => void;
	onError?: (image: ImageData) => void;
	onComplete?: () => void;
};

export function loadImages(
	images: ImageData[],
	{ onLoad, onError, onComplete }: LoadImagesCallbacks = {}
) {
	if (!browser) {
		onComplete?.();
		return;
	}

	if (images.length === 0) {
		onComplete?.();
		return;
	}

	let completed = 0;

	const finish = () => {
		completed++;

		if (completed === images.length) {
			onComplete?.();
		}
	};

	for (const image of images) {
		const img = new Image();

		img.onload = () => {
			onLoad?.(image);
			finish();
		};

		img.onerror = () => {
			onError?.(image);
			finish();
		};

		img.src = image.src;
	}
}
