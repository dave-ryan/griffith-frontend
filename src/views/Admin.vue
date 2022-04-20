<template>
  <div v-if="me && me.id == `1`" class="container">
    <button class="btn btn-outline-danger" @click="secretSantaShuffle">
      Click to shuffle the secret santas around
    </button>
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
    return { me: null };
  },
  created: function () {
    axios.get("/users/me").then((response) => {
      this.me = response.data;
      if (this.me.id != 1) {
        this.$router.push("/");
      }
    });
  },
  methods: {
    secretSantaShuffle: function () {
      if (
        confirm("ARE YOU SURE YOU WANT TO SHUFFLE EVERYONE'S SECRET SANTA?")
      ) {
        axios.post("/secret-santa-shuffle").then((response) => {
          console.log(response.data);
        });
      }
    },
  },
};
</script>