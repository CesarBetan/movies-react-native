import {IMovieDetail} from '../../screens/MovieScreen/types';

export interface IMovieList {
  title: string;
  hideSeeAll: boolean;
  data: IMovieDetail[];
  testID: string;
}
