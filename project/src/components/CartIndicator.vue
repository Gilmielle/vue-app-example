<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <transition name="slide-fade" mode="out-in">
      <span
        class="header__count"
        aria-label="Количество товаров"
        :key="totalItems"
        v-if="totalItems > 0"
      >
        {{ isLoading ? '...' : totalItems }}
      </span>
    </transition>
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

<style lang="scss">
.slide-fade {
  &-enter-active {
    transition: all .3s ease;
  }
  &-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  &-enter,
  &-leave-to {
    transform: scale(1.5);
    opacity: 0;
  }
}


.header__cart {
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #8BE000;
  }
}
</style>
