import React from "react";
import { View, Text, TextInput, Button } from "react-native";
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
  return (
    <Formik
      initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        
        
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
        <View>
          <Text>Registro</Text>
          <TextInput
            placeholder="Nombre"
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
          />
          {touched.name && errors.name && <Text>{errors.name}</Text>}
          <TextInput
            placeholder="Correo electrónico"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
          />
          {touched.email && errors.email && <Text>{errors.email}</Text>}
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={true}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          {touched.password && errors.password && (
            <Text>{errors.password}</Text>
          )}
          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry={true}
            onChangeText={handleChange("confirmPassword")}
            onBlur={handleBlur("confirmPassword")}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text>{errors.confirmPassword}</Text>
          )}
          <Button title="Registrarse" onPress={()=>handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};
