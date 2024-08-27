import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import { app } from "../../firebase/config";
import { getStorage, ref, uploadBytesResumable, list } from "firebase/storage";

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

interface Props {
  pickDocument: () => void;
}

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<string[]>([""]);

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

  const pickDocument = async () => {
    console.log("se apreto el boton");
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    // console.log(result)
    if (result.canceled === false) {
      uploadFile(result);
    }
  };

  const uploadFile = async (document: { canceled?: false; assets: any; output?: FileList | undefined; }) => {
    // console.log(document.assets[0])
    setUploading(true);
    const response = await FileSystem.readAsStringAsync(
      document.assets[0].uri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${document.assets[0].name}`);
    const blob = new Blob([response], { type: document.assets[0].mimeType });

    console.log(storageRef);
    console.log(blob);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Monitorizar los cambios de estado durante la subida
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calcular el progreso de la subida (en %)
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress); // Actualizar un estado para la barra de progreso

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Manejar errores
        console.log(error);
        setUploading(false); // Resetear el estado de subida en caso de error
      },
      () => {
        // Manejar el éxito de la subida
        console.log("Upload completed successfully");
        setUploading(false); // Resetear el estado de subida cuando se complete
      }
    );
  };

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
            <Text style={styles.title}>Pass-File</Text>
          </View>
          <View style={styles.optionsContainer}>
            <Pressable>
              <Text style={styles.optionTitle}>Cargar</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.optionTitle}>Descargar</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.uploadItemContainer}>
              {files.length > 0
                ? files.map((file, index) => (
                    <View style={styles.uploadItem} key={index}>
                      <View style={styles.iconContainer}>
                        <FontAwesome6
                          name="file-circle-check"
                          size={40}
                          color="black"
                        />
                        <Text style={styles.uploadItemText}>
                          {file.slice(0,25)}
                        </Text>
                      </View>
                      <Pressable style={styles.uploadDeleteButton}>
                        <AntDesign name="delete" size={24} color="white" />
                      </Pressable>
                    </View>
                    
                  ))
                : ""}
                
            </View>
          </ScrollView>
        </View>
        <Home pickDocument={pickDocument}></Home>
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
  ulpoadButtonContainer: {
    padding: 2,
    paddingBottom: 5,
  },
  ulpoadButton: {
    borderBlockColor: "black",
    borderWidth: 1,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  uploadText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
  },
  uploadItem: {
    width: "30%",
    borderBlockColor: "black",
    borderWidth: 2,
    justifyContent:"space-between"
  },
  uploadItemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
    padding: 5,
  },
  uploadItemText: {
    textAlign: "center",
  },
  uploadDeleteButton: {
    backgroundColor: "#e90000",
    width: "100%",
    height: 30,
    marginTop: 10,

    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    gap: 5
  },
});

const Home = ({ pickDocument }: Props) => {
  return (
    <View style={styles.ulpoadButtonContainer}>
      <View style={styles.ulpoadButton}>
        <Entypo name="upload" size={40} color="black" onPress={pickDocument} />
        <Text style={styles.uploadText}>Subir</Text>
      </View>
    </View>
  );
};
