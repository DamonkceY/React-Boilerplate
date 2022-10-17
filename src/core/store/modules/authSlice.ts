import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../';
import { AuthSliceStateEntity, UserEntity } from '../../entities/auth/authSlice.entity';

const initialState: AuthSliceStateEntity = {
	connectedUser: undefined,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setConnectedUser: (state, action: PayloadAction<UserEntity | undefined>) => {
			state.connectedUser = action.payload;
		},
	},
});

export const { setConnectedUser } = authSlice.actions;

export const selectConnectedUser = (state: RootState) => state.auth.connectedUser;

export default authSlice.reducer;
