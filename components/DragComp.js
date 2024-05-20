import React, { useState, useEffect } from 'react';
import { View, Text } from '@/components/Themed';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Alert, ScrollView } from 'react-native';
import { Audio } from 'expo-av';

export default function SpeedComp() {
  const isFocused = useIsFocused();
  const [speed, setSpeed] = useState(null);
  const [initiallongitude, setInitialLongitude] = useState(null);
  const [initiallatitude, setInitialLatitude] = useState(null);
  const [currentlongitude, setCurrentLongitude] = useState(null);
  const [currentlatitude, setCurrentLatitude] = useState(null);
  const [QMileStartTime, setQMileStartTime] = useState(null);
  const [QMileFinishTime, setQMileFinishTime] = useState(null);
  const [SixtyFeet, setSixtyFeet] = useState(null);
  const [ThreeThirtyFeet, setThreeThirtyFeet] = useState(null);
  const [EighthMile, setEighthMile] = useState(null);
  const [ThousandFeet, setThousandFeet] = useState(null);
  const [SpeedAtQ, setSpeedAtQ] = useState(null);
  const [SpeedAtE, setSpeedAtE] = useState(null); 
  const [startRaceCountdown, setStartRaceCountdown] = useState(null);
  const [raceStartTime, setRaceStartTime] = useState(null);
  const [dragStartTime, setDragStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const [alertShowed, setAlertShowed] = useState(false);
  const [sound, setSound] = React.useState();
  const [SoundPlaying, setSoundPlaying] = useState(false);

  // Handle the location fetching
  useEffect(() => {
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
      intervalId = setInterval(updateSpeed, 50); // Update speed every 50 milliseconds
    };
    const updateSpeed = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        // Handles Speed extraction
        if (coords.speed !== undefined) {
          const speedKmph = coords.speed * 3.6; // Convert from m/s to km/h
          const roundedSpeed = Math.floor(speedKmph);
          setSpeed(roundedSpeed);
        } else {
          // console.log('Speed not available');
        }
        // Handles Geographic coordinate extraction
        if (coords.latitude !== undefined && coords.longitude !== undefined) {
          const latitude = coords.latitude;
          const longitude = coords.longitude;
          setCurrentLatitude(latitude);
          setCurrentLongitude(longitude);
        } else {
          // console.log('Geographic coordinate not available');
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

  // Start race button
  const handleStartRace = () => {
    setStartRaceCountdown(5);
    setTimerId(
      setInterval(() => {
        setStartRaceCountdown((prevCount) => prevCount - 1);
      }, 1000)
    );
    setShowStartButton(false);
    // console.log('Start drag race Pressed');
      // Initial location
      setInitialLatitude(currentlatitude);
      setInitialLongitude(currentlongitude);
      // console.log('Initial Location Registered');
  };

  // Play start race sound
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/StartRaceSound.mp3')
      );
      if (alertShowed === false && speed === 0) {
        setSound(sound);
        await sound.playAsync();
        setSoundPlaying(true);
      }
    } catch (error) {
      // console.error('Failed to play the sound', error);
    }
  };

  // Stop the sound if speed increased before finish
  useEffect(() => {
    if (alertShowed === true && sound !== null && SoundPlaying === true) {
      async function stopSound() {
        try {
          await sound.stopAsync();
          // await sound.unloadAsync();
        } catch (error) {
          // console.error('Failed to stop the sound:', error);
        }
      }  
      stopSound();
    }
  }, [alertShowed]);

  // Warning if the speed increased while counting down for the race or starting in roll
  useEffect(() => {
    if ( alertShowed === false && showStartButton === false && startRaceCountdown <= 5 && startRaceCountdown > 0 && speed > 0) {
      // console.log('Moved before started');
      clearInterval(timerId); // Stop the countdown timer
      Alert.alert('Warning','Speed increased before race started! \n\nPlease reset and ensure not moving before the countdown finishes.',
        [
          { text: "OK"},
          {text: 'Reset', onPress: () => {handleResetRace();}},
          // { text: "OK", onPress: () => console.log("OK Pressed") },
          // {text: 'Reset', onPress: () => {console.log('Reset Pressed'); handleResetRace();}},
        ],
      { cancelable: true });
      setAlertShowed(true);
    }
  }, [alertShowed, showStartButton, startRaceCountdown, speed]);

  // Initial time for R/T
  useEffect(() => {
    if (startRaceCountdown === 0 && speed < 1 && reactionTime === null) {
      // console.log('Race started');
      setRaceStartTime(Date.now());
      clearInterval(timerId); // Stop the countdown timer
    }
  }, [startRaceCountdown, speed]);

  // Initial time for 0-100
  useEffect(() => {
    if (startRaceCountdown === 0 && speed > 0 && dragStartTime === null) {
        setDragStartTime(Date.now());
        // console.log('Drag race started');
        //Initial time for quarter mile
        setQMileStartTime(Date.now());
        // console.log('Quarter mile race started');
    }
  }, [startRaceCountdown, speed]);

  // Final time of R/T and registering it
  useEffect(() => {
    if (startRaceCountdown === 0 && speed > 0 && reactionTime === null) {
      setReactionTime(((Date.now() - raceStartTime) / 1000).toFixed(2));
      // console.log('Reaction time registered');
    }
  }, [startRaceCountdown, speed]);

  // Final time of 0-100 and registering it
  useEffect(() => {
    if (startRaceCountdown === 0 && speed >= 100 && elapsedTime === null) {
      setElapsedTime(((Date.now() - dragStartTime) / 1000).toFixed(2));
      // console.log('Drag time registered');
    }
  }, [startRaceCountdown, speed]);

    // Final time of quarter mile registering it
    useEffect(() => {
      // haversine formula to calculate distance between two points
      const R = 6371e3; // Earth radius in meters
      const phi1 = initiallatitude * (Math.PI / 180);
      const phi2 = currentlatitude * (Math.PI / 180);
      const deltaPhi = ( (currentlatitude * (Math.PI / 180)) - (initiallatitude* (Math.PI / 180)));
      const deltaLambda = ( (currentlongitude* (Math.PI / 180)) - (initiallongitude* (Math.PI / 180)));
      const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in meters
      // console.log('distance: ', distance, 'meters');       // For Debugging
      // Readings :
      // 60 feet = 18.28800 meters
      if (startRaceCountdown === 0 && distance >= 18.28800 && SixtyFeet === null) {
        setSixtyFeet(((Date.now() - QMileStartTime) / 1000).toFixed(2));
        // console.log('60 feet time registered');
      }
      // 330 feet = 100.58400 meters
      if (startRaceCountdown === 0 && distance >= 100.58400 && ThreeThirtyFeet === null) {
        setThreeThirtyFeet(((Date.now() - QMileStartTime) / 1000).toFixed(2));
        // console.log('330 feet time registered');
      }
      // (1/8) mile = 201.16800 meters
      if (startRaceCountdown === 0 && distance >= 201.16800 && EighthMile === null) {
        setEighthMile(((Date.now() - QMileStartTime) / 1000).toFixed(2));
        // Register the speed
        setSpeedAtE(speed);
        // console.log('1/8 mile time and speed registered');
      }
      // 1000 feet = 304.8 meters
      if (startRaceCountdown === 0 && distance >= 304.8 && ThousandFeet === null) {
        setThousandFeet(((Date.now() - QMileStartTime) / 1000).toFixed(2));
        // console.log('1000 feet time registered');
      }
      // Quarter mile (1/4) mile = 402.33600 meters
      if (startRaceCountdown === 0 && distance >= 402.33600 && QMileFinishTime === null) {
        setQMileFinishTime(((Date.now() - QMileStartTime) / 1000).toFixed(2));
        setSpeedAtQ(speed);
        // console.log('Quarter mile time and speed registered');
      }
    }, [startRaceCountdown, speed]);

  // Handles reset button
  const handleResetRace = () => {
    clearInterval(timerId);
    // setSpeed(null);
    setStartRaceCountdown(null);
    setRaceStartTime(null);
    setDragStartTime(null);
    setReactionTime(null);
    setElapsedTime(null);
    setShowStartButton(true);
    setAlertShowed(false);
    setInitialLongitude(null);
    setInitialLatitude(null);
    setCurrentLongitude(null);
    setCurrentLatitude(null);
    setQMileStartTime(null);
    setQMileFinishTime(null);
    setSixtyFeet(null);
    setThreeThirtyFeet(null);
    setEighthMile(null);
    setThousandFeet(null);
    setSpeedAtQ(null);
    setSpeedAtE(null);
    setSoundPlaying(false);
    // console.log('Reset Pressed');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>

      <Text style={styles.title}>
        Speed{speed !== null ?` ${speed} ` : ' - '}km/h
      </Text>

      <Text style={styles.countdown}>
        Start countdown:{' '}
        <Text style={startRaceCountdown === 0 ? styles.greenText : styles.redText}>
          {startRaceCountdown !== null ? startRaceCountdown : '5'}
        </Text>
      </Text>

      <Text style={styles.zerotohundtimer}>
        {`0-100km/h : ${elapsedTime !== null ? elapsedTime + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        Drag Slip
      </Text>

      <Text style={styles.timer}>
        {`R/T: ${reactionTime !== null ? reactionTime + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        {`60': ${SixtyFeet !== null ? SixtyFeet + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        {`330': ${ThreeThirtyFeet !== null ? ThreeThirtyFeet + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        {`1/8: ${EighthMile !== null ? EighthMile + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        {`KMPH: ${SpeedAtE !== null ? SpeedAtE + ' km/h' : '--'}`}
      </Text>

      <Text style={styles.timer}>
        {`1000': ${ThousandFeet !== null ? ThousandFeet + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.quarttimer}>
        {`1/4: ${QMileFinishTime !== null ? QMileFinishTime + ' Sec' : '--'}`}
      </Text>

      <Text style={styles.quarttimer}>
        {`KMPH: ${SpeedAtQ !== null ? SpeedAtQ + ' km/h' : '--'}`}
      </Text>

      {showStartButton && ( // Render the button based on visibility state
        <TouchableOpacity style={styles.button} onPress={() => {
            handleStartRace();
            playSound();
          }}>
          <Text style={styles.buttonText}>Start Drag Race</Text>
        </TouchableOpacity>
      )}
        <TouchableOpacity style={styles.button} onPress={handleResetRace}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 40,
  },
  countdown: {
    fontSize: 22,
    marginTop: -5,
    marginBottom: -5,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  redText: {
    color: 'red',
    fontSize: 30,
  },
  greenText: {
    color: 'green',
    fontSize: 30,
  },
  zerotohundtimer: {
    fontSize: 25,
    marginTop: 10,
    alignSelf: 'center',
  },
  timer: {
    fontSize: 25,
    marginTop: 5,
    marginLeft: 50,
  },
  quarttimer: {
    fontSize: 35,
    marginTop: 5,
    marginLeft: 50,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: 350,
    alignSelf: 'center',
    height: 50,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContainer: {
    paddingBottom: 20,
  },
});


/*
/////////////////////  Successful run
Android Bundled 6896ms (C:\Users\HUMOOD\Documents\ReactNativeApps\SpeedoDragster App\speedodragster\node_modules\expo-router\entry.js)     
 LOG  Start drag race Pressed
 LOG  Initial Location Registered
 LOG  Race started
 LOG  Quarter mile race started
 LOG  Reaction time registered
 LOG  Reset Pressed
 LOG  Start drag race Pressed
 LOG  Initial Location Registered
 LOG  Race started
 LOG  Drag race started
 LOG  Quarter mile race started
 LOG  Reaction time registered
 LOG  60 feet time registered
 LOG  Drag time registered
 LOG  330 feet time registered
 LOG  1/8 mile time and speed registered
 LOG  1000 feet time registered
 LOG  Quarter mile time and speed registered
› Stopped server
*/
