<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model.number="currentCategoryId" @change="getProductProps">
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block" v-for="prop in availableProductProps" :key="prop.id">
        <legend class="form__legend">{{ prop.title }}</legend>

        <ul class="colors" v-if="prop.title === 'Цвет'">
          <li class="colors__item" v-for="color in availableColors" :key="color.id">
            <label class="colors__label">
              <input class="colors__radio sr-only" type="checkbox" name="color" :value="color.title" :aria-label="color.title" @change="changeProductProps">
              <span class="colors__value" :style="{backgroundColor: color.code}"></span>
            </label>
          </li>
        </ul>
        <ul v-else class="check-list">
          <li class="check-list__item" v-for="value in prop.availableValues" :key="value.value">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" :name="prop.code" :value="value.value" @change="changeProductProps">
              <span class="check-list__desc">
                {{ value.value }}
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button v-if="isFilterSelected" class="filter__reset button button--second" type="button" @click.prevent="reset">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default {
  name: 'ProductFilter',
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      categoriesData: null,
      colorsData: null,
      currentProductProps: {},
      availableProductProps: null,
    }
  },
  props: {
    priceFrom: Number,
    priceTo: Number,
    categoryId: Number,
    productProps: Object,
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : []
    },
    colors() {
      return this.colorsData ? this.colorsData.items : []
    },
    isFilterSelected() {
      return !!this.currentPriceFrom || !!this.currentPriceTo || !!this.currentCategoryId
    },
    availableColors() {
      if(!this.availableProductProps) return []

      const colorProps = this.availableProductProps.find(prop => prop.title === 'Цвет').availableValues
      return this.colors.filter(color => {
        return colorProps.some((colorProp) => {
          return colorProp.value === color.title.replaceAll('ё', 'е');
        });
      })
    }
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    productProps(value) {
      this.currentProductProps = value;
    },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom)
      this.$emit('update:priceTo', this.currentPriceTo)
      this.$emit('update:categoryId', this.currentCategoryId)
      this.$emit('update:productProps', this.currentProductProps)
    },
    reset() {
      this.currentPriceFrom = 0;
      this.currentPriceTo = 0;
      this.currentCategoryId = 0;
      this.currentProductProps = {};
      this.availableProductProps = null;

      this.$emit('update:priceFrom', 0)
      this.$emit('update:priceTo', 0)
      this.$emit('update:categoryId', 0)
      this.$emit('update:productProps', {})
    },
    loadCategories() {
      axios.get(API_BASE_URL + '/api/productCategories')
        .then(response => this.categoriesData = response.data)
    },
    loadColors() {
      axios.get(API_BASE_URL + '/api/colors')
        .then(response => this.colorsData = response.data)
    },
    getProductProps() {
      this.currentProductProps = {};
      axios.get(API_BASE_URL + '/api/productCategories/' + this.currentCategoryId)
        .then(response => {
          this.availableProductProps = response.data.productProps
        })
    },
    changeProductProps(event) {
      const { target } = event
      if (this.currentProductProps[target.name]) {
        if(this.currentProductProps[target.name].includes(target.value)) {
          this.currentProductProps[target.name] = this.currentProductProps[target.name].filter(item => item !== target.value)
        } else {
          this.currentProductProps[target.name].push(target.value)
        }
      } else {
        this.currentProductProps[target.name] = [target.value]
      }
    }
  },
  created() {
    this.loadCategories()
    this.loadColors()

    this.currentProductProps = this.productProps
  }
};
</script>

<style scoped>

</style>
