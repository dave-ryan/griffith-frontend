<template>
  <div>
    <div class="row">
      <div class="col">
        <transition-group mode="out-in">
          <div v-if="!contentLoaded && !pageLoaded" class="mt-5 pt-5" key="1">
            <div
              class="spinner-border text-secondary mt-2 mb-3 pt-5"
              style="width: 4rem; height: 4rem"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <img
            src="../assets/images/tree-cropped-compressed.jpg"
            class="img splash shadow sticky-top"
            alt=""
            v-on:load="$emit('loadSplash')"
            v-show="splashLoaded && pageLoaded"
            key="2"
          />
        </transition-group>
      </div>
    </div>

    <transition mode="out-in">
      <div
        class="alert alert-warning"
        role="alert"
        v-if="lowPresentCount && splashLoaded && pageLoaded"
      >
        You Need To Add More Things To
        <router-link to="/my-list" class="alert-link">Your List!</router-link>
        <i class="bi bi-gift ms-2"></i>
      </div>
    </transition>
  </div>
</template>

<style>
img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: 17em;
  min-height: 10em;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s;
}
.v-enter-active {
  transition-delay: 0.5s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<script>
export default {
  props: ["contentLoaded", "pageLoaded", "splashLoaded", "lowPresentCount"],
  emits: ["loadSplash"],
};
</script>
