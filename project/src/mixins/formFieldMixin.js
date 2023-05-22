import BaseFormField from "@/components/Base/BaseFormField.vue";

export default {
  props: {
    title: String,
    error: String,
    placeholder: String,
    name: String,
    value: String
  },
  components: {
    BaseFormField
  },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
