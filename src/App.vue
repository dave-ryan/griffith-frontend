<template>
  <nav
    class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark"
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
            <span class="nav-link disabled"> Logged in as {{ userName }}</span>
          </li>
        </ul>
        <div class="text-center">
          <button class="btn btn-danger" @click="logOut()">Log Out</button>
        </div>
      </div>
    </div>
  </nav>
  <router-view @login_change="loginUpdate"></router-view>
</template>

<style>
.container {
  text-align: center;
}
.v-enter-active,
.v-leave-active {
  transition: all 1s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(25px);
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
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
button:active,
.nav-link:active {
  -webkit-animation-name: pulse;
  animation-name: pulse;
  -webkit-animation-duration: 0.1s;
  animation-duration: 0.1s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: 2;
  animation-iteration-count: 2;
  -webkit-animation-direction: alternate;
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