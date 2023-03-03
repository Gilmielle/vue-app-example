import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import { API_BASE_URL } from "@/config";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,

    cartProductsData: [],

    orderInfo: null
  },
  mutations: {
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find(item => item.productId === productId)
      if (item) {
        item.amount = amount
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)
    },
    decreaseCartProductAmount(state, productId) {
      state.cartProducts = state.cartProducts.map(item => {
        return {
          ...item,
          amount: item.productId === productId && item.amount > 1 ? item.amount -= 1 : item.amount
        }
      })
    },
    increaseCartProductAmount(state, productId) {
      state.cartProducts = state.cartProducts.map(item => {
        return {
          ...item,
          amount: item.productId === productId ? item.amount += 1 : item.amount
        }
      })
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productId: item.product.id,
          amount: item.quantity
        }
      })
    },
    resetCart(state) {
      state.cartProducts = []
      state.cartProductsData = []
    },
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find(p => p.product.id === item.productId).product

        return {
          ...item,
          product: {
            ...product,
            img: product.image.file.url
          }
        }
      })
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
    },
    cartTotalItems(state) {
      return state.cartProducts.reduce((acc, item) => Number(item.amount) + acc, 0)
    }
  },
  actions: {
    loadCart({ commit, state }) {
      return axios
        .get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: state.userAccessKey
          }
        })
        .then(response => {
          if(!state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey)
            commit('updateUserAccessKey', response.data.user.accessKey)
          }
          commit('updateCartProductsData', response.data.items)
          commit('syncCartProducts')
        })
    },
    addProductToCart({ commit, state }, { productId, amount }) {
      return axios
        .post(API_BASE_URL + '/api/baskets/products', {
        productId,
        quantity: amount
      },{
        params: {
          userAccessKey: state.userAccessKey
        }
      })
        .then((response) => {
          commit('updateCartProductsData', response.data.items)
          commit('syncCartProducts')
        })
    },
    updateCartProductAmount({ commit, state }, { productId, amount }) {
      commit('updateCartProductAmount', { productId, amount })

      if(amount < 1) {
        return
      }
      return axios
        .put(API_BASE_URL + '/api/baskets/products', {
          productId,
          quantity: amount
        },{
          params: {
            userAccessKey: state.userAccessKey
          }
        })
        .then((response) => {
          commit('updateCartProductsData', response.data.items)
        })
        .catch(() => {
          commit('syncCartProducts')
        })
    },
    deleteCartProduct({ commit, state }, productId) {
      commit('deleteCartProduct', productId)

      return axios
        .delete(API_BASE_URL + '/api/baskets/products',
          {
            params: {
              userAccessKey: state.userAccessKey
            },
            data: {
              productId,
            },
          })
        .then((response) => {
          commit('updateCartProductsData', response.data.items)
        })
        .catch(() => {
          commit('syncCartProducts')
        })
    },
    loadOrderInfo({ commit, state }, orderId) {
      return axios
        .get(API_BASE_URL + '/api/orders/' + orderId, {
          params: {
            userAccessKey: state.userAccessKey
          }
        })
        .then(response => {
          commit('updateOrderInfo', response.data)
        })
    }
  }
})
