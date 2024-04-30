import React from 'react';
import {render, waitFor, fireEvent, act} from '@testing-library/react-native';
import MovieScreen from '../MovieScreen';
import {GET_MOVIE_DETAILS} from '../../../services/Movie/__mocks__/getMovieDetails';
import {GET_MOVIE_CREDITS} from '../../../services/Movie/__mocks__/getMovieCredits';
import {GET_MOVIE_SIMILAR} from '../../../services/Movie/__mocks__/getMovieSimilar';
import useGetMovieCredits from '../../../services/Movie/useGetMovieCredits';
import useGetMovieSimilar from '../../../services/Movie/useGetMovieSimilar';
import useGetMovieDetail from '../../../services/Movie/useGetMovieDetails';

const mockedNavigation = jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
const getMovieDetailMock = jest.mock(
  '../../services/Movie/useGetMovieDetails',
  () => ({
    default: () => ({
      getMovieDetail: jest.fn(() => Promise.resolve({data: GET_MOVIE_DETAILS})),
      loading: false,
    }),
  }),
);
const getMovieCredits = jest.mock(
  '../../services/Movie/useGetMovieCredits',
  () => ({
    default: () => ({
      getMovieCredits: jest.fn(() =>
        Promise.resolve({data: GET_MOVIE_CREDITS}),
      ),
      loading: false,
    }),
  }),
);
const getMovieSimilar = jest.mock(
  '../../services/Movie/useGetMovieSimilar',
  () => ({
    default: () => ({
      getMovieSimilar: jest.fn(() =>
        Promise.resolve({data: GET_MOVIE_SIMILAR}),
      ),
      loading: false,
    }),
  }),
);

jest.mock('../../components/Loading', () => 'Loading');
jest.mock('../../components/Cast', () => 'Cast');
jest.mock('../../components/MovieList', () => 'MovieList');

describe('HomeScreen', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<MovieScreen />);
    expect(getByTestId('movie-screen')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const {getByTestId} = render(<MovieScreen />);
    const goBack = useNavigation().goBack;
    fireEvent.press(getByTestId('btn-go-back'));
    expect(goBack).toHaveBeenCalled();
  });

  it('shows loading indicator while fetching data', () => {
    useGetMovieDetail.mockImplementation(() => ({loading: true}));
    const {getByTestId} = render(<MovieScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays movie details after fetching', async () => {
    useGetMovieDetail.mockImplementation(() => ({
      getMovieDetail: jest.fn(() => Promise.resolve({data: GET_MOVIE_DETAILS})),
      loading: false,
    }));
    const {findByTestId} = render(<MovieScreen />);
    expect(await findByTestId('txt-title')).toHaveTextContent(
      GET_MOVIE_DETAILS.data.title,
    );
  });

  it('displays movie credits after fetching', async () => {
    useGetMovieCredits.mockImplementation(() => ({
      getMovieCredits: jest.fn(() =>
        Promise.resolve({data: {cast: GET_MOVIE_CREDITS}}),
      ),
      loading: false,
    }));
    const {findByTestId} = render(<MovieScreen />);
    expect(await findByTestId('movie-cast')).toBeTruthy();
  });

  it('displays error message when there is a fetching error', async () => {
    // Simulate an error in fetching movie details
    useGetMovieDetail.mockImplementation(() => ({
      getMovieDetail: jest.fn(() =>
        Promise.reject(new Error('Fetching error')),
      ),
      loading: false,
    }));
    const {findByTestId} = render(<MovieScreen />);
    expect(await findByTestId('error-message')).toBeTruthy();
  });

  it('displays similar movies after fetching', async () => {
    const {getByTestId, queryByTestId, findAllByTestId} = render(
      <MovieScreen />,
    );
    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(getByTestId('similar-movies')).toBeTruthy();
    });
    const similarMovieItems = await findAllByTestId('movie-item');
    expect(similarMovieItems.length).toBe(2);
  });
});
