import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetMovieDetail = (id?: string) => {
  const [{data, error, loading}, getMovieDetail] = useAxiosInstance({
    url: `/movie/${id}?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getMovieDetail};
};

export default useGetMovieDetail;
