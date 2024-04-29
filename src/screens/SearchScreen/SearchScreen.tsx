import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {XMarkIcon} from 'react-native-heroicons/outline';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {fallbackMoviePoster, image185} from '../../services/constants';
import {Loading} from '../../components/Loading';
import useGetSearchMovies from '../../services/MoviesLists/useGetSearchMovies';
import {API_KEY} from '../../config/environment';
import {IMovieDetail} from '../MovieScreen/types';

let {width, height} = Dimensions.get('window');

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [results, setResults] = useState<IMovieDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorEp, setErrorEp] = useState<boolean>(false);

  const {searchMovies, loading: loadingSearch} = useGetSearchMovies();

  const handleSearch = async (value: string) => {
    setLoading(true);
    try {
      if (value.length > 0) {
        const res = await searchMovies({
          url: `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            value,
          )}&include_adult=true&page=1&language=en-US`,
        });
        if (res) {
          setResults(res.data.results);
        }
      } else {
        setResults([]);
      }
    } catch (e) {
      setErrorEp(true);
    }

    setLoading(false);
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View className="bg-neutral-800 flex-1 py-6">
      <View className="mx-4 my-2 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie..."
          placeholderTextColor={'lightgray'}
          className="py-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="rounded-full p-3 m-1 bg-neutral-500">
          <XMarkIcon size="25" color="white" />
        </TouchableOpacity>
      </View>

      {/* results */}
      {loading || loadingSearch ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 15}}
          className="space-y-3">
          <Text className="my-2 text-white font-semibold ml-1">
            Results ({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push('Movie', item)}>
                  <View className="space-y-2 mb-4">
                    <Image
                      source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                      }}
                      className="rounded-3xl"
                      style={{width: width * 0.44, height: height * 0.3}}
                    />
                    <Text className="text-gray-300 ml-1">
                      {item?.title.length > 22
                        ? item?.title.slice(0, 22) + '...'
                        : item?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-col justify-center items-center">
          <Image
            source={require('../../assets/images/movieTime.png')}
            className="h-96 w-96"
          />
          <Text className="text-neutral-400 text-xl">
            Explore the movie data base (TMDB)!
          </Text>
        </View>
      )}
      {errorEp && (
        <View>
          <Text>There was en errant error getting the entertainment</Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
