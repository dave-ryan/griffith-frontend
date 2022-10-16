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
      seedFamily: [
        { name: "Ryan" },
        { name: "Dye/Schiefer" },
        { name: "Van Spankeren" },
        { name: "Griffith" },
      ],
      seedUsers: [
        {
          name: "David",
          password: "kaom",
          santa_group: 1,
          family_id: 1,
          mystery_santa_id: 4,
          is_admin: true,
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
    resetData: async function () {
      axios.put("users/wipe", this.me).then((response) => {
        console.log(response.data);
        this.users = [];
      });
      await this.seedAllFamilies();
    },
    seedAllFamilies: async function () {
      this.seedFamily.forEach((params) => {
        console.log(params);
        axios.post("/families", params).then((response) => {
          console.log(response);
        });
      });
      await this.seedAllUsers();
    },
    seedAllUsers: async function () {
      this.seedUsers.forEach((params) => {
        console.log(params);
        axios.post("/users", params).then((response) => {
          console.log(response);
        });
      });
      await this.$root.logOut();
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