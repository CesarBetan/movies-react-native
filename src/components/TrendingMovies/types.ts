import {IMovieDetail} from '../../screens/MovieScreen/types';

export interface ITrendingMovies {
  data: IMovieDetail[];
}

export interface IMovieCard {
  item: IMovieDetail;
  handleClick: (arg: IMovieDetail) => void;
}
