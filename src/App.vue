<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-dark text-center"
    id="navbar"
    v-if="currentRouteName !== 'Login'"
  >
    <div class="container-fluid">
      <a href="#" class="navbar-brand" v-if="currentUserName">Griffith</a>
      <router-link to="/login" class="navbar-brand" v-if="!currentUserName"
        >Griffith</router-link
      >
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

      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
        v-if="currentUserName"
      >
        <ul class="navbar-nav me-auto" @click="collapseBurger">
          <li>
            <router-link class="nav-link" to="/home"
              >Home
              <div
                v-if="$route.name === 'Home'"
                class="text-secondary fs-4 position-absolute start-50 translate-middle"
              >
                ─
              </div>
            </router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/my-list"
              >My List

              <div
                v-if="$route.name === 'My List'"
                class="text-secondary fs-4 position-absolute start-50 translate-middle"
              >
                ─
              </div>
            </router-link>
          </li>
          <li v-if="currentUser?.is_admin">
            <router-link class="nav-link" to="/admin"
              >Admin
              <div
                v-if="$route.name === 'Admin'"
                class="text-secondary fs-4 position-absolute start-50 translate-middle"
              >
                ─
              </div>
            </router-link>
          </li>

          <transition mode="out-in">
            <li
              v-if="$route.name === 'Home' && homePageLoaded && userCount"
              class="d-flex justify-content-center align-items-center ms-1"
            >
              <button
                class="btn btn-success d-grid pt-0 pb-0 ps-1 pe-1"
                @click="toggleLists"
              >
                <div
                  :class="listsExpanded ? 'invisible' : 'visible'"
                  class="stacker"
                >
                  Expand All Lists
                </div>
                <div
                  :class="listsExpanded ? 'visible' : 'invisible'"
                  class="stacker"
                >
                  Hide All Lists
                </div>
              </button>
            </li>
          </transition>
        </ul>

        <div class="nav-link disabled" v-if="currentUserName">
          Logged in as
          <span style="color: rgb(165, 165, 165)">
            {{ currentUserName }}
          </span>
        </div>
        <button class="btn btn-danger" @click="logOut()" v-if="currentUserName">
          Log Out
        </button>
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
      <div class="p-2 row">
        <div class="col-1"></div>
        <div class="col-10 text-center">
          <div v-for="message in error?.toastMessages" :key="message">
            {{ message }}
          </div>
          <div>Try Refreshing The Page</div>
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

  <router-view
    v-show="!error?.critical"
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
    <div v-if="showScrollToTopButton" class="position-fixed to-top-container">
      <button
        v-if="showScrollToTopButton"
        class="btn text-light rounded-circle to-top-btn"
        @click="scrollToTop()"
      >
        <i class="bi bi-arrow-up-short"></i>
      </button>
    </div>
  </transition>
</template>

<style>
.d-grid {
  grid-area: "stack";
}
.stacker {
  grid-area: stack;
}
body {
  overflow-y: scroll;
}
body::-webkit-scrollbar {
  width: 5px;
}
body::-webkit-scrollbar-track {
  background-color: transparent;
}
body::-webkit-scrollbar-thumb {
  background-image: linear-gradient(
    transparent,
    rgb(215, 215, 215),
    transparent
  );

  border-radius: 25px;
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
button:active:focus:not(.nopulse),
.nav-link:active:focus {
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
.to-top-container {
  bottom: 2%;
  right: 2%;
}
.to-top-btn {
  line-height: 0 !important;
  height: 44px;
  padding-left: 2px !important;
  padding-right: 2px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-size: 38.4px !important;
  background-color: rgb(85, 85, 85) !important;
}
</style>

<script>
import axios from "axios";
import { Toast } from "bootstrap";
import ErrorSplash from "./components/ErrorSplash.vue";
import VueCookies from "vue-cookies";

export default {
  components: { ErrorSplash },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  data() {
    return {
      christmasTime: false,
      currentUser: null,
      currentUserName: VueCookies.get("userName"),
      homePageLoaded: false,
      listsExpanded: false,
      userCount: null,
      scrollLimit: 150,
      showScrollToTopButton: false,
      error: null,
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
    };
  },
  created() {
    this.getCurrentUser();

    if (window.location.hostname === "localhost") {
      document.title = "Griffith - [Local]";
    }
    if (new Date().getMonth() >= 10) {
      this.christmasTime = true;
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
    getCurrentUser() {
      axios
        .get("/current-user")
        .then((response) => {
          this.currentUser = response.data;
        })
        .catch((error) => {
          if (
            error.response?.status === 401 &&
            this.$route.name !== "login" &&
            this.$route.name !== "share-list"
          ) {
            this.logOut();
          } else {
            error.critical = true;
            error.function = "getMe";
            this.$emit("onError", error);
          }
        });
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
    onHomePageLoaded(userCount) {
      this.homePageLoaded = true;
      this.userCount = userCount;
    },
    toggleLists() {
      var buttons = document.getElementsByClassName("list-button");
      for (let i = 0; i < buttons.length; i++) {
        let expandedAttr = buttons[i].getAttribute("aria-expanded");
        // aria-expanded doesn't get added as an attr until clicked
        if (
          (expandedAttr === null || expandedAttr === "false") &&
          !this.listsExpanded
        ) {
          buttons[i].click();
        } else if (expandedAttr === "true" && this.listsExpanded) {
          buttons[i].click();
        }
      }
      this.listsExpanded = !this.listsExpanded;
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
