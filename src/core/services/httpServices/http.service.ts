import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_KEY } from '../../../utils/localStorageKeys';
import { BASE_URL, TEST_UPDATE_TOKEN } from '../endpoints';
import { store } from '../../store';
import { setRootLoading } from '../../store/modules/rootSlice';
import { ExecutorInterface, QueueItem } from '../../entities/http.entity';

class HttpService {
	private static instance: HttpService;
	private static interceptor: AxiosInstance;
	private static requestsQueue: Array<QueueItem> = [];
	private static isRefreshingToken = false;
	private static Status = {
		success: 200,
		badRequestError: 400,
		notAuthorizedError: 401,
		refreshTokenError: 403,
		serverError: 500,
	};

	private constructor() {
		HttpService.interceptor = axios.create({
			timeout: 20000,
		});
		this.setupInterceptorRequest();
	}

	private setupInterceptorRequest(newToken?: string): void {
		const token = newToken || localStorage.getItem(TOKEN_KEY);
		HttpService.interceptor.interceptors.request.use((config) => {
			(config.headers as Record<string, any>).common = {
				Authorization: token ? `Bearer ${token}` : '',
				'Content-Type': 'application/json',
			};
			return config;
		});
	}

	public static getInstance(): HttpService {
		if (!HttpService.instance) {
			HttpService.instance = new HttpService();
		}
		return HttpService.instance;
	}

	public executeRequest(config: ExecutorInterface): Promise<any> {
		return new Promise((resolve, reject) => {
			if (HttpService.isRefreshingToken) {
				HttpService.requestsQueue.push({
					config,
					resolve,
					reject,
				});
			} else {
				store.dispatch(setRootLoading(true));
				HttpService.interceptor({
					url: config.endPoint,
					method: config.method,
					data: config.data,
					params: config.params,
				})
					.then((res: AxiosResponse) => {
						switch (res.status) {
							case HttpService.Status.badRequestError:
								// TODO Logic for Form validation error, it can be in here or down on catch.
								resolve(res);
								break;
							case HttpService.Status.success:
							default:
								store.dispatch(setRootLoading(false));
								resolve(res);
								break;
						}
					})
					.catch((err: AxiosError) => {
						store.dispatch(setRootLoading(false));
						switch (err.response?.status) {
							case HttpService.Status.refreshTokenError:
								if (!HttpService.isRefreshingToken) {
									HttpService.isRefreshingToken = true;
									HttpService.requestsQueue.push({
										config,
										resolve,
										reject,
									});
									store.dispatch(setRootLoading(true));
									this.refreshMyToken()
										.then((res: AxiosResponse) => {
											store.dispatch(setRootLoading(false));
											HttpService.isRefreshingToken = false;
											localStorage.setItem(TOKEN_KEY, res.data.token);
											this.retryApiCalls();
										})
										.catch((err: AxiosError) => {
											store.dispatch(setRootLoading(false));
											HttpService.isRefreshingToken = false;
											this.abortAllRequests();
										});
								} else {
									HttpService.requestsQueue.push({
										config,
										resolve,
										reject,
									});
								}
								break;
							case HttpService.Status.notAuthorizedError:
								// TODO Handle logout logic
								break;
							case HttpService.Status.badRequestError:
								// TODO Logic for Form validation error, it can be in here or up on then.
								break;
							case HttpService.Status.serverError:
							default:
								reject(`Request failed with status: ${err.response?.status}`);
								this.clearQueue();
								break;
						}
					});
			}
		});
	}

	private refreshMyToken = (): Promise<any> => {
		return new Promise((resolve, reject) => {
			HttpService.interceptor({
				url: BASE_URL + TEST_UPDATE_TOKEN,
				method: 'get',
			})
				.then((res) => resolve(res))
				.catch((err) => reject(err));
		});
	};

	private clearQueue = (index?: number) => {
		if (typeof index === 'number') {
			HttpService.requestsQueue.splice(index, 1);
		} else {
			HttpService.requestsQueue.length = 0;
		}
	};

	private abortAllRequests = () => {
		HttpService.requestsQueue.forEach((item, index) => {
			item.reject('Request aborted due to un-updatable token');
			this.clearQueue(index);
		});
	};

	private retryApiCalls = () => {
		store.dispatch(setRootLoading(true));
		Promise.all(
			HttpService.requestsQueue.map((_) =>
				this.executeRequest(_.config)
					.then((res: AxiosResponse) => _.resolve(res.data))
					.catch((err: AxiosError) => _.reject(err)),
			),
		).then(() => {
			this.clearQueue();
			store.dispatch(setRootLoading(false));
		});
	};
}

export default HttpService;
