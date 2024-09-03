import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStorage,
  ref,
  list,
} from "firebase/storage";


import { useEffect, useState } from "react";
import { Files } from "../components/files/Files";
import { Upload } from "../components/upload/Upload";


export default function App() {

  
  const [uploading, setUploading] = useState(false);
  
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState("");

  

  useEffect(() => {
    const obtenerListaDeDocumentos = async () => {
      const storage = getStorage();
      const listRef = ref(storage, "uploads");
      const results = await list(listRef);
      const files = results.items.map((item) => {
        const parts = item.fullPath.split("/"); // Dividir el path por '/'
        return parts[parts.length - 1]; // Obtener el último elemento del array
      });
      setFiles(files);
    };
    obtenerListaDeDocumentos();
  }, [uploading]);



  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#751dc6" }}
      edges={["top"]}
    >
      <StatusBar
        style="light" // "light" para texto claro, "dark" para texto oscuro
        backgroundColor={Platform.OS === "android" ? "#751dc6" : "transparent"} // Color de fondo en Android
        translucent={Platform.OS === "android"} // Android: translucent
      />
      <View style={styles.container}>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Pass File</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.uploadItemContainer}>
              <Files files={files} setSelectedFile={setSelectedFile} selectedFile={selectedFile} setFiles={setFiles}/>
            </View>
          </ScrollView>
        </View>
        <Upload setUploading={setUploading} uploading={uploading}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: 540,
  },
  titleContainer: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#751dc6",
    gap: 10,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
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
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  optionTitle: {
    fontSize: 18,
    color: "#000",
  },
  uploadItemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    padding: 5,
  }
});


