import {IMovieDetail} from '../../screens/MovieScreen/types';

export interface ITrendingMovies {
  data: IMovieDetail[];
  testID: string;
}

export interface IMovieCard {
  item: IMovieDetail;
  handleClick: (arg: IMovieDetail) => void;
}
