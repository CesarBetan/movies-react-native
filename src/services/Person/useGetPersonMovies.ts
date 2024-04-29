import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetPersonMovies = (id?: string) => {
  const [{data, error, loading}, getPersonMovies] = useAxiosInstance({
    url: `/person/${id}/movie_credits?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getPersonMovies};
};

export default useGetPersonMovies;
