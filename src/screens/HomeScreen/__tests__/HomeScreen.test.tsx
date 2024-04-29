import React from 'react';
import {render, waitFor, fireEvent, act} from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import {GET_TRENDING_MOVIES} from '../../../services/MoviesLists/__mocks__/getTrending';
import {GET_TOP_RATED_MOVIES} from '../../../services/MoviesLists/__mocks__/getTopRated';
import {GET_UPCOMING_MOVIES} from '../../../services/MoviesLists/__mocks__/getUpcoming';
import useGetTrending from '../../../services/MoviesLists/useGetTrending';
import useGetTopRated from '../../../services/MoviesLists/useGetTopRated';
import useGetUpcoming from '../../../services/MoviesLists/useGetUpcoming';

const mockedNavigation = jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
const getTrendingMock = jest.mock(
  '../../services/MoviesLists/useGetTrending',
  () => () => ({
    getTrending: jest.fn(() => Promise.resolve({data: GET_TRENDING_MOVIES})),
    loading: false,
  }),
);
const getUpcomingMock = jest.mock(
  '../../services/MoviesLists/useGetTopRated',
  () => ({
    default: () => ({
      getTopRated: jest.fn(() => Promise.resolve({data: GET_TOP_RATED_MOVIES})),
      loading: false,
    }),
  }),
);
const getTopRatedMock = jest.mock(
  '../../services/MoviesLists/useGetUpcoming',
  () => ({
    default: () => ({
      getUpcoming: jest.fn(() => Promise.resolve({data: GET_UPCOMING_MOVIES})),
      loading: false,
    }),
  }),
);

jest.mock('../../components/Loading', () => 'Loading');
jest.mock('../../components/TrendingMovies', () => 'TrendingMovies');
jest.mock('../../components/MovieList', () => 'MovieList');

describe('HomeScreen', () => {
  it('renders correctly with loading indicator', async () => {
    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  it('displays error when there is an error fetching data', async () => {
    // Override the mock implementation to simulate an error
    useGetTrending.mockImplementationOnce(() => ({
      getTrending: jest.fn(() =>
        Promise.reject(new Error('Error fetching trending movies')),
      ),
      loading: false,
    }));

    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  it('navigates to the search screen when the search icon is pressed', async () => {
    const {getByTestId} = render(<HomeScreen />);
    const searchButton = getByTestId('search-button');
    fireEvent.press(searchButton);
    expect(mockedNavigation).toHaveBeenCalledWith('Search');
  });

  it('renders the TrendingMovies component with data after fetching', async () => {
    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('trending-movies')).toBeTruthy();
    });
  });

  it('renders the MovieList component with upcoming movies after fetching', async () => {
    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('upcoming-movies')).toBeTruthy();
    });
  });

  it('renders the MovieList component with top-rated movies after fetching', async () => {
    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('top-rated-movies')).toBeTruthy();
    });
  });

  it('handles multiple API calls without causing side effects', async () => {
    const {getAllByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getAllByTestId('loading-indicator')).toBe(1);
    });
  });

  it('navigates to movie detail when a movie item is pressed', async () => {
    const {getByTestId} = render(<HomeScreen />);
    const movieItem = getByTestId('upcoming-movies-movie-1');
    fireEvent.press(movieItem);
    expect(mockedNavigation).toHaveBeenCalledWith('MovieDetail', {
      movieId: 1,
    });
  });
  it('refreshes data when the user pulls to refresh', async () => {
    // Mock the data fetching functions to resolve immediately

    // Use the actual hook implementations and override the return values
    useGetTrending.mockImplementation(() => ({
      getTrending: getTrendingMock,
      loading: false,
    }));
    useGetTopRated.mockImplementation(() => ({
      getTopRated: getTopRatedMock,
      loading: false,
    }));
    useGetUpcoming.mockImplementation(() => ({
      getUpcoming: getUpcomingMock,
      loading: false,
    }));

    const {getByTestId} = render(<HomeScreen />);
    await waitFor(() => {
      expect(getByTestId('content-scrollview')).toBeTruthy();
    });
    const scrollView = getByTestId('content-scrollview');
    act(() => {
      fireEvent(scrollView, 'onRefresh');
    });
    expect(getTrendingMock).toHaveBeenCalledTimes(1);
    expect(getUpcomingMock).toHaveBeenCalledTimes(1);
    expect(getTopRatedMock).toHaveBeenCalledTimes(1);
  });
});
