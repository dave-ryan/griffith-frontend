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
          <div class="errors">
            {{ errors }}
          </div>
        </fieldset>
        <div>
          <button class="btn btn-warning" @click="generateUsers">SeedDb</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.errors {
  color: red;
}
</style>

<script>
import axios from "axios";
export default {
  data() {
    return {
      inputParams: {},
      errors: null,
      buttonName: "Log In",
      fieldset: null,
      family: [
        { name: "Ryan" },
        { name: "Dye/Schiefer" },
        { name: "Van Spankeren" },
        { name: "Griffith" },
      ],
      users: [
        {
          name: "David",
          password: "ryan",
          santa_group: 1,
          family_id: 1,
          mystery_santa_id: 4,
        },
        {
          name: "Corinne",
          password: "ryan",
          santa_group: 2,
          family_id: 1,
          mystery_santa_id: 2,
        },
        {
          name: "Jake",
          password: "ryan",
          santa_group: 1,
          family_id: 1,
          mystery_santa_id: 3,
        },
        {
          name: "Alice",
          password: "ryan",
          santa_group: 2,
          family_id: 1,
          mystery_santa_id: 1,
        },
        {
          name: "Don",
          password: "ryan",
          santa_group: 1,
          family_id: 1,
          mystery_santa_id: 2,
        },
        {
          name: "Justin",
          password: "labeaux",
          santa_group: 1,
          family_id: 1,
          mystery_santa_id: 2,
        },
        {
          name: "Michelle",
          password: "fogel",
          santa_group: 2,
          family_id: 1,
          mystery_santa_id: 2,
        },
        {
          name: "Hanna",
          password: "wierenga",
          santa_group: 2,
          family_id: 1,
          mystery_santa_id: 2,
        },

        {
          name: "Amy",
          password: "dye",
          santa_group: 2,
          family_id: 2,
          mystery_santa_id: 2,
        },
        {
          name: "Brent",
          password: "dye",
          santa_group: 1,
          family_id: 2,
          mystery_santa_id: 2,
        },
        { name: "Maddie", password: "dye", family_id: 2 },
        { name: "Alia", password: "dye", family_id: 2 },
        {
          name: "Gary",
          password: "schiefer",
          santa_group: 1,
          family_id: 2,
          mystery_santa_id: 2,
        },
        {
          name: "Margaret",
          password: "schiefer",
          santa_group: 2,
          family_id: 2,
          mystery_santa_id: 2,
        },
        {
          name: "Matt",
          password: "schiefer",
          santa_group: 1,
          family_id: 2,
          mystery_santa_id: 2,
        },

        {
          name: "Stefanie",
          password: "van spankeren",
          santa_group: 2,
          family_id: 3,
          mystery_santa_id: 2,
        },
        {
          name: "Melissa",
          password: "litecki",
          santa_group: 2,
          family_id: 3,
          mystery_santa_id: 2,
        },
        {
          name: "Nick",
          password: "litecki",
          santa_group: 1,
          family_id: 3,
          mystery_santa_id: 2,
        },
        {
          name: "Jane",
          password: "binkis",
          santa_group: 2,
          family_id: 3,
          mystery_santa_id: 2,
        },
        {
          name: "Tony",
          password: "binkis",
          santa_group: 1,
          family_id: 3,
          mystery_santa_id: 2,
        },
        {
          name: "Brian",
          password: "van spankeren",
          santa_group: 1,
          family_id: 3,
          mystery_santa_id: 2,
        },
        { name: "Paul", password: "van spankeren", family_id: 3 },
        { name: "Chuck", password: "griffith", family_id: 4 },
        { name: "Jerry", password: "griffith", family_id: 4 },
      ],
    };
  },
  methods: {
    seedDb: function () {
      this.family
        .forEach((params) => {
          axios.post("/families", params).then((response) => {
            console.log(response);
          });
        })
        .then(
          this.users.forEach((params) => {
            axios.post("/users", params).then((response) => {
              console.log(response);
            });
          })
        );
    },
    logIn: function () {
      this.fieldset = document.getElementById("loginFieldset");
      document.getElementById("loginForm").classList.add("was-validated");

      if (this.checkForms()) {
        this.toggleLoading();
        axios
          .post("/sessions", this.inputParams)
          .then((response) => {
            console.log("Logged in!", response);

            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.jwt;
            localStorage.setItem("jwt", response.data.jwt);
            localStorage.setItem("user_name", response.data.user_name);
            this.$emit("login_change", response.data.user_name);
            this.$router.push("/");
          })
          .catch((errors) => {
            console.log("errors", errors);
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