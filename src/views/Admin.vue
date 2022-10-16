<template>
  <div class="container">
    <form @submit.prevent="secretSantaShuffle" novalidate>
      <div class="row mb-3">
        <div class="col-4"></div>
        <div class="col-4 text-danger">{{ errors }}</div>
        <div class="col-4"></div>
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

    <div class="row mt-3">
      <div v-for="user in users" :key="user.id">
        {{ user.name }}, id: {{ user.id }}
        {{ user.is_admin ? ", Admin" : "" }}
        <button class="btn btn-warning m-1">Edit user</button>
        <button class="btn btn-danger" @click="deleteUser(user)">
          Delete user
        </button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-4"></div>
      <div class="col-4">
        <button class="btn btn-danger" @click="resetData">
          Wipe data and reseed
        </button>
      </div>
      <div class="col-4"></div>
    </div>
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
      visible: false,
      users: [],
    };
  },
  created: function () {
    this.getUsers();
  },
  methods: {
    getUsers: function () {
      axios.get("/users/me").then((response) => {
        this.me = response.data;
        console.log(response.data);
        if (this.me.name != "David") {
          this.$router.push("/");
        } else {
          axios
            .get("/users")
            .then((response) => {
              console.log(response.data);
              var my_id = this.me.id;
              this.users = response.data.filter(function (user) {
                return user.id != my_id;
              });
            })
            .catch((error) => {
              console.log("errors:", error);
            });
        }
      });
    },
    resetData: function () {
      axios.put("users/wipe", this.me).then((response) => {
        console.log(response.data);
        this.users = [];
        this.$root.logOut();
      });
    },
    deleteUser: function (user) {
      axios.delete(`/users/${user.id}`).then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.users = this.users.filter((remainingUser) => {
            return remainingUser.id != user.id;
          });
        }
      });
    },
    secretSantaShuffle: function () {
      if (
        confirm("ARE YOU SURE YOU WANT TO SHUFFLE EVERYONE'S SECRET SANTA?")
      ) {
        axios
          .post("/secret-santa-shuffle", this.me)
          .then((response) => {
            console.log(response.data);
            this.visible = true;
          })
          .catch((error) => {
            console.log("errors", error, error.response);
          });
      }
    },
  },
};
</script>