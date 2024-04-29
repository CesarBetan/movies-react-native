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
import {LinearGradient} from 'react-native-linear-gradient';
import {
  Genre,
  ICast,
  IDetail,
  IMovieDetail,
  MovieDetailsRouteProp,
} from './types';

let {width, height} = Dimensions.get('window');
const ios = Platform.OS == 'ios';
const topMargin = ios ? '' : ' mt-4';

const MovieScreen: React.FC = () => {
  const {params} = useRoute<MovieDetailsRouteProp>();
  const item = params;
  const navigation = useNavigation();

  const [isFavourite, toggleFavourite] = useState(false);
  const [detail, setDetail] = useState<IDetail>();
  const [credits, setCredits] = useState<ICast[]>([]);
  const [similar, setSimilar] = useState<IMovieDetail[]>([]);

  const [errorEp, setErrorEp] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {getMovieDetail, loading: loadingDetail} = useGetMovieDetail(item.id);
  const {getMovieCredits: getMovieC, loading: loadingCredits} =
    useGetMovieCredits(item?.id);
  const {getMovieSimilar, loading: loadingSimilar} = useGetMovieSimilar(
    item.id,
  );

  const getMovieDetails = async () => {
    setLoading(true);
    try {
      const res = await getMovieDetail();
      if (res) {
        console.log(res.data, 'detail');
        setDetail(res.data);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  const getMovieCredits = async () => {
    setLoading(true);
    try {
      const res = await getMovieC();
      if (res) {
        setCredits(res.data.cast);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  const getSimilarMovies = async () => {
    setLoading(true);
    try {
      const res = await getMovieSimilar();
      if (res) {
        console.log(res.data.results, 'similar');
        setSimilar(res.data.results);
      }
    } catch (e) {
      setErrorEp(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getMovieDetails();
    getMovieCredits();
    getSimilarMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView className="flex-1 bg-neutral-900 pb-6">
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
          <>
            <Loading />

            <View>
              <Image
                source={{
                  uri: image500(detail?.poster_path!) ?? fallbackMoviePoster,
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
          </>
        ) : (
          <View>
            <Image
              source={{
                uri: image500(detail?.poster_path!) ?? fallbackMoviePoster,
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
          {detail?.title}
        </Text>
        {/* status, release , runtime */}
        {detail?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {detail?.status} • {detail?.release_date?.split('-')[0] || 'N/A'} •{' '}
            {detail?.runtime} min
          </Text>
        ) : null}

        {/* genres  */}
        <View className="flex-row justify-center mx-4 space-x-2">
          {detail?.genres?.map((genre: Genre) => {
            let showDot = genre.id + 1 != detail.genres.length;
            return (
              <Text
                key={genre.id}
                className="text-neutral-400 font-semibold text-base text-center">
                {genre?.name} {showDot ? '•' : null}
              </Text>
            );
          })}
        </View>

        {/* description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {detail?.overview}
        </Text>
      </View>

      {credits?.length > 0 && <Cast navigation={navigation} cast={credits} />}

      {/*similar movies  */}
      {similar?.length > 0 && (
        <MovieList title="Similar Movies" hideSeeAll={true} data={similar} />
      )}

      {errorEp && (
        <View>
          <Text>There was en errant error getting the entertainment</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default MovieScreen;
