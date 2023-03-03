<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.img" :alt="product.title">
    </router-link>

      <h3 class="catalog__title">
        <a href="#">
          {{ product.title }}
        </a>
      </h3>

      <span class="catalog__price">
        {{ product.price | getPriceInRub }}
      </span>

      <ul class="colors colors--black">
        <li class="colors__item" v-for="productColor in product.colors" :key="productColor.id">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" :value="productColor.code" v-model="color">
            <span class="colors__value" :aria-label="productColor.title" :style="`background-color: ${productColor.code};`">
            </span>
          </label>
        </li>
      </ul>
  </li>
</template>

<script>
import goToPage from '@/helpers/goToPage';
import getRetinaImg from '@/helpers/getRetinaImg';
import getPriceInRub from '@/helpers/getPriceInRub';

export default {
  name: 'ProductItem',
  data() {
    return {
      color: '#73B6EA'
    }
  },
  filters: {
    getPriceInRub
  },
  props: {
    product: {
      img: String,
      title: String,
      price: Number,
      colors: Array
    },
  },
  methods: {
    getRetinaImg,
    goToPage
  }
};
</script>

<style scoped>

</style>
