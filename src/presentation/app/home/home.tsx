import React from 'react';
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../core/router/paths';

const Home = () => {
	const navigate = useNavigate();

	return (
		<div>
			Home
			<button onClick={() => navigate(PATHS.EXAMPLE1)}>to example 1</button>
			<button onClick={() => navigate(PATHS.EXAMPLE2)}>to example 2</button>
			<button onClick={() => navigate(PATHS.EXAMPLE3.INDEX + PATHS.EXAMPLE3.NESTED1)}>
				to child 1
			</button>
			<button onClick={() => navigate(PATHS.EXAMPLE3.INDEX + PATHS.EXAMPLE3.NESTED2)}>
				to child 2
			</button>
		</div>
	);
};

export default Home;
