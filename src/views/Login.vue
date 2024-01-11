<template>
  <div class="container-fluid text-center" id="container">
    <div class="row">
      <transition-group name="login" mode="out-in">
        <img
          src="../assets/images/xmas2.jpg"
          alt=""
          class="background-image position-absolute top-50 start-50 translate-middle"
          style="
            height: 100%;
            object-fit: cover;
            z-index: -1;
            object-position: center;
          "
          v-show="imgLoaded"
          v-on:load="loadedImg"
          key="1"
        />
        <div
          class="col d-flex align-items-center vh-100 justify-content-center"
          v-if="imgLoaded"
          key="2"
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
                <button class="btn btn-success" type="submit" id="loginButton">
                  {{ buttonName }}
                </button>
              </div>
              <div class="text-danger mt-3">
                {{ error }}
              </div>
            </fieldset>
          </form>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.login-enter-active,
.login-leave-active {
  transition: opacity 1.5s;
}
.login-enter-from,
.login-leave-to {
  opacity: 0;
}
/* to make the valid/invalid text less jarring */
input:not(.is-invalid),
input:not(.is-valid) {
  padding-right: calc(1.5em + 0.75rem);
}
</style>

<script>
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  emits: ["onReroute"],
  data() {
    return {
      inputParams: {},
      error: null,
      imgLoaded: false,
      loading: false,
    };
  },
  computed: {
    buttonName() {
      return this.loading ? "Loading..." : "Log In";
    },
  },
  created() {
    window.addEventListener("keypress", this.enterPress);
    if (VueCookies.get("jwt")) {
      this.$emit("onReroute");
      this.$router.push("/home");
    }
  },
  methods: {
    checkForms() {
      return (
        this.inputParams?.name?.length > 0 &&
        this.inputParams?.password?.length > 0
      );
    },
    enterPress(event) {
      if (
        event.key === "Enter" &&
        document.activeElement?.id !== "name-input" &&
        document.activeElement?.id !== "password-input"
      ) {
        document.getElementById("loginButton")?.click();
      }
    },
    logIn() {
      document.getElementById("loginForm")?.classList?.add("was-validated");
      if (this.checkForms()) {
        this.error = null;
        this.toggleLoading();
        axios
          .post("/sessions", this.inputParams)
          .then((response) => {
            if (response.data && response.status === 201) {
              this.$emit("onLogin", response.data);
              window.removeEventListener("keypress", this.enterPress);
            } else {
              console.log(response);
              this.error = "Unknown Error, please tell David!";
              this.toggleLoading();
            }
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
    loadedImg() {
      this.imgLoaded = true;
    },
    toggleLoading() {
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
