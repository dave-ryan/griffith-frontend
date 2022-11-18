<template>
  <div class="container-fluid me-0 text-center">
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
      .catch((errors) => {
        console.log("errors", errors.response.data.errors);
        this.errors = errors.response.data.errors;
      });
  },
};
</script>