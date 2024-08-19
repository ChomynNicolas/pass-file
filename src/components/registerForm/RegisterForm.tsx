import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

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

export const RegisterForm = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);


  return (
    <Formik
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {}}
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
          <Text>Registro</Text>
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
          <Button title="Registrarse" onPress={() => handleSubmit()} />
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
    borderWidth: 2
  },
});
