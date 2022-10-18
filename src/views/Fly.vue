<template>
  <div class="container">
    <img v-if="!errors" src="../assets/images/loading.gif" alt="" />
    <div>{{ errors }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      errors: null,
    };
  },
  created: function () {
    axios
      .put("/users/wipe")
      .then((r) => {
        console.log(r);
        this.$router.push("/login");
      })
      .catch((error) => {
        console.log("errors", error.response.data.errors);
        this.errors = error.response.data.errors;
      });
  },
};
</script>