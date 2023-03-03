<template>
  <button v-if="action === 'minus'" type="button" aria-label="Убрать один товар" @click.prevent="decreaseAmount(productId)">
    <svg width="10" height="10" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

  <button v-else type="button" aria-label="Добавить один товар" @click.prevent="increaseAmount(productId)">
    <svg width="10" height="10" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "ProductCounter",
  props: {
    action: String,
    productId: Number
  },
  methods: {
    ...mapMutations({
      decreaseAmount: 'decreaseCartProductAmount',
      increaseAmount: 'increaseCartProductAmount'
    }),
  }
}
</script>

<style scoped>

</style>
