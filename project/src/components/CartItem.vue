<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.img" width="120" height="120" :srcset="getRetinaImg(item.product.img)" :alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.product.title }}
    </h3>
    <p class="product__info" :class="item.product.product.mainProp.title === 'Цвет' ? 'product__info--color' : ''">
      {{ item.product.product.mainProp.title + ': ' }}
      <span>
        <i v-if="item.product.product.mainProp.title === 'Цвет'" :style="`background-color: ${colorCode}`"></i>
        {{ item.product.propValues['0'].value }}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{ item.product.id }}
    </span>

    <div class="product__counter form__counter">
      <CartProductCounter :action="productCounterActions.minus" :product-id="item.productId" />

      <input type="text" v-model.number="amount" name="count">

      <CartProductCounter :action="productCounterActions.plus" :product-id="item.productId" />
    </div>

    <b class="product__price">
      {{ (item.product.price * item.amount) | getPriceInRub }}
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct(item.productId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import CartProductCounter from '@/components/CartProductCounter'
import getPriceInRub from "@/helpers/getPriceInRub";
import getRetinaImg from "@/helpers/getRetinaImg";
import { mapActions } from "vuex";

export default {
  name: "CartItem",
  data() {
    return {
      productCounterActions: {
        plus: 'plus',
        minus: 'minus'
      },
      colorCode: null
    }
  },
  props: {
    item: {
      amount: Number,
      productId: Number,
      product: {
        id: Number,
        img: String,
        price: Number,
        product: Object,
        propValues: [Object],
        title: String

      }
    }
  },
  components: {
    CartProductCounter
  },
  filters: {
    getPriceInRub
  },
  methods: {
    ...mapActions({
      deleteProduct: 'deleteCartProduct'
    }),
    getRetinaImg,
    setColorCode() {
      const colorTitle = this.item.product.propValues['0'].value;
      const colorCode = this.item.product.product.colors.find(color => color.color.title.replaceAll('ё', 'е') === colorTitle.replaceAll('ё', 'е'))?.color.code
      if(colorCode) {
        this.colorCode = colorCode
      }
    }
  },
  computed: {
    amount: {
      get(){
        return this.item.amount
      },
      set(value){
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.productId, amount: value })
      }
    }
  },
  watch: {
    amount(value) {
      this.$store.dispatch('updateCartProductAmount', { productId: this.item.productId, amount: value })
    }
  },
  created() {
    this.setColorCode()
  }
}
</script>

<style scoped>

</style>
