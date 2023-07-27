<script setup>
  defineEmits(['accion']);
  defineProps(['texto']);
</script>

<template>
  <!-- <button @click="$emit('accion')">{{ texto }}</button> -->
  <v-btn variant="outlined" @click="$emit('accion')" class="bg-green-accent-3">{{ texto }}</v-btn>
</template>