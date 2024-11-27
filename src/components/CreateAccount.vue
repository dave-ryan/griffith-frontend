<template>
  <div>
    <form @submit.prevent="createAccount" id="createAccountForm" novalidate>
      <fieldset id="createAccountFieldSet">
        <h2>Create Your Account</h2>
        <div class="form-row mt-3 mb-3">
          <input
            type="text"
            class="form-control"
            id="create-name-input"
            v-model="inputParams.name"
            required
            placeholder="Username"
          />
          <div class="invalid-feedback">Please enter your desired username</div>
        </div>

        <div class="form-row mb-3">
          <input
            type="text"
            class="form-control"
            id="create-password-input"
            v-model="inputParams.password"
            required
            placeholder="Password"
          />
          <div class="invalid-feedback">Please enter your desired password</div>
        </div>

        <button type="button" class="btn btn-warning me-4" @click="toggleLogIn">
          Log In
        </button>
        <button class="btn btn-success" type="submit" id="createAccountButton">
          {{ buttonName }}
        </button>
      </fieldset>
    </form>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";

export default {
  emits: ["onError", "clearError", "toggleLogIn", "onLogin"],
  computed: {
    buttonName() {
      return this.loading ? "Loading..." : "Create Account";
    },
  },
  data() {
    return {
      inputParams: {},
      loading: false,
    };
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
        document.activeElement?.id !== "create-name-input" &&
        document.activeElement?.id !== "create-password-input"
      ) {
        document.getElementById("createAccountButton")?.click();
      }
    },
    createAccount() {
      document
        .getElementById("createAccountForm")
        ?.classList?.add("was-validated");
      if (this.checkForms()) {
        this.toggleLoading();
        axios
          .post("/users", this.inputParams)
          .then((response) => {
            if (response.data && response.status === 200) {
              axios
                .post("/sessions", this.inputParams)
                .then((response) => {
                  if (response.data && response.status === 201) {
                    this.$emit("emitLogin", response.data);
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
            } else {
              this.toggleLoading();
              throw new Error("Error");
            }
          })
          .catch((error) => {
            this.toggleLoading();
            error.function = "createAccount";
            console.log(error);
            this.$emit("onError", error);
          });
      }
    },
    toggleLogIn() {
      this.$emit("toggleLogIn");
    },
    toggleLoading() {
      document
        .getElementById("createAccountForm")
        .classList?.remove("was-validated");
      this.loading = !this.loading;
      let field = document.getElementById("createAccountFieldSet");
      this.loading
        ? field.setAttribute("disabled", "")
        : field.removeAttribute("disabled");
    },
  },
};
</script>
