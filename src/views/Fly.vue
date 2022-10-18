<template>
  <div class="container">
    <img src="../assets/images/loading.gif" alt="" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  created: function () {
    axios
      .get("/users")
      .then((response) => {
        if (response.status === 200 && response.data.length === 0) {
          axios.put("/users/wipe").then((r) => {
            console.log(r);
            this.$router.push("/login");
          });
        } else {
          this.$router.push("/login");
        }
      })
      .catch((error) => {
        console.log("errors", error);
      });
  },
};
</script>