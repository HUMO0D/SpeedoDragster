import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text } from '@/components/Themed';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function SpeedComp() {

  useEffect(() => {
    Alert.alert('Welcome', 'Please wait 20 to 30 seconds while the GPS calibrates. \nUse the app outdoors to get the best readings.');
  }, []);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    let intervalId;
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Warning','Please ensure granting location permission.',
        [{ text: "OK"},],
        { cancelable: false });
        // console.log('Permission to access location was denied');
        return;
      }
      intervalId = setInterval(updateSpeed, 500); // Update speed every half second
    };

    const updateSpeed = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        if (coords.speed !== undefined) {
          const speedKmph = coords.speed * 3.6; // Convert from m/s to km/h
          const roundedSpeed = Math.floor(speedKmph);
          setSpeed(roundedSpeed);
          // console.log("Speed: ", roundedSpeed);
        } else {
          // console.log('Speed not available');
        }
      } catch (error) {
        // console.log('Location error:', error);
      }
    };

    if (isFocused) {
      getLocationAsync();
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isFocused]);

  const [speed, setSpeed] = React.useState(null);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Speed{'\n'}{'\n'} {speed !== null ? `${speed}` : '-'}{'\n'}km/h
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: '35%',
    paddingBottom: '50%',
  },
  title: {
    fontSize: 80,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
});
