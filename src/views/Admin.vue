<template>
  <div class="container">
    <div v-if="!loaded">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <div v-if="loaded">
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
        <div class="col-3"></div>
        <div class="col-6">
          <div v-for="user in users" :key="user.id" class="row mb-3">
            <div class="col-6">
              {{ user.name }} - id:<strong>{{ user.id }}</strong>
              <i class="font-monospace">{{ user.is_admin ? " Admin" : "" }}</i>
            </div>

            <div class="col-6">
              <button
                type="button"
                class="btn btn-outline-success me-2"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
                @click="openEditUser(user)"
              >
                Edit
              </button>
              <button class="btn btn-outline-danger" @click="deleteUser(user)">
                Delete user
              </button>
            </div>
          </div>
        </div>
        <div class="col-3"></div>
      </div>

      <div class="row mt-3 mb-3">
        <div class="col-4"></div>
        <div class="col-4">
          <button class="btn btn-danger" @click="resetData">
            Wipe data and reseed
          </button>
        </div>
        <div class="col-4"></div>
      </div>

      <!-- Edit Modal -->
      <div
        class="modal fade"
        id="editModal"
        tabindex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" id="editingModal">
          <div class="modal-content">
            <form
              @submit.prevent="updateUser"
              id="editingUserForm"
              class="mt-5 mb-4"
              novalidate
            >
              <div class="modal-header">
                <h3 class="modal-title" id="editModalLabel">
                  Editing: {{ editingUser.name }}
                </h3>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <span class="input-group-text">Username</span>
                  <input
                    type="text"
                    v-model="editingUser.name"
                    class="form-control"
                    required
                  />
                  <div class="invalid-feedback">
                    Can't have a user without a name
                  </div>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">Family ID</span>
                  <input
                    type="text"
                    v-model="editingUser.family_id"
                    class="form-control"
                    required
                  />
                  <div class="invalid-feedback">Family ID requires</div>
                </div>
                <div v-for="family in families" :key="family.id">
                  {{ family.name }} / {{ family.id }}
                </div>
                <div
                  class="input-group mb-3"
                  v-if="editingUser.is_admin"
                  @click="flipAdmin"
                >
                  <div class="form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      value=""
                      checked
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Admin Status
                    </label>
                  </div>
                </div>
                <div
                  class="input-group mb-3"
                  v-if="!editingUser.is_admin"
                  @click="flipAdmin"
                >
                  <div class="form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      value=""
                      @click="flipAdmin"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Admin Status
                    </label>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="btn btn-success disabled"
                  data-bs-dismiss="modal"
                  v-if="!editingUser.name"
                >
                  Save changes
                </button>
                <button
                  type="submit"
                  class="btn btn-success"
                  data-bs-dismiss="modal"
                  v-if="editingUser.name"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
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
import { ErrorCodes } from "vue";
export default {
  data: function () {
    return {
      me: null,
      visible: false,
      users: [],
      editingUser: { name: "", familyid: 1, is_admin: false },
      errors: null,
      families: [],
      loaded: false,
    };
  },
  created: function () {
    this.getUsers();
  },
  methods: {
    getUsers: function () {
      axios
        .get("/users/me")
        .then((response) => {
          this.me = response.data;
          if (response.data.is_admin === false) {
            this.$router.push("/");
          } else {
            axios
              .get("/families")
              .then((response) => {
                this.families = response.data;
                this.users = response.data
                  .map((family) => family.users)
                  .flat()
                  .sort((a, b) => a.name.localeCompare(b.name));
                this.loaded = true;
              })
              .catch((errors) => {
                console.log("errors: ", errors.response.data.errors);
              });
          }
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
        });
    },
    resetData: function () {
      if (confirm("ARE YOU SURE YOU WANT TO RESET EVERYTHING???")) {
        this.loaded = false;

        axios
          .put("users/wipe", this.me)
          .then(() => {
            this.$root.logOut();
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
            this.errors = ErrorCodes.response;
            this.loaded = true;
          });
      }
    },
    openEditUser: function (user) {
      this.editingUser = user;
    },
    updateUser: function () {
      axios
        .patch(`/users/${this.editingUser.id}`, this.editingUser)
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
          this.errors = ErrorCodes.response;
        });
    },
    deleteUser: function (user) {
      if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS USER?")) {
        axios
          .delete(`/users/${user.id}`)
          .then((response) => {
            if (response.status === 200) {
              this.users = this.users.filter((remainingUser) => {
                return remainingUser.id != user.id;
              });
            }
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
          });
      }
    },
    flipAdmin: function () {
      this.editingUser.is_admin = !this.editingUser.is_admin;
    },
    secretSantaShuffle: function () {
      if (
        confirm("ARE YOU SURE YOU WANT TO SHUFFLE EVERYONE'S SECRET SANTA?")
      ) {
        axios
          .post("/secret-santa-shuffle", this.me)
          .then(() => {
            this.visible = true;
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
            this.errors = ErrorCodes.response;
          });
      }
    },
  },
};
</script>