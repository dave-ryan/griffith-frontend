<template>
  <div class="container-fluid ps-0 pe-0 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />
    <Spinner
      :visible="pageLoaded && !contentLoaded"
      top="75%"
      position="absolute"
      size="large"
    />
    <transition name="content" mode="out-in">
      <div
        v-if="pageLoaded && splashImgLoaded && !unauthorized"
        class="ps-3 pe-3 mt-5"
      >
        <div class="row">
          <div class="col"></div>
          <div class="col-lg-10">
            <h2>{{ user.name }}'s List</h2>
            <GiftList :user="user" />
          </div>
          <div class="col"></div>
        </div>
        <div class="mt-5" v-if="!currentUser">
          <router-link class="btn btn-primary" to="/login">Log In</router-link>
        </div>
      </div>
    </transition>
    <transition name="content" mode="out-in">
      <div v-if="unauthorized" class="ps-3 pe-3 mt-5">
        <h2>Sorry, wrong user or share code.</h2>
      </div>
    </transition>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";
import Splash from "../components/Splash";
import Spinner from "../components/Spinner";
import GiftList from "../components/GiftList";
import christmasTree from "../assets/images/tree-cropped-compressed.jpg";

export default {
  emits: ["onError"],
  components: { Splash, Spinner, GiftList },
  data() {
    return {
      user: null,
      pageLoaded: false,
      contentLoaded: false,
      splashSrc: christmasTree,
      unauthorized: false,
      currentUser: null,
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get("userId");
    let params = {
      share_code: urlParams.get("shareCode"),
    };
    axios
      .get(`/users/${userId}`, { params })
      .then((response) => {
        this.user = response.data;
        this.pageLoaded = true;
        this.contentLoaded = true;
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          this.unauthorized = true;
          this.pageLoaded = true;
          this.contentLoaded = true;
        } else {
          error.critical = true;
          error.function = "shareMe";
          this.$emit("onError", error);
        }
      });

    axios
      .get("/current-user")
      .then((response) => {
        this.currentUser = response.data;
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          this.currentUser = null;
        } else {
          error.critical = true;
          error.function = "getMe";
          this.$emit("onError", error);
        }
      });
  },
  methods: {},
};
</script>
