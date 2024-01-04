<template>
  <span>
    <transition mode="out-in" name="spinner">
      <span class="spinner-container align-middle" v-if="visible">
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
    </transition>
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

.spinner-enter-active {
  transition: opacity 3s;
}
.spinner-enter-from {
  opacity: 0;
}
.spinner-leave-active {
  display: none;
}
</style>

<script>
export default {
  props: ["top", "position", "size", "visible"],
};
</script>
