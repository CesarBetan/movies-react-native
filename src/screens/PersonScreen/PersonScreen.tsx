/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {styles, theme} from '../../theme';
import {fallbackPersonImage, image342} from '../../services/constants';
import useGetPersonDetail from '../../services/Person/useGetPersonDetail';
import {API_KEY} from '../../config/environment';
import {Loading} from '../../components/Loading';
import {MovieList} from '../../components/MovieList';
import useGetPersonMovies from '../../services/Person/useGetPersonMovies';
import {IMovieDetail} from '../MovieScreen/types';
import {PersonDetailsRouteProp} from './types';

let {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';
const topMargin = ios ? '' : ' my-3';

const PersonScreen: React.FC = () => {
  const {params} = useRoute<PersonDetailsRouteProp>();
  const item = params;
  const navigation = useNavigation();
  const [details, setDetails] = useState<any>();
  const [movies, setMovies] = useState<IMovieDetail[]>([]);

  const [errorEp, setErrorEp] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {getPersonDetail, loading: loadingDetail} = useGetPersonDetail();

  const {getPersonMovies: getMovies, loading: loadingMovies} =
    useGetPersonMovies();

  const getPersonDetails = async () => {
    try {
      const res = await getPersonDetail({
        url: `/person/${item.id}?api_key=${API_KEY}`,
      });
      if (res) {
        setDetails(res.data);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  const getPersonMovies = async () => {
    try {
      const res = await getMovies({
        url: `/person/${item.id}/movie_credits?api_key=${API_KEY}`,
      });
      if (res) {
        setMovies(res.data.cast);
      }
    } catch (e) {
      setErrorEp(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getPersonDetails();
    getPersonMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{paddingBottom: 20}}>
      <SafeAreaView
        className={
          'flex-row justify-between items-center mx-4 z-10 ' + topMargin
        }>
        <TouchableOpacity
          style={styles.background}
          className="rounded-xl p-1"
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={28} strokeWidth={2.5} color={'white'} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* person details */}
      {loading || loadingDetail || loadingMovies ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: 'gray',
              shadowRadius: 40,
              shadowOffset: {width: 0, height: 5},
              shadowOpacity: 1,
            }}>
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-neutral-500 border-2">
              <Image
                // source={require('../assets/images/castImage2.png')}
                source={{
                  uri: image342(details?.profile_path) || fallbackPersonImage,
                }}
                style={{height: height * 0.43, width: width * 0.74}}
              />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {/* Keanu Reeves */}
              {details?.name}
            </Text>
            <Text className="text-neutral-500 text-base text-center">
              {details?.place_of_birth}
              {/* Beirut, Lebanon */}
            </Text>
          </View>

          <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full ">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold ">Gender</Text>
              <Text className="text-neutral-300 text-sm">
                {/* Male */}
                {details?.gender == 1 ? 'Female' : 'Male'}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 text-sm">
                {/* 1964-09-02 */}
                {details?.birthday}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">known for</Text>
              <Text className="text-neutral-300 text-sm">
                {/* Acting */}
                {details?.known_for_department}
              </Text>
            </View>
            <View className="px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 text-sm">
                {/* 84.23 % , we want 2 digits after the decimal point so use toFixed(2) */}
                {details?.popularity?.toFixed(2)} %
              </Text>
            </View>
          </View>

          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {details?.biography || 'N/A'}
            </Text>
          </View>

          {movies?.length > 0 && (
            <MovieList title={'Movies'} hideSeeAll={true} data={movies} />
          )}
        </View>
      )}
      {errorEp && (
        <View>
          <Text>There was en errant error getting the entertainment</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PersonScreen;
