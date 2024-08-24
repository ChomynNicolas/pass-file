import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  ImageBackground,
} from "react-native";
import { Formik } from "formik";
import { firebase, db } from "../../../firebase/config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { StackActions } from "@react-navigation/native";
import * as Yup from "yup";
import { collection, addDoc } from "firebase/firestore";

import { NavigationProp } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const image = require("../../../assets/fondo_de_pantalla.png");

interface Props {
  navigation: NavigationProp<any>;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string()
    .email("Por favor, ingrese un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("La confirmación de contraseña es requerida"),
});

export const RegisterForm = ({ navigation }: Props) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        try {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );

          const uid = userCredential.user.uid;
          const data = {
            id: uid,
            email: values.email,
            name: values.name,
          };

          try {
            const userRef = await addDoc(collection(db, "users"), {
              data,
            });
            console.log("Document written with ID: ", userRef.id);
            navigation.dispatch(StackActions.replace("Login"));
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <StatusBar
            style="light" // "light" para texto claro, "dark" para texto oscuro
            backgroundColor={
              Platform.OS === "android" ? "#FF6347" : "transparent"
            } // Color de fondo en Android
            translucent={Platform.OS === "android"} // Android: translucent
          />
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.inputContainer}></View>
            <Text style={styles.title}>Registro</Text>
            <Text style={styles.subtitle}>Crear una cuenta</Text>
            <View style={styles.inputsContainer}>
              <View style={styles.textBoxParent}>
                <TextInput
                  placeholder="Nombre"
                  onChangeText={handleChange("name")}
                  onBlur={() => {
                    handleBlur("name");
                    setFocusedField(null);
                  }}
                  onFocus={() => {
                    setFocusedField("name");
                  }}
                  value={values.name}
                  style={[
                    styles.input,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <View style={styles.textBoxParent}>
                <TextInput
                  placeholder="Correo electrónico"
                  onChangeText={handleChange("email")}
                  onBlur={() => {
                    handleBlur("email");
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField("email")}
                  value={values.email}
                  style={[
                    styles.input,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={styles.textBoxParent}>
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry={true}
                  onChangeText={handleChange("password")}
                  onBlur={() => {
                    handleBlur("password");
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField("password")}
                  value={values.password}
                  style={[
                    styles.input,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
              <View style={styles.textBoxParent}>
                <TextInput
                  placeholder="Confirmar contraseña"
                  secureTextEntry={true}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={() => {
                    handleBlur("confirmPassword");
                    setFocusedField(null);
                  }}
                  onFocus={() => setFocusedField("confirmPassword")}
                  value={values.confirmPassword}
                  style={[
                    styles.input,
                    focusedField === "confirmPassword" && styles.inputFocused,
                  ]}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
            </View>
            <Pressable style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
            <View style={styles.containerLine}>
              <View style={styles.line}></View>
              <Text style={styles.textLine}>O</Text>
              <View style={styles.line}></View>
            </View>
            <Pressable
              onPress={() => navigation.dispatch(StackActions.replace("Login"))}
            >
              <Text style={styles.link}>iniciar sesión</Text>
            </Pressable>
          </ImageBackground>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  inputsContainer: {
    gap: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "OpenSans-Bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 20,
    color: "#cccccc",
    marginBottom: 20,
    fontFamily: "OpenSans-Regular",
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3837ea",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 25,
    width: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "500",
  },
  link: {
    fontSize: 20,
    color: "white",
    textDecorationLine: "underline",
  },
  input: {
    padding: 11,
    borderWidth: 1,
    borderColor: "#3837ea", // Color del borde cuando no está enfocado
    borderRadius: 25,
    width: 250,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textBoxParent: {
    justifyContent: "center",
  },
  errorText: {
    position: "absolute",
    left: 0,
    top: 55,
    zIndex: 100,
    width: 250,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#ff0900",
  },
  inputFocused: {
    borderColor: "#3837ea", // Color del borde cuando está enfocado
    borderWidth: 2,
  },
  containerLine: {
    width: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  line: {
    height: 1.5,
    backgroundColor: "white",
    width: "44%",
  },
  textLine: {
    fontSize: 18,
    color: "white",
  },
});
