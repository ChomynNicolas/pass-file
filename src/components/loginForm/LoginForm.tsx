import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { Formik } from "formik";
import { auth } from "../../../firebase/config";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { StackActions } from "@react-navigation/native";
import * as Yup from "yup";
import { NavigationProp } from "@react-navigation/native";




const image = require("../../../assets/fondo_de_pantalla.png");

interface Props {
  navigation: NavigationProp<any>;
}



const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Por favor, ingrese un correo electrónico válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es requerida"),
});


export const LoginForm = ({ navigation }: Props) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.dispatch(StackActions.replace("inicio"));
  //       console.log('User logged in!');
  //     }
  //     else {
  //       console.log("No user");
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        
        try {
          await signInWithEmailAndPassword(auth, values.email, values.password);
        } catch (error) {
          console.error(error);
          return;
        }
        navigation.dispatch(StackActions.replace("inicio"));
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
          <ImageBackground
            source={image}
            resizeMode="cover"
            style={styles.image}
          >
            <Text style={styles.title}>Iniciar Sesión</Text>
            <View style={styles.inputsContainer}>
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

            </View>
            <Pressable style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
            <View style={styles.containerLine}>
              <View style={styles.line}></View>
              <Text style={styles.textLine}>O</Text>
              <View style={styles.line}></View>
            </View>
              <Pressable
                onPress={() =>
                  navigation.dispatch(StackActions.replace("Register"))
                }
              >
                <Text style={styles.link}>Registrarse</Text>
              </Pressable>
            
          </ImageBackground>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 30,
    color: "#ffffff",
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
  inputsContainer:{
    gap: 30,
    marginBottom: 30
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
  inputFocused: {
    borderColor: "#3837ea", 
    borderWidth: 2,
  },
  link: {
    fontSize: 20,
    color: "white",
    textDecorationLine: "underline",
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
