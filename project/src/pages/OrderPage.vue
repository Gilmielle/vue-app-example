<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ totalItems }} {{ totalItems | getItemsCountWord }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText title="ФИО" :error="formError.name" v-model="formData.name" name="name" placeholder="Введите ваше полное имя"/>

            <BaseFormText title="Адрес доставки" :error="formError.address" v-model="formData.address" name="address" placeholder="Адрес доставки"/>

            <BaseFormText title="Телефон" :error="formError.phone" v-model="formData.phone" type="tel" name="phone" placeholder="Введите ваш телефон"/>

            <BaseFormText title="Email" :error="formError.email" v-model="formData.email" name="email" placeholder="Введите ваш Email"/>

            <BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" v-model="formData.comment" name="comments" placeholder="Ваши пожелания" />
          </div>

          <div class="cart__options">
            <div class="cart__option-wrapper">
              <h3 class="cart__title">Доставка</h3>
              <ul class="cart__options options">
                <li class="options__item" v-for="delivery in deliveries" :key="delivery.id">
                  <label class="options__label">
                    <input class="options__radio sr-only" type="radio" name="deliveryTypeId" :value="delivery.id" v-model="formData.deliveryTypeId">
                    <span class="options__value">
                      {{ delivery.title }}
                      <b>{{ delivery.price !== '0' ? delivery.price : 'бесплатно' }}</b>
                    </span>
                  </label>
                </li>
              </ul>
              <span class="form__error" v-if="formError.deliveryTypeId">{{ formError.deliveryTypeId }}</span>
            </div>

            <transition name="slide-down-fade" mode="out-in">
              <div class="cart__option-wrapper" v-if="payments.length" :key="payments.length">
                <h3 class="cart__title">Оплата</h3>
                <ul class="cart__options options">
                  <li class="options__item" v-for="payment in payments" :key="payment.id">
                    <label class="options__label">
                      <input class="options__radio sr-only" type="radio" name="paymentTypeId" :value="payment.id" v-model="formData.paymentTypeId">
                      <span class="options__value">
                        {{ payment.title }}
                      </span>
                    </label>
                  </li>
                </ul>
                <span class="form__error" v-if="formError.paymentTypeId">{{ formError.paymentTypeId }}</span>
              </div>
            </transition>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products" :key="item.productId">
              <h3>{{ item.product.title }}</h3>
              <b>{{ item.product.price | getPriceInRub }}</b>
              <span>Артикул:</span>
              <b>{{ item.productId }}</b>
              <span>Количество:</span>
              <b>{{ item.amount }}</b>
              <span>Итого: </span>
              <b>{{ (item.product.price * item.amount) | getPriceInRub }}</b>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ deliveryPrice | getPriceInRub }}</b></p>
            <p>Итого: <b>{{ totalItems }}</b> {{ totalItems | getItemsCountWord }} на сумму <b>{{ totalPrice | getPriceInRub }}</b></p>
          </div>

          <button class="cart__button button button--primery button--animated" type="submit">
            Оформить заказ
          </button>
        </div>
        <div v-if="isLoading" class="d-flex">
          <BaseLoader class="p-relative" />
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseLoader from "@/components/Base/BaseLoader.vue";
import BaseFormText from "@/components/Base/BaseFormText.vue";
import BaseFormTextarea from "@/components/Base/BaseFormTextarea.vue";
import { mapGetters } from "vuex";
import getPriceInRub from "@/helpers/getPriceInRub";
import getItemsCountWord from "@/helpers/getItemsCountWord";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default {
  name: "OrderPage",
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      isLoading: false,
      deliveries: [],
      payments: [],
    }
  },
  filters: {
    getPriceInRub,
    getItemsCountWord
  },
  components: {
    BaseFormText,
    BaseFormTextarea,
    BaseLoader
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalItems: 'cartTotalItems'
    }),
    deliveryPrice() {
      return this.deliveries.find(delivery => delivery.id === this.formData.deliveryTypeId)?.price || 0
    }
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = ''
      this.isLoading = true;

      axios
        .post(API_BASE_URL + '/api/orders', {
          ...this.formData
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey
          }
        })
        .then(response => {
          this.$store.commit('resetCart')
          this.$store.commit('updateOrderInfo', response.data)
          this.$router.push({name: 'orderInfo', params: { id: response.data.id }})
        })
        .catch(error => {
          this.formError = error.response.data.error.request || {}
          this.formErrorMessage = error.response.data.error.message || ''
        })
        .finally(() => this.isLoading = false)
    },
    getDeliveries() {
      axios
        .get(API_BASE_URL + '/api/deliveries')
        .then((res) => {
          this.deliveries = res.data
        })
    }
  },
  created() {
    this.getDeliveries()
  },
  watch: {
    'formData.deliveryTypeId'(deliveryTypeId) {
      axios
        .get(API_BASE_URL + '/api/payments', {
          params: {
            deliveryTypeId
          }
        })
        .then((res) => {
          this.payments = res.data
        })
    }
  }
}
</script>

<style lang="scss">
.cart__option-wrapper {
  position: relative;

  &:not(:last-child) {
    margin-bottom: 40px;
  }
}

.slide-down-fade {

  &-enter-active {
    transition: all .3s ease;
  }

  &-leave-active {
    transition: all .6s ease;
  }

  &-enter,
  &-leave-to {
    transform: translateY(-10%);
    opacity: 0;
  }
}
</style>
