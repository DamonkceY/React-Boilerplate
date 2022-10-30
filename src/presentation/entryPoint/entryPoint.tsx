import React from 'react';
import './entryPoint.scss';
import LoadingIndicator from '../shared/loadingIndicator/loadingIndicator';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import routes from '../../core/router/routes';
import { routesRenderer } from '../../core/router/routesRenderer';
import { PATHS } from '../../core/router/paths';
import useTrackDeviceWidth from '../../core/hooks/useTrackDeviceWidth';

const EntryPoint = () => {
	// Custom hook to track device width
	useTrackDeviceWidth();
	//

	return (
		<div>
			<LoadingIndicator />
			<BrowserRouter>
				<Routes>
					{/* This will take care of rendering your routes you just need to set up the routes.ts file */}
					{routesRenderer(routes)}
					{/*  */}
					<Route path={'*'} element={<Navigate to={PATHS.FALLBACK} />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default EntryPoint;
