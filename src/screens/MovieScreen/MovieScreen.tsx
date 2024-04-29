import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {styles, theme} from '../../theme';
import {fallbackMoviePoster, image500} from '../../services/constants';
import useGetMovieDetail from '../../services/Movie/useGetMovieDetails';
import useGetMovieCredits from '../../services/Movie/useGetMovieCredits';
import useGetMovieSimilar from '../../services/Movie/useGetMovieSimilar';
import Loading from '../../components/Loading';
import Cast from '../../components/Cast';
import MovieList from '../../components/MovieList';
import {LinearGradient} from 'react-native-svg';

let {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';
const topMargin = ios ? '' : ' mt-4';

const MovieScreen: React.FC = () => {
  const {params: item} = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const {
    getMovieDetail,
    data: dataDetail,
    loading: loadingDetail,
  } = useGetMovieDetail();

  const {
    getMovieCredits: getMovieC,
    data: dataCredits,
    loading: loadingCredits,
  } = useGetMovieCredits();

  const {
    getMovieSimilar,
    data: dataSimilar,
    loading: loadingSimilar,
  } = useGetMovieSimilar();

  const getMovieDetails = async () => {
    setLoading(true);
    await getMovieDetail();
    setLoading(false);
  };

  const getMovieCredits = async () => {
    setLoading(true);
    await getMovieC();
    setLoading(false);
  };

  const getSimilarMovies = async () => {
    setLoading(true);
    await getMovieSimilar();
    setLoading(false);
  };

  useEffect(() => {
    getMovieDetails(item?.id);
    getMovieCredits(item?.id);
    getSimilarMovies(item?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 20}}
      className="flex-1 bg-neutral-900">
      {/* back button and movie poster */}
      <View className="w-full">
        <SafeAreaView
          className={
            'absolute z-20 w-full flex-row  justify-between items-center px-4' +
            topMargin
          }>
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={28} strokeWidth={2.5} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size={35}
              color={isFavourite ? theme.background : 'white'}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {loading || loadingDetail || loadingCredits || loadingSimilar ? (
          <Loading />
        ) : (
          <View>
            <Image
              // source={require('../assets/images/moviePoster2.png')}
              source={{
                uri: image500(dataDetail?.poster_path) || fallbackMoviePoster,
              }}
              style={{width, height: height * 0.55}}
            />
            <LinearGradient
              colors={[
                'transparent',
                'rgba(23, 23, 23, 0.8)',
                'rgba(23, 23, 23, 1)',
              ]}
              style={{width, height: height * 0.4}}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      {/* movie details */}
      <View style={{marginTop: -(height * 0.09)}} className="space-y-3">
        {/* title */}
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {dataDetail?.title}
        </Text>
        {/* status, release , runtime */}
        {dataDetail?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {dataDetail?.status} •{' '}
            {dataDetail?.release_date?.split('-')[0] || 'N/A'} •{' '}
            {dataDetail?.runtime} min
          </Text>
        ) : null}

        {/* genres  */}
        <View className="flex-row justify-center mx-4 space-x-2">
          {dataDetail?.genres?.map((genre, index) => {
            let showDot = index + 1 != dataDetail.genres.length;
            return (
              <Text
                key={index}
                className="text-neutral-400 font-semibold text-base text-center">
                {genre?.name} {showDot ? '•' : null}
              </Text>
            );
          })}
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {dataDetail?.overview}
        </Text>
      </View>

      {dataCredits.length > 0 && (
        <Cast navigation={navigation} cast={dataCredits} />
      )}

      {/*similar movies  */}
      {dataSimilar.length > 0 && (
        <MovieList
          title="Similar Movies"
          hideSeeAll={true}
          data={dataSimilar}
        />
      )}
    </ScrollView>
  );
};

export default MovieScreen;
