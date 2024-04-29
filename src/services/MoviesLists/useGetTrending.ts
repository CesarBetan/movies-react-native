import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetTrending = () => {
  const [{data, error, loading}, getTrending] = useAxiosInstance({
    url: `/trending/movie/day?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getTrending};
};

export default useGetTrending;
