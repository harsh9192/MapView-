
import React from 'react'
import MapViewScreen from './src/MapViewScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <MapViewScreen/>
    </GestureHandlerRootView>
  )
}

export default App
