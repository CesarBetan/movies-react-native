import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import PersonScreen from '../PersonScreen';
import {GET_PERSON_MOVIES} from '../../../services/Person/__mocks__/getPersonMovies';
import {GET_PERSON_DETAIL} from '../../../services/Person/__mocks__/getPersonDetail';
import useGetPersonDetail from '../../../services/Person/useGetPersonDetail';
import useGetPersonMovies from '../../../services/Person/useGetPersonMovies';

const mockedNavigation = jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn,
  }),
}));

const getPersonDetail = jest.mock(
  '../../services/Person/useGetPersonDetail',
  () => () => ({
    getTrending: jest.fn(() => Promise.resolve({data: GET_PERSON_DETAIL})),
    loading: false,
  }),
);
const getPersonMovies = jest.mock(
  '../../services/Person/useGetPersonMovies',
  () => ({
    default: () => ({
      getTopRated: jest.fn(() => Promise.resolve({data: GET_PERSON_MOVIES})),
      loading: false,
    }),
  }),
);

jest.mock('../../components/Loading', () => 'Loading');
jest.mock('../../components/MovieList', () => 'MovieList');

describe('PersonScreen', () => {
  it('renders correctly', () => {
    const {getByTestId} = render(<PersonScreen />);
    expect(getByTestId('content-scrollview')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const {getByTestId} = render(<PersonScreen />);
    const backButton = getByTestId('btn-go-back');
    fireEvent.press(backButton);
    expect(mockedNavigation).toHaveBeenCalled();
  });

  it('shows loading indicator while fetching data', () => {
    useGetPersonDetail.mockImplementation(() => ({loading: true}));
    const {getByTestId} = render(<PersonScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays person details after fetching', async () => {
    const {getByTestId} = render(<PersonScreen />);
    await waitFor(() => {
      expect(getByTestId('txt-name')).toHaveTextContent(
        GET_PERSON_DETAIL.data.name,
      );
      expect(getByTestId('txt-bio')).toHaveTextContent(
        GET_PERSON_DETAIL.data.biography,
      );
    });
  });

  it('displays person movies after fetching', async () => {
    const {getByTestId} = render(<PersonScreen />);
    await waitFor(() => {
      expect(getByTestId('actor-movies')).toBeTruthy();
    });
  });

  it('displays error message when there is a fetching error', async () => {
    useGetPersonDetail.mockImplementation(() => ({
      getPersonDetail,
      loading: false,
    }));
    const {getByTestId} = render(<PersonScreen />);
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  it('displays error message when there is a fetching error movies', async () => {
    useGetPersonMovies.mockImplementation(() => ({
      getPersonMovies,
      loading: false,
    }));
    const {getByTestId} = render(<PersonScreen />);
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeTruthy();
    });
  });

  it('calls data fetching functions on mount', () => {
    render(<PersonScreen />);
    expect(useGetPersonDetail().getPersonDetail).toHaveBeenCalledTimes(1);
    expect(useGetPersonMovies().getPersonMovies).toHaveBeenCalledTimes(1);
  });
});
