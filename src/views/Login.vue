<template>
  <div class="container-fluid text-center">
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
          <CreateAccount
            v-if="showCreateAccount"
            @toggleLogIn="toggleLogIn"
            @emitLogin="emitLogin"
          />
          <form
            v-if="!showCreateAccount"
            @submit.prevent="logIn"
            @onLogin="onLogin"
            id="loginForm"
            novalidate
          >
            <fieldset id="loginFieldSet">
              <h2>Griffith</h2>
              <div class="form-row mt-3 mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="name-input"
                  v-model="inputParams.name"
                  required
                  placeholder="Username"
                />
                <div class="invalid-feedback">Please enter your Username</div>
              </div>

              <div class="form-row mb-3">
                <input
                  type="password"
                  class="form-control"
                  id="password-input"
                  v-model="inputParams.password"
                  required
                  placeholder="Password"
                />
                <div class="invalid-feedback">Please enter your Password</div>
              </div>

              <div>
                <button
                  type="button"
                  class="btn btn-warning me-4"
                  @click="toggleLogIn"
                >
                  Create Account
                </button>
                <button class="btn btn-success" type="submit" id="loginButton">
                  <div :class="!loading ? 'visible' : 'invisible'">Log In</div>
                  <div
                    class="position-absolute top-50 start-50 translate-middle"
                    :class="loading ? 'visible' : 'invisible'"
                  >
                    <div
                      class="spinner-border spinner-border-sm text-light"
                    ></div>
                  </div>
                </button>
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
import CreateAccount from "../components/CreateAccount.vue";

export default {
  components: {
    CreateAccount,
  },
  emits: ["onError", "clearError", "onLogin"],
  data() {
    return {
      inputParams: {},
      imgLoaded: false,
      loading: false,
      showCreateAccount: false,
    };
  },
  created() {
    window.addEventListener("keypress", this.enterPress);
    if (VueCookies.get("jwt")) {
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
        this.$emit("clearError");
        this.toggleLoading();
        axios
          .post("/sessions", this.inputParams)
          .then((response) => {
            if (response.data && response.status === 201) {
              this.emitLogin(response.data);
              window.removeEventListener("keypress", this.enterPress);
            } else {
              this.toggleLoading();
              this.$emit("onError not 201", response.data);
            }
          })
          .catch((error) => {
            this.toggleLoading();
            error.function = "logIn";
            this.$emit("onError", error);
          });
      }
    },
    emitLogin(data) {
      this.$emit("onLogin", data);
    },
    loadedImg() {
      this.imgLoaded = true;
    },
    toggleLogIn() {
      this.showCreateAccount = !this.showCreateAccount;
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
