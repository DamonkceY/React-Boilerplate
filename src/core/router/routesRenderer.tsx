import React, {useEffect} from 'react';
import {Navigate, Route, useLocation} from 'react-router-dom';
import {RoutesType} from '../entities/routes.entity';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectConnectedUser, setConnectedUser} from '../store/modules/authSlice';
import {PATHS} from './paths';
import {TOKEN_KEY} from '../../utils/localStorageKeys';
import {getConnectedUser} from '../services/modulesServices/auth.service';
import {selectDeviceWidth} from '../store/modules/rootSlice';
import {MOBILE_BREAKPOINT, TABLET_BREAKPOINT} from '../../utils/deviceBreakPoints';

export const routesRenderer = (routesList: Array<RoutesType>) => {
	return (
		routesList.map((_: RoutesType, _index: number) => (
			<Route
				key={_index}
				path={_.path}
				element={<RouteMiddleware _={_}/>}
			>
				{
					_.children && routesRenderer(_.children)
				}
				{
					(_?.fallback && _.children && _.children.length > 0) && <>
						<Route path={_.path} element={<Navigate to={_.fallback}/>}/>
						<Route path={'*'} element={<Navigate to={_.fallback}/>}/>
					</>
				}
			</Route>
		))
	);
};

type Props = {
  _: RoutesType
}
const RouteMiddleware = ({_}: Props) => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const connectedUser = useAppSelector(selectConnectedUser);
	const width = useAppSelector(selectDeviceWidth);
	const token = localStorage.getItem(TOKEN_KEY);

	const [passport, setPassport] = React.useState({
		requestIsFinished: false,
		userIsConnected: false,
	});

	useEffect(() => {
		if (_.isPrivate) {
			if (!!connectedUser && !!token) {
				setPassport({
					requestIsFinished: true,
					userIsConnected: true
				});
			} else if (!connectedUser && !!token) {
				getConnectedUser().then(() => {
					// JUST AN EXAMPLE
					dispatch(setConnectedUser({
						// TODO Change this to corresponding res data
						firstName: 'Med',
						lastName: 'Chouiref',
						nickname: 'JS-GOD'
					}));
					//
					setPassport({
						requestIsFinished: true,
						userIsConnected: true
					});
				}).catch(() => {
					setPassport({
						requestIsFinished: true,
						userIsConnected: false
					});
				});
			} else if (!token) {
				setPassport({
					requestIsFinished: true,
					userIsConnected: false
				});
			}
		}
	}, [location]);

	const checkWidth = () => {
		let condition: boolean;
		switch (_.displayType) {
		case 'MOBILE':
			condition = width <= MOBILE_BREAKPOINT;
			break;
		case 'TABLET':
			condition = width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT;
			break;
		case 'DESKTOP':
			condition = width > TABLET_BREAKPOINT;
			break;
		case 'ALL':
		default:
			condition = true;
		}

		return condition;
	};

	const getElement = () => {
		return checkWidth() ? (
			<React.Suspense>
				{React.createElement(_.component)}
			</React.Suspense>
		) : escapeRoute();
	};

	const escapeRoute = () => {
		return <Navigate to={_.fallback ? _.fallback : PATHS.FALLBACK}/>;
	};

	return (
		<div>
			{
				!_.isPrivate ? (
					getElement()
				) :
					passport.requestIsFinished && (
						<div>
							{
								passport.userIsConnected ? (
									getElement()
								) : (
									escapeRoute()
								)
							}
						</div>
					)
			}
		</div>
	);
};