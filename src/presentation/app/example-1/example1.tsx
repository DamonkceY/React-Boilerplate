import React from 'react';
import './example1.scss';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../core/router/paths';

const Example1 = () => {
	const navigate = useNavigate();
	return (
		<div>
			example 1<button onClick={() => navigate(PATHS.EXAMPLE2)}>to example 2</button>
			<button onClick={() => navigate(PATHS.EXAMPLE3.INDEX + PATHS.EXAMPLE3.NESTED1)}>
				to child 1
			</button>
			<button onClick={() => navigate(PATHS.EXAMPLE3.INDEX + PATHS.EXAMPLE3.NESTED2)}>
				to child 2
			</button>
		</div>
	);
};

export default Example1;
