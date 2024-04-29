import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetUpcoming = () => {
  const [{data, error, loading}, getUpcoming] = useAxiosInstance({
    url: `/movie/upcoming?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getUpcoming};
};

export default useGetUpcoming;
