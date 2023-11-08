<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-dark text-center"
    v-if="userName"
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
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/my-list">My List</router-link>
          </li>
          <li v-if="isAdmin === `true`">
            <router-link class="nav-link" to="/admin">Admin</router-link>
          </li>
          <transition name="splash" mode="out-in">
            <li v-if="this.$router.currentRoute.value.path === '/'">
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
  <div class="position-fixed top-0 start-50 translate-middle-x mt-5">
    <div
      id="toast"
      class="toast fade align-items-center text-white bg-danger border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-delay="3500"
    >
      <div class="d-flex p-2">
        <div
          class="toast-body position-absolute top-50 start-50 translate-middle"
        >
          {{ errorMessage }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>

  <!-- Router View -->
  <router-view
    @login_change="loginUpdate"
    @logOut="logOut"
    @onError="onError"
    :errorMessage="errorMessage"
  >
  </router-view>
</template>

<style>
.content-enter-active,
.content-leave-active {
  transition: all 1s ease;
}
.content-enter-from,
.content-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

.error-enter-active,
.error-leave-active {
  transition: opacity 0.3s;
}
.error-enter-active {
  transition-delay: 0.3s;
}
.error-enter-from,
.error-leave-to {
  opacity: 0;
}

@-webkit-keyframes pulse {
  to {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
@keyframes pulse {
  to {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
button,
.nav-link {
  transform: perspective(1px) translateZ(0);
}
button:active,
button:focus,
.nav-link:active,
.nav-link:focus {
  animation-name: pulse;
  animation-duration: 0.1s;
  animation-timing-function: linear;
  animation-iteration-count: 2;
  animation-direction: alternate;
}
.row {
  --bs-gutter-x: 0 !important;
}
.toast {
  z-index: 1100;
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
      isAdmin: false,
      errorMessage: null,
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
    };
  },
  created: function () {
    if (localStorage.jwt && localStorage.user_name) {
      this.userName = localStorage.user_name;
      this.isAdmin = localStorage.is_admin;
    } else if (window.location.pathname !== "/fly") {
      this.$router.push("/login");
    }
  },
  methods: {
    collapseBurger: function () {
      var burger = document.getElementsByClassName("navbar-collapse");
      burger[0].classList.remove("show");
    },
    onError(error, methodName) {
      console.log(`${methodName} error: ${error}`);
      console.log(`Message: ${error.message}`);
      console.log(`Rails error: ${error.response?.data?.error}`);
      this.errorMessage =
        error.response?.data?.error ||
        error.message ||
        this.defaultErrorMessage;
      this.errorMessage += " :(";
      var toast = new Toast(document.getElementById("toast"));
      toast.show();
    },
    expandLists: function () {
      var lists = document.getElementsByClassName("list-collapse");
      for (let i = 0; i < lists.length; i++) {
        lists[i].classList.add("show");
      }
    },
    loginUpdate: function (userName) {
      this.userName = userName;
      this.isAdmin = localStorage.is_admin;
    },
    logOut: function () {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("jwt");
      localStorage.removeItem("user_name");
      localStorage.removeItem("is_admin");
      this.userName = null;
      this.$router.push("/login");
    },
  },
};
</script>
