<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{ productsData?.pagination?.total }} {{ productsData?.pagination?.total | getItemsCountWord }}
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo" :category-id.sync="filterCategoryId" :product-props.sync="filterProps"  />

      <section class="catalog">
        <div v-if="isLoading" class="d-flex">
          <BaseLoader class="p-relative" />
        </div>
        <div v-if="isError" class="d-flex">
          <p>Произошла ошибка при загрузке товаров</p>
          <button @click.prevent="loadProducts" class="button button--reload">
            Попробовать ещё раз
          </button>
        </div>

        <div class="items-count">
          <button
            class="items-count__btn"
            :class="btn === productsPerPage ? 'items-count__btn--is-active' : ''"
            type="button"
            v-for="(btn, index) in itemsCountBtns"
            :key="index"
            @click.prevent="handleItemsCountBtnClick(btn)"
          >
            {{ btn }}
          </button>
        </div>

        <ProductList :products="products" />

        <BasePagination v-model="page" :count="countProducts" :items-per-page="productsPerPage" />
      </section>

    </div>
  </main>
</template>

<script>
import ProductList from '@/components/Product/ProductList.vue';
import BasePagination from '@/components/Base/BasePagination.vue';
import ProductFilter from '@/components/Product/ProductFilter.vue';
import axios from "axios";
import { API_BASE_URL } from "@/config";
import BaseLoader from "@/components/Base/BaseLoader.vue";
import getItemsCountWord from "@/helpers/getItemsCountWord";

export default {
  name: 'MainPage',
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterProps: {},
      page: 1,
      productsPerPage: 9,
      productsData: null,
      isLoading: false,
      isError: false,
      itemsCountBtns: [9, 18, 27]
    }
  },
  filters: {
    getItemsCountWord
  },
  components: {
    BaseLoader,
    ProductList,
    BasePagination,
    ProductFilter
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items
          .map((product) => {
            return {
              ...product,
              img: product.preview.file.url
            }
          })
        : []
    },
    countProducts() {
      return this.productsData ? this.productsData?.pagination?.total : 0;
    }
  },
  methods: {
    loadProducts() {
      this.isLoading = true;
      this.isError = false;
      const params = {
        page: this.page,
        limit: this.productsPerPage,
        categoryId: this.filterCategoryId,
      }
      if(this.filterPriceFrom) {
        params.minPrice = this.filterPriceFrom
      }
      if(this.filterPriceTo) {
        params.maxPrice = this.filterPriceTo
      }
      if(this.filterProps) {
        params.props = this.filterProps
      }

      clearTimeout(this.loadProductsTimer)
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + '/api/products', {
            params
          })
          .then((response) => this.productsData = response.data)
          .catch(() => this.isError = true)
          .finally(() => this.isLoading = false)
      }, 0)
    },
    handleItemsCountBtnClick(itemsCount) {
      this.productsPerPage = itemsCount;
    }
  },
  watch: {
    page() {
      this.loadProducts()
    },
    filterPriceFrom() {
      this.loadProducts()
    },
    filterPriceTo() {
      this.loadProducts()
    },
    filterCategoryId() {
      this.loadProducts()
    },
    filterProps() {
      this.loadProducts()
    },
    productsPerPage() {
      this.loadProducts()
    },
    '$route.query.categoryId': {
      handler: function(categoryId) {
        if(categoryId) {
          this.filterCategoryId = categoryId
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.loadProducts()
  }
};
</script>

<style lang="scss">
.d-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.p-relative {
  position: relative;
}

.button--reload {
  background-color: #272727;
  border: 1px solid #fff;
  padding: 15px;
  color: #fff;
  font-size: 14px;
  outline: 3px solid #272727;
  transition: opacity .3s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
}

.items-count {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  column-gap: 16px;
  margin-bottom: 16px;

  &__btn {
    padding: 10px 16px;
    color: #222;
    font-size: 16px;
    font-weight: 500;
    font-family: inherit;
    background-color: #fff;
    border: 2px solid #9eff00;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &--is-active {
      background-color: #9eff00;
    }

    &:hover {
      background-color: rgba(158, 255, 0, 0.3);
    }
  }
}
</style>
