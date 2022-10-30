import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { setDeviceWidth } from '../store/modules/rootSlice';

const useTrackDeviceWidth = () => {
	const dispatch = useAppDispatch();
	let evListenerCallback: (event: UIEvent) => void;

	const trackDeviceWidth = (callback: (width: number) => void) => {
		evListenerCallback = (event: UIEvent) => {
			callback((event.currentTarget as Window).innerWidth);
		};
		window.addEventListener('resize', evListenerCallback);
	};

	const unTrackDeviceWidth = () => {
		!!evListenerCallback && window.removeEventListener('resize', evListenerCallback);
	};

	React.useEffect(() => {
		// Trigger the listener
		trackDeviceWidth((width: number) => dispatch(setDeviceWidth(width)));
		//

		// Clean-up function
		return () => {
			unTrackDeviceWidth();
		};
		//
	}, []);
};

export default useTrackDeviceWidth;
