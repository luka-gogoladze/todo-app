import * as Font from 'expo-font';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
      'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null; // or a loading indicator

  return <Slot />;
}