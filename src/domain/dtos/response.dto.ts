export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiMeta {
  message?: string;
  status?: number;
  [key: string]: any;
}

export const createResponse = <T>(data: T, meta: ApiMeta = {}): ApiResponse<T> => {
  return {
    data,
    meta: {
      message: 'Success',
      status: 200,
      ...meta,
    },
  };
};
