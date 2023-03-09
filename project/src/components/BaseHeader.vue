<template>
  <header class="header">
    <div class="header__wrapper container">
      <span class="header__info">Каталог</span>

      <router-link class="header__logo" :to="{name: 'main'}">
        <img src="img/svg/logo-tech.svg" alt="Логотип интернет магазина Технозавррр" width="190" height="33">
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>

      <CartIndicator :isLoading="isLoading" />
    </div>
  </header>
</template>

<script>
import CartIndicator from '@/components/CartIndicator';
export default {
  name: 'BaseHeader',
  props: {
    isLoading: Boolean
  },
  components: {
    CartIndicator
  }
};
</script>

<style lang="scss">
.header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1000;

  &__logo {
    transition: transform 0.4s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
