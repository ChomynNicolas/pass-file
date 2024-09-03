import React, {useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import ProgressBar from './components/progressBar/ProgressBar';

interface Props {
  uploadProgress: number;
  uploading: boolean;
}

const UploadModal = ({ uploadProgress, uploading }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log(uploading);
    if (uploading) {
      setModalVisible(true);
    }
  }, [uploading]);

  return (
    <View style={styles.centeredView}>
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
            <Text style={styles.modalText}>
              {uploading ? "Subiendo" : " Completado"}
            </Text>
            <ProgressBar progress={uploadProgress}/>
            <Text style={styles.uploadText}>{uploadProgress}%</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>
                {uploading ? "Subiendo" : " Cerrar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  modalView: {
    width:"65%",
    margin: 20,
    backgroundColor: "white",
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
    marginTop: 5,
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 30,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#8f43bd",
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
  uploadText:{
    fontSize: 18,
  }
});

export default UploadModal;
