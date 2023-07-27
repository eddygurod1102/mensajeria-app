<script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import Boton from './Boton.vue';

  const router = useRouter();

  const nombre = ref('');
  const apellido = ref('');
  const fechaNacimiento = ref('');
  const sexo = ref('');
  const numeroTelefono = ref('');
  const correo = ref('');
  const usuario = ref('');
  const contrasena = ref('');

  const registrarse = async () => {
    // Enviarlos a la base de datos.
    const peticion = await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        fechaNacimiento: fechaNacimiento.value,
        sexo: sexo.value,
        numeroTelefono: numeroTelefono.value,
        correo: correo.value,
        usuario: usuario.value,
        contrasena: contrasena.value,
      }),
    });

    router.push({name: 'inicio'});
};
</script>

<template>
  <v-container>
    <v-form>
      <div class="text-subtitle-1 text-medium-emphasis">Nombre</div>
      <v-text-field
        v-model="nombre"
        label="Ingrese su nombre"
      >
      </v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Apellido</div>
      <v-text-field
        v-model="apellido"
        label="Ingrese su apellido"
      >
      </v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Fecha de nacimiento</div>
        <v-text-field
          v-model="fechaNacimiento"
          type="date"
        ></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">Sexo</div>
        <v-text-field
          v-model="sexo"
        ></v-text-field>
        <div class="text-subtitle-1 text-medium-emphasis">N&uacute;mero de tel&eacute;fono</div>
        <v-text-field
          v-model="numeroTelefono"
          label="Ingrese un número de teléfono válido"
        ></v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Correo electr&oacute;nico</div>
      <v-text-field
        v-model="correo"
        label="Ingrese una dirección de correo válida"
      >
      </v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Nombre de usuario</div>
      <v-text-field
        v-model="usuario"
        label="Ingrese su nombre de usuario"
      >
      </v-text-field>
      <div class="text-subtitle-1 text-medium-emphasis">Contrase&ntilde;a</div>
      <v-text-field
        v-model="contrasena"
        label="Ingrese una contraseña válida"
        type="password"
      >
      </v-text-field>    
    </v-form>
    <Boton texto="Registrarse" @accion="registrarse"/>
  </v-container>
</template>