<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Card from './Card.vue'

const cards = Array.from(Array(100), (_, x) => `Card ${x + 1}`)

const focusedCard = ref<number>(0)
const cardsInView = ref<number[]>([])
const scrollDirection = ref<string>('none')
const scrollPosition = ref<number>(0)
const cardRefs = ref<InstanceType<typeof Card>[]>([])
const observer = ref<IntersectionObserver | null>(null)

/**
 * Handles knowing which way the user is scrolling.
 */
function handleScroll() {
  const currentScrollPosition = window.scrollY

  if (currentScrollPosition > scrollPosition.value) {
    scrollDirection.value = 'down'
  } else if (currentScrollPosition < scrollPosition.value) {
    scrollDirection.value = 'up'
  } else {
    scrollDirection.value = 'none'
  }

  scrollPosition.value = currentScrollPosition
}

// When the cards in view change, detect which way the user is scrolling
// and set the focused card based on direction.
watch(
  () => cardsInView.value,
  (newVal, oldVal) => {
    // Make sure cards are ordered.
    const ordered = newVal.sort((a, b) => a - b)

    if (scrollDirection.value === 'up') {
      focusedCard.value = ordered[ordered.length - 1]
    } else if (scrollDirection.value === 'down') {
      focusedCard.value = ordered[0]
    }
  }
)

// On mount, setup scroll/observer behavior.
onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Observe when a card is coming in/out of viewport.
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (!cardsInView.value.includes(+entry.target.id)) {
            cardsInView.value.push(+entry.target.id)
          }
        } else {
          cardsInView.value = cardsInView.value.filter((c) => c !== +entry.target.id)
        }
      })
    },
    { threshold: 1 }
  )

  // Observe each card.
  cardRefs.value.forEach((card) => {
    observer.value.observe(card.$el)
  })
})

// On unmount, remove scroll/observer behavior.
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)

  if (observer.value) observer.value.disconnect()
})
</script>

<template>
  <div>
    <Card
      v-for="(card, id) in cards"
      ref="cardRefs"
      :id="id"
      :isInFocus="id === focusedCard"
      :cardText="card"
      :key="id"
    >
      <p>{{ card }}</p>
    </Card>
  </div>
</template>

<style scoped></style>
