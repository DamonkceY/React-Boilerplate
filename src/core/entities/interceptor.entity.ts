// Queue for the api call's config
export type QueueItem = {
  config: ExecutorInterface;
  resolve: (value: any) => void;
  reject: (value: any) => void;
};

export type ExecutorInterface = {
  method: 'get' | 'post' | 'update' | 'delete';
  endPoint: string;
  data?: Record<string, any>;
  params?: Record<string, any>;
};
