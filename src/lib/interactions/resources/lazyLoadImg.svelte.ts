import {
	loadImages,
	useIntersection,
	type LoadImagesResult,
	type ImageData
} from '$lib/interactions';

export const lazyLoadImages = (
	imageSrc: () => ImageData[],
	parentNode: () => HTMLElement | undefined,
	options: IntersectionObserverInit = {
		rootMargin: '100px 0px 100px 0px'
	}
) => {
	const intersection = $derived(useIntersection(parentNode, options));

	const images = $state<LoadImagesResult>({
		loaded: [],
		failed: []
	});

	let running = false;
	let loadedFor: ImageData[] | null = null;

	function run() {
		const src = imageSrc();

		if (src.length === 0) return;
		if (running) return;
		if (loadedFor === src) return;
		if (!intersection?.isIntersecting) return;

		running = true;
		loadedFor = src;

		loadImages(src, {
			onLoad(image) {
				images.loaded.push(image);
			},

			onError(image) {
				images.failed.push(image);
			},

			onComplete() {
				running = false;
			}
		});
	}

	$effect.root(() => {
		$effect(() => {
			run();
		});
	});

	return images;
};
