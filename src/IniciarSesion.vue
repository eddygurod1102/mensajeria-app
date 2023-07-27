<script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { usuario } from '../usuario.js';
  import Boton from './Boton.vue';

  const router = useRouter();

  // Datos del formulario.
  const nombreUsuario = ref('');
  const contrasena = ref('');

  // Iniciar sesión en el sitio web.
  const login = async () => {

    // Obtener los datos del usuario en función de los datos anteriores.
    const peticion = await fetch('http://localhost:3000/obtener_usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: nombreUsuario.value,
        contrasena: contrasena.value
      }),
    });
    
    if (peticion.ok) {
      usuario.value = await peticion.json();
      router.push({name: 'inicio'});
    } else {
      alert('Ocurrió un error. Vuelva a intentarlo más tarde.');

      // Limpiar datos del formulario.
      nombreUsuario.value = '';
      contrasena.value = '';
    }
  };
</script>

<template>
  <v-container>
    <v-form>
      <div class="text-subtitle-1 text-medium-emphasis">Usuario</div>
      <v-text-field
        v-model="nombreUsuario"
        label="Ingresa tu nombre de usuario"
      ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Contrase&ntilde;a</div>
      <v-text-field
        v-model="contrasena"
        label="Ingresa tu contraseña"
        type="password"
      ></v-text-field>
    </v-form>
    <Boton texto="Iniciar sesión" @accion="login" />
  </v-container>
</template>