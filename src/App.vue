<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-dark text-center"
    v-if="userName && jwt"
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
          <li v-if="isAdmin === `true`">
            <router-link class="nav-link" to="/admin">Admin</router-link>
          </li>
          <transition name="splash" mode="out-in">
            <li
              v-if="
                this.$router.currentRoute?.value?.path === '/home' &&
                !this.errorMessage
              "
            >
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
          Logged in as {{ userName }}
        </div>
        <button class="btn btn-danger" @click="logOut()">Log Out</button>
      </div>
    </div>
  </nav>

  <!-- Error Section -->
  <transition name="error" mode="out-in">
    <div v-if="errorMessage" class="mt-5 row text-center">
      <div class="col"></div>
      <div class="col">
        <img src="./assets/images/errorcat.jpg" class="error-img" alt="error" />
        <h2>
          {{ errorMessage }}
        </h2>
      </div>
      <div class="col"></div>
    </div>
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
      data-bs-delay="3500"
    >
      <div class="text-center p-3">
        <span class="toast-body">
          {{ errorToast }}
        </span>
        <button
          type="button"
          class="btn-close btn-close-white float-end"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>

  <!-- Router View -->
  <router-view
    @onLogin="onLogin"
    @logOut="logOut"
    @onError="onError"
    @clearError="clearError"
    @launchErrorToast="launchErrorToast"
    :errorMessage="errorMessage"
  >
  </router-view>
</template>

<style>
.content-enter-active,
.content-leave-active {
  transition: all 0.75s ease;
}
.content-enter-from,
.content-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
.error-enter-active,
.error-leave-active {
  transition: opacity 0.75s;
}
.error-enter-from,
.error-leave-to {
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
button,
.nav-link {
  transform: perspective(1px) translateZ(0);
}
button:active,
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
</style>

<script>
import axios from "axios";
import { Toast } from "bootstrap";

export default {
  data() {
    return {
      userName: null,
      jwt: null,
      isAdmin: false,
      errorMessage: null,
      errorToast: null,
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
      routes: ["/home", "/login", "/my-list", "/admin", "/fly"],
    };
  },
  created: function () {
    if (localStorage.jwt && localStorage.user_name) {
      this.userName = localStorage.user_name;
      this.jwt = localStorage.jwt;
      this.isAdmin = localStorage.is_admin;
    } else if (window.location.pathname !== "/fly") {
      this.$router.push("/login");
    }
  },
  methods: {
    collapseBurger: function () {
      var burger = document.getElementsByClassName("navbar-collapse");
      burger[0]?.classList?.remove("show");
    },
    clearError() {
      this.errorMessage = null;
      var toast = new Toast(document.getElementById("toast"));
      toast.hide();
      this.errorToast = null;
    },
    onError(error, methodName) {
      console.log(`${methodName} error: ${error}`);
      console.log(`Message: ${error.message}`);
      console.log(`Server Response: ${error.response}`);
      this.errorMessage =
        error.response?.data?.error ||
        error.message ||
        this.defaultErrorMessage;
      this.errorMessage += " :(";
      this.launchErrorToast(this.errorMessage);
    },
    expandLists: function () {
      var lists = document.getElementsByClassName("list-collapse");
      for (let i = 0; i < lists.length; i++) {
        lists[i].classList.add("show");
      }
    },
    launchErrorToast(errorMessage) {
      this.errorToast = errorMessage;
      var toast = new Toast(document.getElementById("toast"));
      toast.show();
    },
    onLogin: function (data) {
      this.userName = data.user_name;
      this.jwt = data.jwt;
      this.isAdmin = data.is_admin;
      localStorage.setItem("user_name", data.user_name);
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("is_admin", data.is_admin);
    },
    logOut: function () {
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      this.userName = null;
      this.jwt = null;
      this.isAdmin = null;
      this.errorMessage = null;
      this.$router.push("/login");
    },
  },
};
</script>
