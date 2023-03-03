<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" :class="{' pagination__link--disabled': page === 1}" href="#" aria-label="Предыдущая страница" @click.prevent="paginateWithArrow(directions.back)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item"  v-for="pageNumber in pages" :key="pageNumber">
      <a class="pagination__link" :class="{'pagination__link--current' : pageNumber === page}" href="#" @click.prevent="paginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow" :class="{' pagination__link--disabled': page === pages}" href="#" aria-label="Следующая страница" @click.prevent="paginateWithArrow(directions.forward)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'BasePagination',
  model: {
    prop: 'page',
    event: 'paginate'
  },
  data() {
    return {
      directions: {
        back: 'back',
        forward: 'forward',
      }
    }
  },
  props: {
    page: Number,
    count: Number,
    itemsPerPage: Number
  },
  computed: {
    pages() {
      return Math.ceil(this.count / this.itemsPerPage);
    }
  },
  methods: {
    paginate(page) {
      this.$emit('paginate', page)
    },
    paginateWithArrow(direction) {
      if(direction === this.directions.back) {
        if(this.page > 1) {
          this.$emit('paginate', this.page - 1)
        }
      } else {
        if(this.page < this.pages) {
          this.$emit('paginate', this.page + 1)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
