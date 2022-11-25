<template>
  <nav
    class="navbar fixed-top navbar-expand-md navbar-dark bg-dark"
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
          <li>
            <button
              v-if="this.$router.currentRoute.value.path === '/'"
              class="btn btn-outline-success align-middle mt-2 pt-0 pb-0 ps-1 pe-1"
              @click="expandLists"
            >
              Expand All Lists
            </button>
            <button
              v-if="this.$router.currentRoute.value.path !== '/'"
              class="btn btn-outline-success align-middle mt-2 pt-0 pb-0 ps-1 pe-1"
              disabled
            >
              Expand All Lists
            </button>
          </li>
          <li>
            <span class="nav-link disabled"> Logged in as {{ userName }}</span>
          </li>
        </ul>
        <div class="text-center">
          <button class="btn btn-danger" @click="logOut()">Log Out</button>
        </div>
      </div>
    </div>
  </nav>
  <router-view @login_change="loginUpdate"> </router-view>
</template>

<style>
.content-enter-active,
.content-leave-active {
  transition: all 0.7s ease;
}
.content-enter-from,
.content-leave-to {
  transform: translateY(15px);
  opacity: 0;
}
.splash {
  object-fit: cover;
  object-position: center;
  width: 100%;
  max-height: 17em;
  min-height: 10em;
}
.splash-enter-active,
.splash-leave-active {
  transition: all 0.7s ease;
}
.splash-enter-from,
.splash-leave-to {
  transform: none;
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
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userName: null,
      isAdmin: false,
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
    loginUpdate: function (userName) {
      this.userName = userName;
      this.isAdmin = localStorage.is_admin;
    },
    collapseBurger: function () {
      document
        .getElementById("navbarSupportedContent")
        .classList.remove("show");
    },
    expandLists: function () {
      var lists = document.getElementsByClassName("list-collapse");
      for (let i = 0; i < lists.length; i++) {
        lists[i].classList.remove("collapsed");
        lists[i].classList.remove("show");
        lists[i].classList.add("show");
      }
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
