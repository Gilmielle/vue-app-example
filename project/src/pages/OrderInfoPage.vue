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
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ orderInfo.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in orderInfo.basket?.items" :key="item.productOffer.product.id">
              <h3>{{ item.productOffer.title }}</h3>
              <b>{{ item.productOffer.product.price | getPriceInRub }}</b>
              <span>Артикул:</span>
              <b>{{ item.productOffer.product.id }}</b>
              <span>Количество:</span>
              <b>{{ item.quantity }}</b>
              <span>Итого: </span>
              <b>{{ (item.productOffer.price * item.quantity) | getPriceInRub }}</b>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ orderInfo.deliveryType.price | getPriceInRub }}</b></p>
            <p>Итого: <b>{{ totalItems }}</b> {{ totalItems | getItemsCountWord }} на сумму <b>{{ totalPrice | getPriceInRub }}</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import getPriceInRub from "@/helpers/getPriceInRub";
import getItemsCountWord from "@/helpers/getItemsCountWord";

export default {
  name: "OrderInfoPage",
  created() {
    if(this.$store.state.orderInfo && this.$store.state.orderInfo?.id === this.$route.params?.id) {
      return
    }

    this.$store.dispatch('loadOrderInfo', this.$route.params?.id)
  },
  computed: {
    orderInfo() {
      return this.$store.state.orderInfo || {};
    },
    totalPrice() {
      return this.orderInfo.basket.items.reduce((acc, item) => (item.productOffer.product.price * item.quantity) + acc, 0)
    },
    totalItems() {
      return this.orderInfo.basket.items.reduce((acc, item) => Number(item.quantity) + acc, 0)
    }
  },
  filters: {
    getPriceInRub,
    getItemsCountWord
  },
}
</script>

<style scoped>

</style>
