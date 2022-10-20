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
        <ul class="navbar-nav">
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
      </div>
      <span class="nav-item">
        <router-link class="nav-link" to="" @click="logOut()"
          >Log Out</router-link
        >
      </span>
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