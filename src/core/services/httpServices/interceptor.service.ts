import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { TOKEN_KEY } from '../../../utils/localStorageKeys';
import { BASE_URL, TEST_UPDATE_TOKEN } from '../endpoints';
import { store } from '../../store';
import { setRootLoading } from '../../store/modules/rootSlice';
import { ExecutorInterface, QueueItem } from '../../entities/interceptor.entity';

class SingletonInterceptor {
	private static instance: SingletonInterceptor;
	private static interceptor: AxiosInstance;
	private static requestsQueue: Array<QueueItem> = [];
	private static isRefreshingToken = false;

	private constructor() {
		SingletonInterceptor.interceptor = axios.create({
			timeout: 20000,
		});
		this.setupInterceptorRequest();
	}

	private setupInterceptorRequest(newToken?: string): void {
		const token = newToken || localStorage.getItem(TOKEN_KEY);
		SingletonInterceptor.interceptor.interceptors.request.use((config) => {
			(config.headers as Record<string, any>).common = {
				Authorization: token ? `Bearer ${token}` : '',
				'Content-Type': 'application/json',
			};
			return config;
		});
	}

	public static getInstance(): SingletonInterceptor {
		if (!SingletonInterceptor.instance) {
			SingletonInterceptor.instance = new SingletonInterceptor();
		}
		return SingletonInterceptor.instance;
	}

	public executeRequest(config: ExecutorInterface): Promise<any> {
		return new Promise((resolve, reject) => {
			if (SingletonInterceptor.isRefreshingToken) {
				SingletonInterceptor.requestsQueue.push({
					config,
					resolve,
					reject,
				});
			} else {
				store.dispatch(setRootLoading(true));
				SingletonInterceptor.interceptor({
					url: config.endPoint,
					method: config.method,
					data: config.data,
					params: config.params,
				})
					.then((res: AxiosResponse) => {
						store.dispatch(setRootLoading(false));
						resolve(res);
					})
					.catch((err: AxiosError) => {
						store.dispatch(setRootLoading(false));
						if (err.response?.status === 403) {
							if (!SingletonInterceptor.isRefreshingToken) {
								SingletonInterceptor.isRefreshingToken = true;
								SingletonInterceptor.requestsQueue.push({
									config,
									resolve,
									reject,
								});
								store.dispatch(setRootLoading(true));
								this.refreshMyToken()
									.then((res: AxiosResponse) => {
										store.dispatch(setRootLoading(false));
										SingletonInterceptor.isRefreshingToken = false;
										localStorage.setItem(TOKEN_KEY, res.data.token);
										this.retryApiCalls();
									})
									.catch((err: AxiosError) => {
										store.dispatch(setRootLoading(false));
										SingletonInterceptor.isRefreshingToken = false;
										this.abortAllRequests();
									});
							} else {
								SingletonInterceptor.requestsQueue.push({
									config,
									resolve,
									reject,
								});
							}
						} else {
							reject(`Request failed with status: ${err.response?.status}`);
							this.clearQueue();
						}
					});
			}
		});
	}

	private refreshMyToken = (): Promise<any> => {
		return new Promise((resolve, reject) => {
			SingletonInterceptor.interceptor({
				url: BASE_URL + TEST_UPDATE_TOKEN,
				method: 'get',
			})
				.then((res) => resolve(res))
				.catch((err) => reject(err));
		});
	};

	private clearQueue = (index?: number) => {
		if (typeof index === 'number') {
			SingletonInterceptor.requestsQueue.splice(index, 1);
		} else {
			SingletonInterceptor.requestsQueue.length = 0;
		}
	};

	private abortAllRequests = () => {
		SingletonInterceptor.requestsQueue.forEach((item, index) => {
			item.reject('Request aborted due to unUpdatable token');
			this.clearQueue(index);
		});
	};

	private retryApiCalls = () => {
		store.dispatch(setRootLoading(true));
		Promise.all(
			SingletonInterceptor.requestsQueue.map((_) =>
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

export default SingletonInterceptor;
