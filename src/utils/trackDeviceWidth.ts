let evListenerCallback: (event: UIEvent) => void;

export const trackDeviceWidth = (callback: (width: number) => void) => {
	evListenerCallback = (event: UIEvent) => {
		callback((event.currentTarget as Window).innerWidth);
	};
	window.addEventListener('resize', evListenerCallback);
};

export const unTrackDeviceWidth = () => {
	!!evListenerCallback && window.removeEventListener('resize', evListenerCallback);
};