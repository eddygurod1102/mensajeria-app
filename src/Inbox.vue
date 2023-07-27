<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { watchEffect } from 'vue';
  import { reactive, ref } from 'vue';
  import { usuario } from '../usuario.js';

  const router = useRouter();
  const route = useRoute();
  const mensajes = reactive({});
  const mensaje = ref();
  let conversacion;
  let idConversacion;

  watchEffect(async() => {
    if (usuario.value !== undefined) {
      const peticion = await fetch(`http://localhost:3000/id1/${route.params.id1}/id2/${route.params.id2}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      conversacion = await peticion.json();
      idConversacion = conversacion['id'];
      mensajes.value = conversacion['mensajes'];
    }
  });

  const enviarMensaje = async() => {
    const peticion = await fetch(`http://localhost:3000/conversacion/${idConversacion}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensaje: mensaje.value,
        lo_envia: route.params.id1,
        lo_recibe: route.params.id2
      }),
    });
  }
</script>

<template>
  <div>
    <v-toolbar class="mt-2">
      <v-btn icon @click="router.push({name: 'inicio'})">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Hola</v-toolbar-title>
    </v-toolbar>
  </div>

  <!-- <div v-for="mensaje in mensajes.value.mensajes">
    {{ mensaje.mensaje }}
  </div> -->
  <div v-for="mensaje in mensajes.value" class="h-25">
    <div v-if="usuario.value.usuario === mensaje.lo_envio">
      <div class="pa-4 rounded-t-xl rounded-s-xl bg-primary mt-3 w-50 float-right">{{ mensaje.mensaje }}</div>
    </div>
    <div v-else>
      <div class="pa-4 rounded-t-xl rounded-e-xl bg-secondary mt-3 w-50 float-left">{{ mensaje.mensaje }}</div>
    </div>
  </div>
  <v-text-field 
    v-model="mensaje"
    label="Holaa"
  >
  </v-text-field>
  <v-btn @click="enviarMensaje">Apachurrale</v-btn>
</template>