import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {IMovieDetail} from '../screens/MovieScreen/types';

export type RootStackParamList = {
  Home: undefined;
  Movie: IMovieDetail;
  Person: IMovieDetail;
};

export type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export type RouteType<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
