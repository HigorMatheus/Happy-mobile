import React from 'react';

import {NavigationContainer} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import OrphanegesMap from './pages/OrphanegesMap';
import OrphanagesDetails from './pages/OrphanagesDetails';
import SelectMapPosition from './pages/createOrphanage/SelectMapPosition';
import OrphanageData from './pages/createOrphanage/OrphanageData';
import  Header  from './components/header';

const {Navigator, Screen} = createStackNavigator()
const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{headerShown: false, cardStyle:{ backgroundColor: '#f2f3f5'}}} >
        <Screen 
          name="OrphanegesMap" 
          component={OrphanegesMap}
        />
        <Screen 
          name="OrphanagesDetails" 
          component={OrphanagesDetails}
          options={{
            headerShown:true,
            header: ()=> <Header showCancel={false} title='Orfanato'/>
          }}
        />
        <Screen 
          name="SelectMapPosition" 
          component={SelectMapPosition}
          options={{
            headerShown:true,
            header: ()=> <Header title='Selecione no mapa'/>
          }}
        />
        <Screen 
          name="OrphanageData" 
          component={OrphanageData}
          options={{
            headerShown:true,
            header: ()=> <Header title='Informe os dados'/>
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
}

export default Routes;