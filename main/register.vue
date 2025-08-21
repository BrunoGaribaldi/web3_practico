<template> 
    <div>
        <input v-model="name" placeholder="Escribe tu nombre"/>
        <p>Hola, {{ name }}</p>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
</script>