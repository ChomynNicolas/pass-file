import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#751dc6' }} edges={["top"]}  >
      <StatusBar
        style="light" // "light" para texto claro, "dark" para texto oscuro
        backgroundColor={Platform.OS === 'android' ? "#751dc6" : "transparent"} // Color de fondo en Android
        translucent={Platform.OS === 'android'} // Android: translucent
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pass-File</Text>
        </View>
        <View style={styles.optionsContainer}>
          <Pressable><Text style={styles.optionTitle}>Cargar</Text></Pressable>
          <Pressable><Text style={styles.optionTitle}>Descargar</Text></Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#751dc6",
    gap: 10,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#d9e4df",
  },
  optionsContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10
  },
  optionTitle:{
    fontSize: 18,
    color: "#000",
    

  }
});
