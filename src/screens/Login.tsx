import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginForm } from '../components/loginForm/LoginForm';

import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
}


export default function App({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text>Hola mundo en desarrollo movil!</Text>
      <LoginForm  navigation={navigation}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});




