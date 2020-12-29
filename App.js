import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';

const WEATHER_API_KEY = '43ea3480c04081c2fefd5fec43215853';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';

const App = () => {
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [currentWeather, setCurrentWeather] = React.useState(null);
  const [unitsSystem, setUnitsSystem] = React.useState('metric');

  React.useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage('Access to location is needed run to app.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(weatherUrl);

      const result = await response.json();

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style='auto' />
        <View style={styles.main}>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
        <StatusBar style='auto' />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;
