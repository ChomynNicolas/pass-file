import { StatusBar } from 'expo-status-bar';
import { StyleSheet,  View } from 'react-native';
import { LoginForm } from '../components/loginForm/LoginForm';

import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
}


export default function App({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <LoginForm  navigation={navigation}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});




