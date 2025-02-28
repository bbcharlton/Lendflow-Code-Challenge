<script setup lang="ts">
defineProps<{
  cardText: {
    type: String
    required: true
  }
  isInFocus: {
    type: Boolean
    default: false
  }
}>()

const height = (Math.random(Math.floor(Math.random() * 10)) + 1) * 100
</script>

<template>
  <div
    class="card"
    :class="{ selected: isInFocus }"
    :style="`height: ${height}px; line-height:${height}px;`"
  >
    <slot />
  </div>
</template>

<style>
.card {
  width: 200px;
  border: gray 1px solid;
  border-radius: 25px;
  margin: 0 auto;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
.selected {
  background-color: #afeeee;
}
</style>
