<template>
  <div class="row">
    <div class="col">
      <div class="splash-container">
        <transition-group mode="out-in">
          <Spinner
            :visible="!(pageLoaded && imgLoaded)"
            key="1"
            top="25%"
            position="absolute"
            size="large"
          />
          <img
            :src="src"
            class="img splash shadow"
            v-on:load="loadedImg"
            v-show="imgLoaded && pageLoaded"
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
  height: 13.5rem;
}
.splash-container {
  height: 13.5rem;
}
</style>

<script>
import Spinner from "./Spinner.vue";

export default {
  components: { Spinner },
  props: ["src", "pageLoaded"],
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
