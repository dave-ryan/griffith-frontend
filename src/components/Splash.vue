<template>
  <div class="row">
    <div class="col">
      <transition-group mode="out-in">
        <Spinner
          v-if="!(contentLoaded && imgLoaded && pageLoaded)"
          key="1"
          top="25%"
          position="absolute"
        />
        <img
          :src="src"
          class="img splash shadow sticky-top"
          v-on:load="loadedImg"
          v-show="(imgLoaded && pageLoaded) || (imgLoaded && contentLoaded)"
          key="2"
          alt="failed"
        />
      </transition-group>
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
</style>

<script>
import Spinner from "./Spinner.vue";

export default {
  components: { Spinner },
  props: ["src", "contentLoaded", "pageLoaded"],
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
      console.log(1);
    },
  },
};
</script>
