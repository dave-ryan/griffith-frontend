<template>
  <div>
    <form @submit.prevent="createAccount" id="createAccountForm" novalidate>
      <fieldset id="createAccountFieldSet">
        <h2>Create Your Account</h2>
        <div class="input-group mt-3 mb-3">
          <label class="input-group-text" for="create-name">Username</label>
          <input
            type="text"
            class="form-control"
            id="create-name"
            v-model="newUser.name"
            required
            placeholder="Username"
          />
          <div class="invalid-feedback">
            <span v-if="duplicate"> A User with that name already exists </span>
            <span v-if="!duplicate"> Please enter your new username </span>
          </div>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="create-password">Password</label>
          <input
            type="text"
            class="form-control"
            id="create-password"
            v-model="newUser.password"
            required
            placeholder="Password"
          />
          <div class="invalid-feedback">Please enter your new password</div>
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="birthday">Birthday</label>
          <input
            id="create-birthday"
            v-model="newUser.birthday"
            class="form-control"
            type="date"
            required
          />
          <div class="invalid-feedback">Birthday is required</div>
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
      newUser: {},
      loading: false,
      duplicate: false,
    };
  },
  methods: {
    checkForms() {
      return (
        this.newUser?.name?.length &&
        this.newUser?.password?.length &&
        this.newUser?.birthday?.length
      );
    },
    createAccount() {
      document
        .getElementById("createAccountForm")
        ?.classList?.add("was-validated");
      if (this.checkForms()) {
        this.toggleLoading();
        axios
          .post("/users", this.newUser)
          .then((response) => {
            if (response.data && response.status === 200) {
              axios
                .post("/sessions", this.newUser)
                .then((response) => {
                  if (response.data && response.status === 201) {
                    this.$emit("emitLogin", response.data);
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
            this.$emit("onError", error);
            if (error.response?.status === 409) {
              this.duplicate = true;
              document
                .getElementById("create-name")
                .classList.add("is-invalid");
            }
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
