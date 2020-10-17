import React, { useState } from 'react';
import { ScrollView, View, Switch, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePiker from 'expo-image-picker'

import styles from './styles'


interface OrphanageDataParam {
  position :{
    latitude: number,
    longitude:number,
  }
}
export default function OrphanageData() {
  const route = useRoute()
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [open_on_weekends, setOpenOnWeekends]= useState(true)
  const [ images, setImages] =useState<string[]>([]);

  const navigation = useNavigation()

  const params = route.params as OrphanageDataParam
  
  async function handleSubmit(){
  
    const { latitude, longitude} = params.position 

    const data = new FormData()

    data.append('name',name);
    data.append('whatsapp',String(whatsapp))
    data.append('about',about);
    data.append('latitude',String(latitude));
    data.append('longitude',String(longitude));
    data.append('instructions',instructions);
    data.append('opening_hours',opening_hours);
    data.append('open_on_weekends',String(open_on_weekends));
    images.forEach((image, index)=>{
      data.append('images',{
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image
      } as any);
    })

    await api.post('/orphanages', data)

    navigation.navigate('OrphanegesMap')
  
  }

  async function handleSelectedImages(){
    const { status } = await  ImagePiker.requestCameraRollPermissionsAsync();

    if(status!== 'granted'){
      alert('Eita, precissamos de acesso as suas fotos.....');
      return;
    }

    const results = await ImagePiker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePiker.MediaTypeOptions.Images,
    })

    if(results.cancelled){
      return;
    }
    

    const { uri: image } = results as any
    
    setImages([...images, image])
  }

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
    >
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name} 
        onChangeText={setName}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about} 
        onChangeText={setAbout}
      />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
        value={whatsapp} 
        onChangeText={setWhatsapp}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.uploadImageContainer}>
        {images.map(image=>{
          return(
            <Image
              key={image}
              source={{uri:image}}
              style={styles.uploadImage}
            />
          )
        })}
      </View>
      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectedImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions} 
        onChangeText={setInstructions}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours} 
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch 
          thumbColor="#fff" 
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends} 
          onValueChange={setOpenOnWeekends}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  </KeyboardAvoidingView>
  )
}
