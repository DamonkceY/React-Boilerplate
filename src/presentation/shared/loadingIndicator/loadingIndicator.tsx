import React from 'react';
import { useAppSelector } from '../../../core/store/hooks';
import { selectRootLoading } from '../../../core/store/modules/rootSlice';
import './loadingIndicator.scss';

const LoadingIndicator = () => {
	return useAppSelector(selectRootLoading) ? (
		<div className={'rootLoaderMainContainer'}>
			<span>Loading...</span>
		</div>
	) : (
		<></>
	);
};

export default LoadingIndicator;
