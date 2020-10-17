import React, { useEffect, useState} from 'react';
import {  View,Text, Alert } from 'react-native';
import MapView, {Marker,Callout,PROVIDER_GOOGLE} from 'react-native-maps';
import {Feather} from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as expoLocation from 'expo-location'

import mapMarker from '../../images/map-marker.png';
import { styles } from './styles';
import api from '../../services/api';


interface Orphanage{
  id:number
  name: string
  latitude:number
  longitude:number
}

const OrphanegesMap: React.FC = () => {
  const navigation = useNavigation();
  const [orphanages, setOrphanages]= useState<Orphanage[]>([]);
  const [inicitalPosition, setInicitalPosition]= useState({latitude: 0, longitude:0})

  useFocusEffect(()=>{
    api.get('/orphanages').then(response=>{
      setOrphanages(response.data);
    })
  })

 

  function handlerNavigationOrphanagesDetails(id:number){
    navigation.navigate('OrphanagesDetails',{id})
  }

  function handlerNavigationToCreateOrphanage(){
    navigation.navigate('SelectMapPosition')
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

      { inicitalPosition.latitude !== 0 && (
        <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude:inicitalPosition.latitude,
          longitude:inicitalPosition.longitude,
          latitudeDelta:0.008,
          longitudeDelta:0.008,
        }}  
      >
        {orphanages.map(orphanage=>{
          return(
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8,
              }}
              coordinate={{
                latitude:orphanage.latitude,
                longitude:orphanage.longitude,
              }}
            >
              <Callout tooltip onPress={()=>handlerNavigationOrphanagesDetails(orphanage.id)} >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>
                    {orphanage.name}
                  </Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
      </MapView>
      )}
      
      <View style={styles.footer}>
          <Text style={styles.footerText}> {orphanages.length} orfanatos encontrados</Text>
          <RectButton style={styles.crrateOrphanagesBotton} onPress={handlerNavigationToCreateOrphanage}>
          <Feather name="plus" size={20} color="#fff"   />
          </RectButton>
      </View>
    </View>
  );
}

export default OrphanegesMap;