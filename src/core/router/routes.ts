import React from 'react';
import {RoutesType} from '../entities/routes.entity';
import {PATHS} from './paths';

const Home = React.lazy(() => import('../../presentation/app/home/home'));
const Example1 = React.lazy(() => import('../../presentation/app/example-1/example1'));
const Example2 = React.lazy(() => import('../../presentation/app/example-2/example2'));
const Example3 = React.lazy(() => import('../../presentation/app/example-3/example3'));
const Child1 = React.lazy(() => import('../../presentation/app/example-3/children/child1/child1'));
const Child2 = React.lazy(() => import('../../presentation/app/example-3/children/child2/child2'));

const RoutePaths: Array<RoutesType> = [
	{
		path: PATHS.HOME.INDEX,
		component: Home,
		displayType: 'ALL',
		isPrivate: false,
	},
	{
		path: PATHS.EXAMPLE1,
		component: Example1,
		displayType: 'ALL',
		isPrivate: false,
	},
	{
		path: PATHS.EXAMPLE2,
		component: Example2,
		displayType: 'ALL',
		isPrivate: false,
	},
	{
		path: PATHS.EXAMPLE3.INDEX,
		component: Example3,
		displayType: 'ALL',
		isPrivate: false,
		fallback: PATHS.EXAMPLE3.NESTED1,
		children: [
			{
				path: PATHS.EXAMPLE3.NESTED1,
				component: Child1,
				displayType: 'ALL',
				isPrivate: false,
			},
			{
				path: PATHS.EXAMPLE3.NESTED2,
				component: Child2,
				displayType: 'ALL',
				isPrivate: false,
			},
		],
	},
];

export default RoutePaths;