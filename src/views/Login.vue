<template>
  <div class="container-fluid text-center" id="container">
    <div class="row">
      <div class="col-4"></div>
      <transition>
        <div
          class="col-4 d-flex align-items-center vh-100 justify-content-center"
          v-show="imgLoaded"
        >
          <form @submit.prevent="logIn" id="loginForm" novalidate>
            <fieldset id="loginFieldSet">
              <h2>Griffith</h2>
              <div class="form-row mt-3 mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="name-input"
                  v-model="inputParams.name"
                  required
                  placeholder="First Name"
                />
                <div class="invalid-feedback">Please enter your first name</div>
              </div>

              <div class="form-row mb-3">
                <input
                  type="password"
                  class="form-control"
                  id="password-input"
                  v-model="inputParams.password"
                  required
                  placeholder="Last Name"
                />
                <div class="invalid-feedback">
                  Please enter your password (last name)
                </div>
              </div>

              <div>
                <button class="btn btn-success" type="submit">
                  {{ buttonName }}
                </button>
              </div>
              <div class="text-danger mt-3">
                {{ error }}
              </div>
            </fieldset>
          </form>
        </div>
      </transition>
      <div class="col-4"></div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  background-image: url("../assets/images/xmas2.jpg");
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover; /* Resize the background image to cover the entire container */
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s;
}
.v-enter-active {
  transition-delay: 0.4s;
}
input:not(.is-invalid),
input:not(.is-valid) {
  padding-right: calc(1.5em + 0.75rem);
}
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      inputParams: {},
      error: null,
      imgLoaded: false,
      loading: false,
    };
  },
  mounted() {
    var img = new Image();
    img.src = "../assets/images/xmas2.jpg";
    img.onload = function () {
      this.imgLoaded = true;
    };
    img.onload();
  },
  computed: {
    buttonName() {
      return this.loading ? "Loading..." : "Log In";
    },
  },
  methods: {
    checkForms: function () {
      return (
        this.inputParams?.name?.length > 0 &&
        this.inputParams?.password?.length > 0
      );
    },
    logIn: function () {
      document.getElementById("loginForm")?.classList?.add("was-validated");
      if (this.checkForms()) {
        this.error = null;
        this.toggleLoading();
        axios
          .post("/sessions", this.inputParams)
          .then((response) => {
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.jwt;
            localStorage.setItem("jwt", response.data.jwt);
            localStorage.setItem("is_admin", response.data.is_admin);
            localStorage.setItem("user_name", response.data.user_name);
            this.$emit("login_change", response.data.user_name);
            this.$router.push("/");
          })
          .catch((error) => {
            this.toggleLoading();
            error.toString() === "Error: Network Error"
              ? (this.error = "Server Error!! :( Please tell David!")
              : (this.error = error.response?.data?.errors);
            console.log(error);
            console.log("response: ", error.response);
          });
      }
    },
    toggleLoading: function () {
      document.getElementById("loginForm").classList?.remove("was-validated");
      this.loading = !this.loading;
      let field = document.getElementById("loginFieldSet");
      this.loading
        ? field.setAttribute("disabled", "")
        : field.removeAttribute("disabled");
    },
  },
};
</script>
