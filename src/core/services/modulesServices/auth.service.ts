import SingletonInterceptor from '../httpServices/interceptor.service';
import { BASE_URL, TEST_GET_ME } from '../endpoints';

export const getConnectedUser = () => {
	return SingletonInterceptor.getInstance().executeRequest({
		method: 'get',
		endPoint: BASE_URL + TEST_GET_ME,
	});
};
