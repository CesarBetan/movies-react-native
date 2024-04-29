/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {styles} from '../../theme/index';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Loading} from '../../components/Loading';
import useGetTrending from '../../services/MoviesLists/useGetTrending';
import {TrendingMovies} from '../../components/TrendingMovies';
import useGetTopRated from '../../services/MoviesLists/useGetTopRated';
import useGetUpcoming from '../../services/MoviesLists/useGetUpcoming';
import {IMovieDetail} from '../MovieScreen/types';
import {MovieList} from '../../components/MovieList';

const ios = Platform.OS == 'ios';
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [trending, setTrending] = useState<IMovieDetail[]>([]);
  const [upcoming, setUpcoming] = useState<IMovieDetail[]>([]);
  const [topRated, setTopRated] = useState<IMovieDetail[]>([]);

  const [errorEp, setErrorEp] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const {getTrending, loading: loadingTrending} = useGetTrending();
  const {getTopRated, loading: loadingTopRated} = useGetTopRated();
  const {getUpcoming, loading: loadingUpcoming} = useGetUpcoming();

  const getTrendingMovies = async () => {
    setLoading(true);
    try {
      const res = await getTrending();
      if (res) {
        setTrending(res.data.results);
      }
    } catch (e) {
      setErrorEp(true);
    }

    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    setLoading(true);
    try {
      const res = await getUpcoming();
      if (res) {
        setUpcoming(res.data.results);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  const getTopRatedMovies = async () => {
    setLoading(true);
    try {
      const res = await getTopRated();
      if (res) {
        setTopRated(res.data.results);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        getTrendingMovies(),
        getUpcomingMovies(),
        getTopRatedMovies(),
      ]);
    } catch (error) {
      setErrorEp(true);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View testID="home-screen" className="flex-1 bg-neutral-800">
      <View className={ios ? '-mb-2' : 'mb-4'}>
        <StatusBar dark-content />
        <View className="mt-4 flex-row justify-between items-center mx-4">
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>Movies</Text> DB
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            testID="search-button">
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {loading || loadingTrending || loadingTopRated || loadingUpcoming ? (
        <Loading testID="loading-indicator" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mb-6"
          testID="content-scrollview"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#fff']} // Customize the color of the refresh indicator for Android
              tintColor={'#fff'} // Customize the color of the refresh indicator for iOS
            />
          }>
          {trending?.length > 0 && (
            <TrendingMovies data={trending} testID="trending-movies" />
          )}
          {upcoming?.length > 0 && (
            <MovieList
              title="Upcoming"
              data={upcoming}
              hideSeeAll={true}
              testID="upcoming-movies"
            />
          )}
          {topRated?.length > 0 && (
            <MovieList
              title="Top rated"
              data={topRated}
              hideSeeAll={true}
              testID="top-rated-movies"
            />
          )}
        </ScrollView>
      )}
      {errorEp && (
        <View testID="error-message">
          <Text>There was en errant error getting the entertainment</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
