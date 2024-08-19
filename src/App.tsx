import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RegisterForm } from './components/registerForm/RegisterForm';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hola mundo en desarrollo movil!</Text>
      <RegisterForm />
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
