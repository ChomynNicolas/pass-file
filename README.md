## Configuración de Firebase

Para configurar Firebase en tu proyecto, sigue los siguientes pasos:

### Renombrar el archivo de configuración

1. Navega a la carpeta `firebase` y localiza el archivo `config.js.template`.
2. Cambia el nombre de este archivo a `config.js`.

### Actualizar los valores de configuración

1. Abre el archivo `firebase/config.js` en tu editor de código.
2. Reemplaza los valores predeterminados en el objeto `firebaseConfig` con los valores que te proporciona Firebase. El archivo debería verse algo similar a esto:

   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_AUTH_DOMAIN",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_STORAGE_BUCKET",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID",
     measurementId: "TU_MEASUREMENT_ID"
   };
