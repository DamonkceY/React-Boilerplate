import React, { useState } from 'react';
import './entryPoint.scss';
import { useAppDispatch } from '../../core/store/hooks';
import { setDeviceWidth } from '../../core/store/modules/rootSlice';
import { unTrackDeviceWidth, trackDeviceWidth } from '../../utils/trackDeviceWidth';
import LoadingIndicator from '../shared/loadingIndicator/loadingIndicator';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import routes from '../../core/router/routes';
import { routesRenderer } from '../../core/router/routesRenderer';
import { PATHS } from '../../core/router/paths';

const EntryPoint = () => {
	const dispatch = useAppDispatch();

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

	return (
		<div>
			<LoadingIndicator />
			<BrowserRouter>
				<Routes>
					{routesRenderer(routes)}
					<Route path={'*'} element={<Navigate to={PATHS.FALLBACK} />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default EntryPoint;
