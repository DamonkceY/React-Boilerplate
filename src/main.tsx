import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import EntryPoint from './presentation/entryPoint/entryPoint';
import { store } from './core/store';
import {Provider} from 'react-redux';
import './core/i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

	<Provider store={store}>
		<EntryPoint/>
	</Provider>
);
