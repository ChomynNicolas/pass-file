import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Pressable } from "react-native";
import { Formik } from "formik";
import { firebase } from "../../../firebase/config";
import { getAuth,  signInWithEmailAndPassword  } from "firebase/auth";
import { StackActions } from "@react-navigation/native";

import { NavigationProp } from "@react-navigation/native";

interface Props {
  navigation: NavigationProp<any>;
}


export const LoginForm = ({ navigation }: Props) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values, actions) => {
        const auth = getAuth();
        try {
          await signInWithEmailAndPassword(auth, values.email, values.password)
          
        } catch (error) {
          console.error(error);
          return
        }
        navigation.dispatch(StackActions.replace("Home"));
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
          <Text>Iniciar Sesión</Text>

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

          <Button title="Iniciar Sesión" onPress={() => handleSubmit()} />
          <Text>
            
            <Pressable onPress={() => navigation.dispatch(StackActions.replace("Register"))}>
              <Text>Registrarse</Text>
            </Pressable>
          </Text>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#3837ea", // Color del borde cuando no está enfocado
    borderRadius: 5,
    width: 200,
  },
  errorText: {
    marginBottom: 5,
    color: "#ff2c15",
  },
  inputFocused: {
    borderColor: "#3837ea", // Color del borde cuando está enfocado
    borderWidth: 2,
  },
});
