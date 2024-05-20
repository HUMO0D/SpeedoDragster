import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Image, ScrollView } from 'react-native';
const WheelIcon = require('../assets/images/Car-with-a-hand-on-the-wheel.png');
const LocationPin = require('../assets/images/Location-pin.png');
const GPSSignal = require('../assets/images/GPS-Signal.png');
const satelliteicon = require('../assets/images/satellite-icon.png');

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>      
      <View style={styles.Container}>
        <Text
          style={{textAlign: 'center', fontSize: 12, marginBottom: 20}}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Your car's speedometer may show a slightly higher speed than the app due to manufacturer calibration for a safety buffer.
        </Text>

        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginBottom: 35, }}>
          <Image source={WheelIcon} style={{ width: 75, height: 60}} />
          <Text
            style={styles.InfoText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Always prioritize safe driving. Don't let the app distract you from the road.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginBottom: 35,  }}>
          <Image source={LocationPin} style={{ width: 60, height: 60}} />
          <Text
            style={styles.InfoText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            To show your current speed, the app needs access to your location. Please grant permission if it's not already enabled.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginBottom: 35,  }}>
          <Image source={GPSSignal} style={{ width: 70, height: 45}} />
          <Text
            style={styles.InfoText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Get the best readings by using the app outdoors. Moving and stopping occasionally can help calibrate the GPS to start a drag race.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', marginBottom: 35,  }}>
          <Image source={satelliteicon} style={{ width: 50, height: 45, marginRight: 20,}} />
          <Text
            style={styles.InfoText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Note that acceleration times may vary depending on the GPS capabilities of your device.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', paddingHorizontal:30, marginTop: 30,}}>
          <Text
            style={styles.ContactText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
            Contact the developer
            {'\n'} Having any questions? Feel free to reach out:
            {'\n'}humood.alrawahi@gmail.com
            {'\n'} Version: 1.0.0
            {'\n'} HAMOOD
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Container: {
    alignItems: 'center',
  },
  InfoText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 20,
  },
  ContactText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 25,
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
});
