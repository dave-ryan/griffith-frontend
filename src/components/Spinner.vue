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
  position: absolute;
  top: v-bind("topPosition");
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<script>
export default {
  props: ["topPosition"],
};
</script>
