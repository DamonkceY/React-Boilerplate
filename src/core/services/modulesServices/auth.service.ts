import HttpService from '../httpServices/http.service';
import { BASE_URL, TEST_GET_ME } from '../endpoints';

export const getConnectedUser = () => {
	return HttpService.getInstance().executeRequest({
		method: 'get',
		endPoint: BASE_URL + TEST_GET_ME,
	});
};
