import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetMovieSimilar = (id?: number) => {
  const [{data, error, loading}, getMovieSimilar] = useAxiosInstance({
    url: `/movie/${id}/similar?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getMovieSimilar};
};

export default useGetMovieSimilar;
