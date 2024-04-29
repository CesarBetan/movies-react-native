import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetMovieCredits = (id?: number) => {
  const [{data, error, loading}, getMovieCredits] = useAxiosInstance({
    url: `/movie/${id}/credits?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getMovieCredits};
};

export default useGetMovieCredits;
