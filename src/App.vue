<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-dark text-center"
    v-if="currentUserName"
    id="navbar"
  >
    <div class="container-fluid">
      <a href="#" class="navbar-brand">Griffith</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto text-center" @click="collapseBurger">
          <li>
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/my-list">My List</router-link>
          </li>
          <li v-if="currentUser?.is_admin">
            <router-link class="nav-link" to="/admin">Admin</router-link>
          </li>

          <transition mode="out-in">
            <li v-if="$route.name === 'Home' && !error && homePageLoaded">
              <button
                class="btn btn-success align-middle ms-2 mt-2 pt-0 pb-0 ps-1 pe-1"
                @click="expandLists"
              >
                Expand All Lists
              </button>
            </li>
          </transition>
        </ul>

        <div class="nav-link disabled align-middle">
          Logged in as {{ currentUserName }}
        </div>
        <button class="btn btn-danger" @click="logOut()">Log Out</button>
      </div>
    </div>
  </nav>

  <transition mode="out-in">
    <ErrorSplash v-if="error?.critical" :error="error" />
  </transition>

  <!-- Error Toast -->
  <div
    class="toast-wrapper position-fixed top-0 start-50 translate-middle-x mt-5"
  >
    <div
      id="toast"
      class="toast fade text-white bg-danger border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-delay="4000"
    >
      <div class="text-center p-2 row">
        <div class="col-1"></div>

        <div class="col-10">
          <div v-for="message in error?.toastMessages" :key="message">
            {{ message }}
          </div>
          Try Refreshing The Page
        </div>
        <div class="col-1">
          <button
            type="button"
            class="btn-close btn-close-white pt-4"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Router View -->
  <router-view
    v-show="!error?.critical"
    @onUserLoad="onUserLoad"
    @onLogin="onLogin"
    @logOut="logOut"
    @onHomePageLoaded="onHomePageLoaded"
    @clearError="clearError"
    @onError="onError"
    :currentUser="currentUser"
    :christmasTime="christmasTime"
  >
  </router-view>

  <transition mode="out-in">
    <div
      v-if="showScrollToTopButton"
      class="position-fixed scroll-to-top-button"
    >
      <button
        v-if="showScrollToTopButton"
        class="btn btn-dark"
        @click="scrollToTop()"
      >
        <i class="bi bi-arrow-up-short"></i>
      </button>
    </div>
  </transition>
</template>

<style>
body {
  overflow-y: scroll;
}
.content-enter-active,
.content-leave-active {
  transition: all 0.75s ease;
}
.content-enter-from,
.content-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.75s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@-webkit-keyframes pulse {
  to {
    -webkit-transform: scale(1.275);
    transform: scale(1.275);
  }
}
@keyframes pulse {
  to {
    -webkit-transform: scale(1.275);
    transform: scale(1.275);
  }
}
button:not(.nopulse),
.nav-link {
  transform: perspective(1px) translateZ(0);
}
button:active:not(.nopulse),
.nav-link:active {
  animation-name: pulse;
  animation-duration: 0.15s;
  animation-timing-function: linear;
  animation-iteration-count: 2;
  animation-direction: alternate;
}
.row {
  --bs-gutter-x: 0 !important;
}
.toast-wrapper {
  z-index: 9999;
}
.error-img {
  max-width: 20rem;
}
.scroll-to-top-button {
  bottom: 2%;
  right: 2%;
}
</style>

<script>
import axios from "axios";
import { Toast } from "bootstrap";
import ErrorSplash from "./components/ErrorSplash.vue";
import VueCookies from "vue-cookies";

export default {
  components: { ErrorSplash },
  data() {
    return {
      christmasTime: false,
      currentUser: null,
      currentUserName: VueCookies.get("userName"),
      homePageLoaded: false,
      scrollLimit: 150,
      showScrollToTopButton: false,
      error: null,
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
    };
  },
  created() {
    if (new Date().getMonth() >= 10) {
      this.christmasTime = false;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    collapseBurger() {
      var burger = document.getElementsByClassName("navbar-collapse");
      burger[0]?.classList?.remove("show");
    },
    clearError() {
      this.error = null;
      let toast = new Toast(document.getElementById("toast"));
      toast.hide();
    },
    launchErrorToast() {
      let toast = new Toast(document.getElementById("toast"));
      toast.show();
    },
    onError(error) {
      this.logError(error);
      this.error = error;
      this.error.toastMessages = error.response?.data?.errors || [
          error.message,
        ] || [this.defaultErrorMessage];
      this.launchErrorToast();
    },
    onHomePageLoaded() {
      this.homePageLoaded = true;
    },
    expandLists() {
      var lists = document.getElementsByClassName("list-collapse");
      for (let i = 0; i < lists.length; i++) {
        lists[i].classList.add("show");
      }
    },
    onLogin(responseData) {
      this.currentUser = responseData.user;
      this.currentUserName = responseData.user.name;
      VueCookies.config("60d", "", "", true);
      VueCookies.set("jwt", responseData.jwt);
      VueCookies.set("userName", responseData.user?.name);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + responseData.jwt;
      this.$router.push("/home");
    },
    onUserLoad(responseData) {
      this.currentUser = responseData;
    },
    logError(error) {
      console.log("Error!", error);
      console.log("Method:", error.function);
      console.log("Config", error.config);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("data", error.response.data);
        console.log("status", error.response.status);
        console.log("headers", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("request", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("message", error.message);
      }
    },
    logOut() {
      this.$router.push("/login");
      VueCookies.remove("jwt");
      VueCookies.remove("userName");
      delete axios.defaults.headers.common["Authorization"];
      this.currentUser = null;
      this.currentUserName = null;
      this.error = null;
    },
    handleScroll() {
      if (window.scrollY > this.scrollLimit) {
        this.showScrollToTopButton = true;
      } else {
        this.showScrollToTopButton = false;
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>
