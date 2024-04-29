import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetTopRated = () => {
  const [{data, error, loading}, getTopRated] = useAxiosInstance({
    url: `/movie/top_rated?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getTopRated};
};

export default useGetTopRated;
