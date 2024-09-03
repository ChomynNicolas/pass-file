import React, { Dispatch, SetStateAction, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';

import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import UploadModal from '../uploadModal/UploadModal';


interface Props{
  uploading:boolean
  setUploading: Dispatch<SetStateAction<boolean>>

}

export const Upload = ({uploading,setUploading}:Props) => {
  const [uploadProgress, setUploadProgress] = useState(0);


  const pickDocument = async () => {
    console.log("se apreto el boton");
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    // console.log(result)
    if (result.canceled === false) {
      uploadFile(result);
    }
  };

  const uploadFile = async (document: {
    canceled?: false;
    assets: any;
    output?: FileList | undefined;
  }) => {
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
    <>
      
      <UploadModal uploadProgress={uploadProgress} uploading={uploading} />

    <View style={styles.ulpoadButtonContainer}>
      <View style={styles.ulpoadButton}>
        <Entypo name="upload" size={40} color="black" onPress={pickDocument} />
        <Text style={styles.uploadText}>Subir</Text>
      </View>
    </View>
    </>
  )
}


const styles = StyleSheet.create({
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
});

