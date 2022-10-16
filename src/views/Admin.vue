<template>
  <div v-if="me && me.name == `David`" class="container">
    <form @submit.prevent="secretSantaShuffle" novalidate>
      <div class="row mb-3">
        <div class="col-4"></div>
        <div class="col-4">
          Password: <input type="text" class="input" v-model="password" />
        </div>
        <div class="col-4"></div>
        <div class="row">
          <div class="col-4"></div>
          <div class="col-4 text-danger">{{ errors }}</div>
          <div class="col-4"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
          <button class="btn btn-outline-danger">Secret Santa Shuffle</button>
        </div>
        <div class="col-4"></div>
      </div>
      <div class="row mt-3" v-if="visible">
        <div class="alert alert-success" role="alert">
          Secret Santas have been shuffled!
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  padding-top: 80px;
}
</style>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      me: null,
      password: "",
      failedpassword: !this.password,
      visible: false,
    };
  },
  created: function () {
    axios.get("/users/me").then((response) => {
      this.me = response.data;
      if (this.me.name != "David") {
        this.$router.push("/");
      }
    });
  },
  computed: {
    errors: function () {
      if (this.password === this.failedpassword) {
        return "Ah ah ah! You didn't say the magic word!";
      } else {
        return "";
      }
    },
  },
  methods: {
    secretSantaShuffle: function () {
      if (
        confirm("ARE YOU SURE YOU WANT TO SHUFFLE EVERYONE'S SECRET SANTA?")
      ) {
        axios
          .post("/secret-santa-shuffle", { password: this.password })
          .then((response) => {
            console.log(response.data);
            this.password = "";
            this.visible = true;
          })
          .catch((error) => {
            console.log("errors", error, error.response);
            if (error.response.status === 401) {
              this.failedpassword = this.password;
            }
          });
      }
    },
  },
};
</script>