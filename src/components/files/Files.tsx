import React, { Dispatch, SetStateAction, useState } from "react";
import { Pressable, View, Modal, Alert, StyleSheet, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
} from "firebase/storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

interface Props {
  files: string[];
  setSelectedFile: (file: string) => void;
  selectedFile: string;
  setFiles: Dispatch<SetStateAction<string[]>>;
}

export const Files = ({
  files,
  setSelectedFile,
  selectedFile,
  setFiles,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (file: string) => {
    setSelectedFile(file); // Guarda el archivo seleccionado
    setModalVisible(true); // Muestra el modal
  };

  const deleteFile = (file: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${file}`);
    deleteObject(storageRef)
      .then(() => {
        console.log("Archivo eliminado correctamente");
        const newFile = files.filter((filename) => {
          if (filename !== file) {
            return filename;
          }
        });
        setFiles(newFile);
      })
      .catch((error) => {
        console.log("Error no se pudo eliminar", error);
      });
    setModalVisible(false);
  };

  const downloadFile = async (filename: string) => {
    const storage = getStorage();
    try {
      const fileRef = ref(storage, `uploads/${filename}`);
      const url = await getDownloadURL(fileRef);
      console.log("Download URL:", url);
      return url;
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const saveFileToUserSelectedLocation = async (filename: string) => {
    try {
      // Solicita permisos de almacenamiento (especialmente necesario en Android)
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Se necesitan permisos para acceder al almacenamiento");
        return;
      }

      // Abre el selector de documentos para elegir una carpeta de almacenamiento
      const document = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "application/octet-stream", // Filtra para permitir seleccionar carpetas en lugar de archivos específicos (solo en Android)
      });

      // Descarga el archivo desde Firebase
      const downloadUrl = await downloadFile(filename);

      if (downloadUrl) {
        // Define la ruta de guardado
        let fileUri;

        if (document.canceled && document.assets) {
          // Si se seleccionó una ubicación (directorio), guarda allí
          fileUri = document.uri.replace(/\/[^\/]+$/, `/${filename}`); // Reemplaza el nombre del archivo con el nuevo nombre
        } else {
          // Si el usuario cancela o no se selecciona ninguna ubicación, guarda en una carpeta por defecto
          const downloadsDir = FileSystem.documentDirectory + "Download/";
          await FileSystem.makeDirectoryAsync(downloadsDir, {
            intermediates: true,
          });
          fileUri = downloadsDir + filename;
        }

        // Descarga el archivo y guárdalo en la ubicación seleccionada o por defecto
        const downloadResumable = FileSystem.createDownloadResumable(
          downloadUrl,
          fileUri
        );
        const result = await downloadResumable.downloadAsync();

        console.log("Archivo descargado a:", result?.uri);

        return result?.uri;
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    }
  };
  return (
    <>
      {files.length > 0
        ? files.map((file, index) => (
            <Pressable
              style={styles.uploadItem}
              key={index}
              onPress={() => openModal(file)} // Pasa el archivo seleccionado
            >
              <View style={styles.iconContainer}>
                <FontAwesome6
                  name="file-circle-check"
                  size={40}
                  color="black"
                />
                <Text
                  style={styles.uploadItemText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {file}
                </Text>
              </View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>{selectedFile}</Text>
                    <View style={styles.buttonsContainer}>
                      <Pressable
                        style={styles.uploadDeleteButton}
                        onPress={() => deleteFile(selectedFile)} // Elimina el archivo seleccionado
                      >
                        <AntDesign name="delete" size={24} color="white" />
                      </Pressable>
                      <Pressable
                        style={styles.uploadDownloadButton}
                        onPress={() =>
                          saveFileToUserSelectedLocation(selectedFile)
                        }
                      >
                        <Text style={styles.textStyle}>Descargar</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    >
                      <Text style={styles.textStyle}>Cerrar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </Pressable>
          ))
        : ""}
    </>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fbf4ff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 15,
    elevation: 4,
    justifyContent: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#7f00b2",
  },
  textStyle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },

  uploadItem: {
    width: "30%",
    height: 100,
    borderBlockColor: "black",
    borderWidth: 2,
    borderRadius: 10,
  },
  uploadItemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
    padding: 5,
  },
  uploadItemText: {
    fontSize: 14,
    color: "black",
    flexShrink: 1,
    maxWidth: "80%",
    marginTop: 5,
  },
  uploadDeleteButton: {
    backgroundColor: "#d80f3f",
    width: "50%",
    height: 50,
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
  uploadDownloadButton: {
    backgroundColor: "#096934",
    width: "50%",
    height: 50,
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
    gap: 5,
  },
});
