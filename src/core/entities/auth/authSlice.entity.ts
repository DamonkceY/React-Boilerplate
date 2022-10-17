export type UserEntity = {
	firstName: string;
	lastName: string;
	nickname: string;
};

export type AuthSliceStateEntity = {
	// TODO To be changed
	connectedUser?: UserEntity;
};
