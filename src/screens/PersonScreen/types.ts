import {RouteProp} from '@react-navigation/native';
import {IMovieDetail} from '../MovieScreen/types';

export type RootStackParamList = {
  Person: IMovieDetail;
};

export type PersonDetailsRouteProp = RouteProp<RootStackParamList, 'Person'>;
