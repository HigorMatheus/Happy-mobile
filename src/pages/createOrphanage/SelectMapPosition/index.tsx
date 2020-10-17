import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as expoLocation from 'expo-location'

import mapMarkerImg from '../../../images/map-marker.png';


import styles from './styles';

const SelectMapPosition: React.FC = () =>{
  const navigation = useNavigation();
  const [position, setPosition]= useState({latitude: 0, longitude:0})
  const [inicitalPosition, setInicitalPosition]= useState({latitude: 0, longitude:0})

  function handleNextStep() {
    navigation.navigate('OrphanageData',{position});
  }
  function handleSelectPosition(event:MapEvent){
    setPosition(event.nativeEvent.coordinate)
  }

  useEffect(()=>{
    async function loadPositions() {
      const {status} = await expoLocation.requestPermissionsAsync();

      if(status!== 'granted'){
        Alert.alert('Ooops..','Precissamos de sua Localização.....');
        return;
      }

      const location = await expoLocation.getCurrentPositionAsync();

      const {latitude,longitude} =location.coords;


      setInicitalPosition({ latitude, longitude})
    }

    loadPositions()
  },[])

  return (
    <View style={styles.container}>
      { inicitalPosition.latitude!== 0 && (
        <MapView 
       
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: inicitalPosition.latitude,
          longitude: inicitalPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={handleSelectPosition}
      >
        {position.latitude!== 0 && (
          <Marker 
          icon={mapMarkerImg}
          coordinate={{ latitude: position.latitude, longitude: position.longitude }}
        />
        )}
      </MapView>
      )}

      {position.latitude!== 0 && (
           <RectButton style={styles.nextButton} onPress={handleNextStep}>
           <Text style={styles.nextButtonText}>Próximo</Text>
         </RectButton>
        )}
    
    </View>
  )
}


export default SelectMapPosition