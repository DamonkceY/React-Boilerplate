import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './modules/rootSlice';
import authReducer from './modules/authSlice';

export const store = configureStore({
	reducer: {
		// Inject the other modules as below
		root: rootReducer,
		auth: authReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;