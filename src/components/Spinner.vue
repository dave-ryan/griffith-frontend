<template>
  <span class="spinner-container align-middle">
    <span
      class="spinner-border text-secondary"
      :class="{
        large: size === 'large',
        'spinner-border-sm': size === 'small',
        'me-2': size === 'small',
      }"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </span>
  </span>
</template>

<style scoped>
.spinner-container {
  position: v-bind("position");
  top: v-bind("top");
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
}
.large {
  width: 3rem;
  height: 3rem;
}
</style>

<script>
export default {
  props: ["top", "position", "size"],
  created() {
    console.log("size:", this.size);
  },
};
</script>
