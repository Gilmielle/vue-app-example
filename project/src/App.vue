<template>
  <div>
    <BaseHeader :isLoading="isLoading" />

    <router-view :isLoading="isLoading" class="page-content" />

    <BaseFooter />
  </div>
</template>

<script>

import BaseHeader from '@/components/BaseHeader';
import BaseFooter from '@/components/BaseFooter';
import { mapActions, mapMutations } from "vuex";

export default {
  name: 'App',
  data() {
    return {
      isLoading: false
    }
  },
  components: {
    BaseFooter,
    BaseHeader
  },
  methods: {
    ...mapActions({
      loadCart: 'loadCart'
    }),
    ...mapMutations({
      updateUserAccessKey: 'updateUserAccessKey'
    })
  },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey')
    if(userAccessKey) {
      this.updateUserAccessKey(userAccessKey)
    }
    this.isLoading = true
    this.loadCart().then(() => {
      this.isLoading = false
    })
  }
};
</script>

<style lang="scss">
.page-content {
  margin-top: 79px;
}
</style>
