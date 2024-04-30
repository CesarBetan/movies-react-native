import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';

export type PersonDetailsRouteProp = RouteProp<RootStackParamList, 'Person'>;

export interface IMovieDetailed {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: null;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}
