import {API_KEY} from '../../config/environment';
import useAxiosInstance from '../useAxiosInstance/useAxiosInstance';

const useGetPersonDetail = (id?: string) => {
  const [{data, error, loading}, getPersonDetail] = useAxiosInstance({
    url: `/person/${id}?api_key=${API_KEY}`,
    method: 'GET',
  });

  return {data, error, loading, getPersonDetail};
};

export default useGetPersonDetail;
