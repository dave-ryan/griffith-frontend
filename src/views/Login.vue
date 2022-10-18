<template>
  <div class="container">
    <div class="d-flex align-items-center vh-100 justify-content-center">
      <form @submit.prevent="logIn" id="loginForm" novalidate>
        <fieldset id="loginFieldset">
          <h2>Griffith</h2>

          <div class="row g-3 align-items-center mb-2 mt-2">
            <div class="col-auto">
              <label class="form-label" for="name-input">First Name</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                class="form-control form-control-sm"
                id="name-input"
                v-model="inputParams.name"
                required
              />
              <div class="invalid-feedback">Please enter your first name</div>
            </div>
          </div>

          <div class="row g-3 align-items-center mb-2">
            <div class="col-auto">
              <label class="form-label" for="password-input">Password</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                class="form-control form-control-sm"
                id="password-input"
                v-model="inputParams.password"
                required
              />
              <div class="invalid-feedback">
                Please enter your password (last name)
              </div>
            </div>
          </div>

          <div>
            <button class="btn btn-success" type="submit">
              {{ buttonName }}
            </button>
          </div>
          <div class="text-danger">
            {{ errors }}
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      inputParams: {},
      errors: null,
      buttonName: "Log In",
      fieldset: null,
    };
  },
  methods: {
    logIn: function () {
      this.fieldset = document.getElementById("loginFieldset");
      document.getElementById("loginForm").classList.add("was-validated");

      if (this.checkForms()) {
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
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
            document
              .getElementById("loginForm")
              .classList.remove("was-validated");
            this.errors = errors.response.data.error;
            this.fieldset.removeAttribute("disabled");
            this.buttonName = "Log In";
          });
      }
    },
    toggleLoading: function () {
      this.errors = null;
      this.fieldset.setAttribute("disabled", "");
      this.buttonName = "Loading...";
    },
    checkForms: function () {
      if (
        this.inputParams["name"] &&
        this.inputParams["name"].length > 0 &&
        this.inputParams["password"] &&
        this.inputParams["password"].length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>