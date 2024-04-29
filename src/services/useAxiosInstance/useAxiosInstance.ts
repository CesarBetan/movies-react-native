import {makeUseAxios, UseAxiosResult} from 'axios-hooks';
import {AxiosRequestConfig} from 'axios';
import instance from '../index';

export const useAxiosInstanceOld = makeUseAxios({
  axios: instance,
  defaultOptions: {manual: true},
});

export const useAxiosInstanceWithoutManual = makeUseAxios({
  axios: instance,
});

const useAxiosInstance = <T = any, E = any>(
  params: string | AxiosRequestConfig,
): UseAxiosResult<T, E> => {
  const [{data, loading, error, response}, execute] = useAxiosInstanceOld<T, E>(
    typeof params === 'string'
      ? params
      : {
          ...params,
        },
  );

  return [
    {data, loading, error, response},
    execute,
  ] as object as UseAxiosResult<T, E>;
};

export default useAxiosInstance;
