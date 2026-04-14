<template>
  <TodoCard
    :id="1"
    title="Drink more Coke"
    description="Ensure there's a steady supply of ice-cold Coke in the fridge to stay refreshed, boost productivity, and enjoy the crisp, bubbly feeling throughout all coding sessions."
    priority="high"
    :tags="['personal', 'urgent', 'refreshment']"
  />
</template>

<script setup>
import TodoCard from '../TodoCard.vue'
</script>
