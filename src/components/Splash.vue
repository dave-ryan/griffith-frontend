<template>
  <div>
    <div class="row">
      <div class="col">
        <transition-group mode="out-in">
          <div v-if="!(contentLoaded && imgLoaded)" class="mt-5 spin" key="1">
            <div
              class="spinner-border text-secondary mt-2 mb-3 pt-5"
              style="width: 4rem; height: 4rem"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <img
            :src="src"
            class="img splash shadow sticky-top"
            v-on:load="loadedImg"
            v-show="imgLoaded && contentLoaded"
            key="2"
            alt="failed"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: 17em;
  min-height: 10em;
}
.spin {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<script>
export default {
  props: ["src", "contentLoaded", "errorMessage"],
  emits: ["splashImgLoaded"],
  data() {
    return {
      imgLoaded: false,
    };
  },
  methods: {
    loadedImg() {
      this.imgLoaded = true;
      this.$emit("splashImgLoaded");
    },
  },
};
</script>
