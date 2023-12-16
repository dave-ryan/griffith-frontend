<template>
  <div class="spin">
    <div
      class="spinner-border text-secondary"
      style="width: 3.5rem; height: 3.5rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.spin {
  position: v-bind("position");
  top: v-bind("top");
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1100;
}
</style>

<script>
export default {
  props: ["top", "position"],
};
</script>
