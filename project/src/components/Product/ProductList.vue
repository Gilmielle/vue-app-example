<template>
  <ul class="catalog__list">
    <li is="ProductItem" v-for="product in products" :key="product.id" :product="product" />
  </ul>
</template>

<script>
import ProductItem from '@/components/Product/ProductItem.vue';
export default {
  name: 'ProductList',
  components: {
    ProductItem
  },
  props: {
    products: Array,
  }
};
</script>

<style scoped>

</style>
