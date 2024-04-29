import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, MovieScreen, PersonScreen, SearchScreen} from '../screens';

const Stack = createNativeStackNavigator();

const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Movie"
          options={{headerShown: false}}
          component={MovieScreen}
        />
        <Stack.Screen
          name="Person"
          options={{headerShown: false}}
          component={PersonScreen}
        />
        <Stack.Screen
          name="Search"
          options={{headerShown: false}}
          component={SearchScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
