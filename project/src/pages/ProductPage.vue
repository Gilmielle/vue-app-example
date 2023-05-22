<template>
  <div v-if="isLoading" class="d-flex">
    <BaseLoader class="p-relative" />
  </div>

  <div v-else-if="isError" class="d-flex">
    <p>Произошла ошибка при загрузке товара</p>
    <button @click.prevent="loadProduct" class="button button--reload">
      Попробовать ещё раз
    </button>
  </div>

  <main class="content container" v-else-if="productData">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main', query: {categoryId: category.id}}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img ref="productImg" width="570" height="570" :src="product.img" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <b class="item__price" ref="productPrice">
              {{ product.price | getPriceInRub }}
            </b>

            <fieldset class="form__block" v-if="availableColors.length">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="(color, index) in availableColors" :key="color.color.id">
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio" name="color-item"
                      :value="color.color.id"
                      @change="handleColorChange(color.color)"
                      :checked="index === 0"
                    >
                    <span class="colors__value" :aria-label="color.color.title" :style="`background-color: ${color.color.code};`"></span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block" v-else>
              <legend class="form__legend">{{ product.mainProp.title }}</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item" v-for="(offer, index) in product.offers" :key="offer.id">
                  <label class="sizes__label">
                    <input
                      class="sizes__radio sr-only"
                      type="radio"
                      :name="offer.propValues['0'].productProp.title"
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
            </fieldset>

            <div class="item__row">
              <div class="form__counter">

                <button type="button" aria-label="Убрать один товар" @click.prevent="decreaseProductAmount">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model="productAmount">

                <button type="button" aria-label="Добавить один товар" @click.prevent="increaseProductAmount">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery button--animated" type="submit" :disabled="productAddSending">
                В корзину
              </button>

              <div class="grid-col-span-2">
                <div v-if="productAdded">Товар добавлен в корзину</div>
                <div v-else-if="productAddSending">Добавляем товар в корзину...</div>
                <div v-else-if="productAddFailed">Что-то пошло не так, попробуйте позже</div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" v-for="(tab, index) in tabNames" :key="index">
            <a class="tabs__link" :class="index === currentTab ? 'tabs__link--current' : ''" @click.prevent="handleTabChange(index)">
              {{ tab }}
            </a>
          </li>
        </ul>

        <div class="item__content" v-show="currentTab === 0">
          {{ product.content }}
        </div>
        <div class="item__content" v-show="currentTab === 1">
          <div v-for="spec in product.specifications" :key="spec.id">
            <h3>{{ spec.title }}</h3>

            <p>
              {{ spec.value }}
            </p>
          </div>
        </div>
        <div class="item__content" v-show="currentTab === 2">
          Раздел находится в разработке
        </div>
        <div class="item__content" v-show="currentTab === 3">
          Раздел находится в разработке
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import BaseLoader from "@/components/Base/BaseLoader.vue";
import getPriceInRub from '@/helpers/getPriceInRub';
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { mapActions } from "vuex";
import getAvailableColors from "@/helpers/getAvailableColors";

export default {
  name: 'ProductPage',
  data() {
    return {
      productAmount: 1,
      productData: null,
      productOfferId: null,
      productColorId: null,
      isLoading: false,
      isError: false,
      productAdded: false,
      productAddSending: false,
      productAddFailed: false,
      currentTab: 0,
      tabNames: [
        'Описание',
        'Характеристики',
        'Гарантия',
        'Оплата и доставка'
      ]
    }
  },
  filters: {
    getPriceInRub
  },
  components: {
    BaseLoader
  },
  computed: {
    product() {
      return {
        ...this.productData,
        img: this.productData.preview.file.url
      }
    },
    category() {
      return this.productData.category
    },
    availableColors() {
      return getAvailableColors(this.product)
    }
  },
  methods: {
    ...mapActions({
      addProductToCart: 'addProductToCart'
    }),
    handleTabChange(currentTabIndex) {
      this.currentTab = currentTabIndex
    },
    handleColorChange(checkedColor) {
      const colorData = this.product.colors.filter(item => item.color.id === checkedColor)
      if(colorData.gallery) {
        this.$refs.productImg.src = colorData.gallery
      }

      this.productColorId = checkedColor.id

      this.productOfferId = this.product.offers.find(offer => offer.propValues['0'].value.replaceAll('ё', 'е') === checkedColor.title.replaceAll('ё', 'е'))?.id
    },
    handleOfferChange(offerId) {
      this.productData.price = this.product.offers.find(offer => offer.id === offerId)?.price
      this.productOfferId = offerId
    },
    addToCart() {
      this.productAdded = false
      this.productAddSending = true
      this.productAddFailed = false

      this.addProductToCart({
        productId: this.product.id,
        amount: this.productAmount,
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
    decreaseProductAmount() {
      if(this.productAmount > 1) {
        this.productAmount -= 1
      }
    },
    increaseProductAmount() {
      this.productAmount = Number(this.productAmount) + 1
    },
    loadProduct() {
      this.isLoading = true;
      this.isError = false;
      return axios.get(API_BASE_URL + '/api/products/' + this.$route.params.id)
        .then((response) => this.productData = response.data)
        .catch(() => this.isError = true)
        .finally(() => this.isLoading = false)
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct().then((res) => {
          if(this.availableColors.length) {
            this.productColorId = this.availableColors[0].color.id
          } else {
            this.productColorId = res.colors[0].color.id
          }
          this.productOfferId = res.offers[0].id
        })
      },
      immediate: true
    },
    productAmount(newValue, oldValue) {
      const regex = /\D/g;
      if (String(newValue).match(regex)) {
        this.productAmount = Number(oldValue)
      }
    }
  }
};
</script>

<style lang="scss">
.grid-col-span-2 {
  grid-column: span 2;
}

.button--animated {
  position: relative;
  overflow: hidden;
  transition: color .2s, background .2s;

  &::after {
    content: '';
    top: 0;
    transform: translate(100%, 100%);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;

    /*
    CSS Gradient - complete browser support from http://www.colorzilla.com/gradient-editor/
    */
    background: -moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(128,186,232,0) 99%, rgba(125,185,232,0) 100%); /* FF3.6+ */
    background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,0)), color-stop(50%,rgba(255,255,255,0.8)), color-stop(99%,rgba(128,186,232,0)), color-stop(100%,rgba(125,185,232,0))); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* Opera 11.10+ */
    background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* IE10+ */
    background: linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%,rgba(128,186,232,0) 99%,rgba(125,185,232,0) 100%); /* W3C */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#007db9e8',GradientType=1 ); /* IE6-9 */
  }

  &:hover {
    animation: scale 0.5s infinite alternate, backgroundGradient 1s infinite alternate;

    &::after {
      animation: slide 2s infinite;
    }
  }
}

@keyframes scale {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

@keyframes slide {
  0% {transform:translateX(-200%);}
  100% {transform:translateX(100%);}
}
</style>
