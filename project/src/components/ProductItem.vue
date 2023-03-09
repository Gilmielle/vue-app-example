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
      {{ productPrice | getPriceInRub }}
    </span>

    <ul class="colors colors--black" v-if="availableColors.length">
      <li class="colors__item" v-for="(productColor, index) in availableColors" :key="productColor.color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :name="`color-item-${product.id}`"
            :value="productColor.color.id"
            @change="handleColorChange(productColor.color)"
            :checked="index === 0"
          >
          <span class="colors__value" :aria-label="productColor.color.title" :style="`background-color: ${productColor.color.code};`">
          </span>
        </label>
      </li>
    </ul>

    <ul class="sizes sizes--primery" v-else>
      <li class="sizes__item sizes__item--black" v-for="(offer, index) in product.offers" :key="offer.id">
        <label class="sizes__label">
          <input
            class="sizes__radio sr-only"
            type="radio"
            :name="`${offer.propValues['0'].productProp.title}-${product.id}`"
            :value="offer.id"
            @change="handleOfferChange(offer.id)"
            :checked="index === 0"
          >
          <span class="sizes__value">
            {{ offer.propValues['0'].value }}
          </span>
        </label>
      </li>
    </ul>

    <button class="button button--blank catalog__btn" type="button" @click.prevent="addToCart" :disabled="productAddSending">
      В корзину
    </button>

    <div v-if="productAdded">Товар добавлен в корзину</div>
    <div v-else-if="productAddSending">Добавляем товар в корзину...</div>
    <div v-else-if="productAddFailed">Что-то пошло не так, попробуйте позже</div>
  </li>
</template>

<script>
import goToPage from '@/helpers/goToPage';
import getRetinaImg from '@/helpers/getRetinaImg';
import getPriceInRub from '@/helpers/getPriceInRub';
import getAvailableColors from "@/helpers/getAvailableColors";
import { mapActions } from "vuex";

export default {
  name: 'ProductItem',
  data() {
    return {
      productPrice: null,
      productColorId: null,
      productOfferId: null,
      productAdded: false,
      productAddSending: false,
      productAddFailed: false,
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
    ...mapActions({
      addProductToCart: 'addProductToCart'
    }),
    getRetinaImg,
    goToPage,
    handleColorChange(checkedColor) {
      const colorData = this.product.colors.filter(item => item.color.id === checkedColor)
      if(colorData.gallery) {
        this.$refs.productImg.src = colorData.gallery
      }

      this.productColorId = checkedColor.id

      this.productOfferId = this.product.offers.find(offer => offer.propValues['0'].value.replaceAll('ё', 'е') === checkedColor.title.replaceAll('ё', 'е'))?.id
    },
    handleOfferChange(offerId) {
      this.productPrice = this.product.offers.find(offer => offer.id === offerId)?.price
      this.productOfferId = offerId
    },
    addToCart() {
      this.productAdded = false
      this.productAddSending = true
      this.productAddFailed = false

      this.addProductToCart({
        productId: this.product.id,
        amount: 1,
        productOfferId: this.productOfferId,
        colorId: this.productColorId
      })
        .then(() => {
          this.productAdded = true
        })
        .catch(() => {
          this.productAddFailed = true
        })
        .finally(() => {
          this.productAddSending = false
        })
    },
  },
  computed: {
    availableColors() {
      return getAvailableColors(this.product)
    }
  },
  mounted() {
    this.productPrice = this.product.price
    if(this.availableColors.length) {
      this.productColorId = this.availableColors[0].color.id
    } else {
      this.productColorId = this.product.colors[0].color.id
    }
    this.productOfferId = this.product.offers[0].id
  }
};
</script>

<style lang="scss">
.catalog__btn {
  margin-top: 16px;
}

.sizes__item--black {

  .sizes__radio {

    &:checked~.sizes__value {
      color: #222222;
    }
  }

  .sizes__label:focus .sizes__value,
  .sizes__label:hover .sizes__value {
    color: #595959;
  }
}

.button--blank {
  border: 1px solid #222;

  &:hover {
    background-color: #595959;
    color: #fff;
  }
}
</style>
