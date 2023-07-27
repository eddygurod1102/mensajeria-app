<script setup>
  import { usuario } from '../usuario.js';
  import { watchEffect } from 'vue';
  import { reactive } from 'vue';

  const mensajes = reactive({});
  let listaMensajes = [];

  // Obtener los mensajes del usuario.
  watchEffect(async() => {
    if (usuario.value !== undefined) {
      const peticion = await fetch(`http://localhost:3000/id/${usuario.value.id}/usuario/${usuario.value.usuario}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      for await (let mensaje of await peticion.json()) {
        listaMensajes.push(mensaje);
      }
  
      mensajes.value = listaMensajes;
    }
  });
</script>
<template>
  <v-container>
    <v-list lines="two" v-if="usuario.value !== undefined" v-for="mensaje in mensajes.value">
      <div v-if="mensaje.lo_envio === usuario.value.usuario">
        <v-list-item
          :title="mensaje.conversacion_con"
          :subtitle="`Tu: ${mensaje.mensaje}`"
          :to="{name: 'inbox', params: { id1: usuario.value.id, id2: mensaje.id }}"
        ></v-list-item>
      </div>
      <div v-else>
        <v-list-item
          :title="mensaje.conversacion_con"
          :subtitle="mensaje.mensaje"
          :to="{ name:'inbox', params: { id1: usuario.value.id, id2: mensaje.id }}"
        ></v-list-item>
      </div>
    </v-list>
  </v-container>
</template>