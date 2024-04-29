/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {styles} from '../../theme/index';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import MovieList from '../../components/MovieList';
import Loading from '../../components/Loading';
import useGetTrending from '../../services/MoviesLists/useGetTrending';
import TrendingMovies from '../../components/TrendingMovies';
import useGetTopRated from '../../services/MoviesLists/useGetTopRated';
import useGetUpcoming from '../../services/MoviesLists/useGetUpcoming';

const ios = Platform.OS == 'ios';
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [trending, setTrending] = useState<any>();
  const [upcoming, setUpcoming] = useState<any>();
  const [topRated, setTopRated] = useState<any>();

  const [loading, setLoading] = useState(true);

  const {getTrending, loading: loadingTrending} = useGetTrending();
  const {getTopRated, loading: loadingTopRated} = useGetTopRated();
  const {getUpcoming, loading: loadingUpcoming} = useGetUpcoming();

  const getTrendingMovies = async () => {
    setLoading(true);
    const res = await getTrending();
    if (res) {
      setTrending(res.data.results);
    }
    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    setLoading(true);
    const res = await getUpcoming();
    if (res) {
      setUpcoming(res.data.results);
    }
    setLoading(false);
  };

  const getTopRatedMovies = async () => {
    setLoading(true);
    const res = await getTopRated();
    if (res) {
      setTopRated(res.data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? '-mb-2' : 'mb-3'}>
        <StatusBar light-content />
        <View className="flex-row justify-between items-center mx-4">
          <Bars3CenterLeftIcon size={'30'} strokeWidth={2} color="white" />

          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading || loadingTrending || loadingTopRated || loadingUpcoming ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}>
          {trending?.length > 0 && <TrendingMovies data={trending} />}
          {upcoming?.length > 0 && (
            <MovieList title="Upcoming" data={upcoming} hideSeeAll={false} />
          )}
          {topRated?.length > 0 && (
            <MovieList title="Top rated" data={topRated} hideSeeAll={false} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
