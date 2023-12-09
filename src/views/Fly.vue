<template>
  <div class="container-fluid me-0 text-center">
    <div v-if="!errors" class="mt-5 pt-5">
      <div
        class="spinner-border text-secondary mt-2 mb-3 pt-5"
        style="width: 4rem; height: 4rem"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
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
  created() {
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
