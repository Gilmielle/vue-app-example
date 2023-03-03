<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo" :category-id.sync="filterCategoryId" :color-id.sync="filterColorId"  />

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

        <ProductList :products="products" />

        <BasePagination v-model="page" :count="countProducts" :items-per-page="productsPerPage" />
      </section>

    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList';
import BasePagination from '@/components/BasePagination';
import ProductFilter from '@/components/ProductFilter';
import axios from "axios";
import { API_BASE_URL } from "@/config";
import BaseLoader from "@/components/BaseLoader";

export default {
  name: 'MainPage',
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorId: 0,
      page: 1,
      productsPerPage: 3,
      productsData: null,
      isLoading: false,
      isError: false
    }
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
              img: product.image.file.url
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
      clearTimeout(this.loadProductsTimer)
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + '/api/products', {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              colorId: this.filterColorId
            }
          })
          .then((response) => this.productsData = response.data)
          .catch(() => this.isError = true)
          .finally(() => this.isLoading = false)
      }, 0)
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
    filterColorId() {
      this.loadProducts()
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
</style>
