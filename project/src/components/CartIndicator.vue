<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span v-show="totalItems" class="header__count" aria-label="Количество товаров">{{ isLoading ? '...' : totalItems }}</span>
  </router-link>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  name: 'CartIndicator',
  props: {
    isLoading: Boolean
  },
  computed: {
    ...mapGetters({
      totalItems: 'cartTotalItems'
    }),
  }
};
</script>

<style scoped>

</style>
