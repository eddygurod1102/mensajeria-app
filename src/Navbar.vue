<script setup>
  import { usuario } from '../usuario.js';
  import { ref } from 'vue';
  
  const drawer = ref(null);
  const expand = ref(false);
  defineProps(['usuario']);
  // const theme = useTheme();

  // const cambiarTema = () => {
  //   theme.global.name.value = theme.global.current.value.dark ? 'light': 'dark'
  // }
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list v-if="usuario.value === undefined">
      <v-list-item title="Iniciar sesión" to="login"></v-list-item>
      <v-list-item title="Registrarse" to="registrarse"></v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-group :value="usuario.value.usuario">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="usuario.value.usuario"
          ></v-list-item>
        </template>
        <v-list-item
          title="Cerrar sesión"
          value="1"
          @click="usuario.value = undefined"
        ></v-list-item>
      </v-list-group>
      <!-- <v-list-item :title="usuario.value.usuario">
        <template v-slot:append>
          <v-btn size="small" variant="text" icon="mdi-menu-down" @click="expand = !expand"></v-btn>
        </template>
      </v-list-item> -->
    </v-list>
  </v-navigation-drawer>
  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>MensajeriaApp</v-toolbar-title>
  </v-app-bar>
</template>