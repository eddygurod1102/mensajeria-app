<script setup>
  import { ref } from 'vue';
import Navbar from './Navbar.vue';
  import { usuario } from './usuario';

  const drawer = ref(null);
</script>

<template>
  <v-app id="inside">
    <Navbar :usuario="usuario" />
    <v-main>
      <router-view></router-view>
      <!-- <v-container>
      </v-container> -->
    </v-main>
  </v-app>
</template>