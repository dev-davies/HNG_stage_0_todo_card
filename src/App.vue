<template>
  <TodoCard
    :id="1"
    title="Design the onboarding flow"
    description="Create wireframes and high-fidelity mockups for the new user onboarding experience, focusing on reducing time-to-value."
    priority="high"
    :tags="['work', 'urgent', 'design']"
  />
</template>

<script setup>
import TodoCard from '../TodoCard.vue'
</script>
