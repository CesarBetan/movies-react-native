import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import {styles} from '../../theme';
import {useNavigation} from '@react-navigation/native';
import {fallbackMoviePoster, image185} from '../../services/constants';
import {IMovieList} from './types';

let {width, height} = Dimensions.get('window');

const MovieList: React.FC<IMovieList> = ({title, hideSeeAll, data, testID}) => {
  const navigation = useNavigation();

  return (
    <View className="mb-8 space-y-4" testID={testID}>
      <View className="mx-4 mb-2 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* movie row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 15}}>
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            testID={`${testID}-movie-${index}`}
            onPress={() => navigation.push('Movie', item)}>
            <View className="space-y-4 mr-4">
              <Image
                source={{
                  uri: image185(item.poster_path) ?? fallbackMoviePoster,
                }}
                className="rounded-3xl"
                style={{
                  width: width * 0.33,
                  height: height * 0.22,
                }}
              />
              <Text className="text-neutral-300 ml-1">
                {item.title.length > 14
                  ? `${item.title.slice(0, 14)}...`
                  : item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default MovieList;
