import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetSearchMovies = () => {
  const [{data, error, loading}, searchMovies] = useAxiosInstance({
    url: `/search/movie?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, searchMovies};
};

export default useGetSearchMovies;
