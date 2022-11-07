<template>
  <div class="container">
    <div v-if="!loaded">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <transition>
      <div v-if="loaded">
        <div class="row mt-3">
          <div class="col-3"></div>
          <div class="col-6">
            <div v-for="user in users" :key="user.id" class="row mb-3">
              <div class="col-6">
                {{ user.name }} - id:<strong>{{ user.id }}</strong>
                <i class="font-monospace">{{
                  user.is_admin ? " Admin" : ""
                }}</i>
              </div>

              <div class="col-6">
                <button
                  type="button"
                  class="btn btn-outline-success me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  @click="openEditModal(user)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-outline-danger"
                  @click="deleteUser(user)"
                >
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
        <div class="row mb-3">
          <div class="col-4"></div>
          <div class="col-4 text-danger">{{ errors }}</div>
          <div class="col-4"></div>
        </div>
        <div class="row mb-5">
          <div class="col-4"></div>
          <div class="col-4">
            <button class="btn btn-outline-danger" @click="secretSantaShuffle">
              Secret Santa Shuffle
            </button>
          </div>
          <div class="col-4"></div>
        </div>
        <div class="row mt-3" v-if="visible">
          <div class="alert alert-success" role="alert">
            Secret Santas have been shuffled!
          </div>
        </div>

        <!-- Edit Modal -->
        <div
          class="modal fade"
          id="editModal"
          tabindex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered" id="editingModal">
            <div class="modal-content">
              <form
                @submit.prevent="updateUser(editingUser)"
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
                  <div
                    class="input-group mb-3"
                    v-if="editingUser.mystery_santa"
                  >
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="secretSantaSelector"
                        >Secret Santa</label
                      >
                    </div>
                    <select
                      id="secretSantaSelector"
                      class="custom-select"
                      v-model="editingUser.secretSantaName"
                    >
                      <option v-for="user in users" :key="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="familySelector"
                        >Family</label
                      >
                    </div>
                    <select
                      id="familySelector"
                      class="custom-select"
                      v-model="editingUser.familyName"
                    >
                      <option v-for="family in families" :key="family.id">
                        {{ family.name }}
                      </option>
                    </select>
                  </div>

                  <div class="input-group mb-3" @click="flipAdmin">
                    <div class="form-check form-check-inline">
                      <label class="form-check-label" for="">
                        Admin Status
                      </label>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        value=""
                        @click="flipAdmin"
                        v-if="!editingUser.is_admin"
                      />
                      <input
                        type="checkbox"
                        class="form-check-input"
                        checked
                        @click="flipAdmin"
                        v-if="editingUser.is_admin"
                      />
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
    </transition>
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
      editingUser: {
        name: "",
        familyid: 1,
        familyName: "",
        secretSantaName: "",
        is_admin: false,
        secretSanta: null,
      },
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
          if (!response.data.is_admin) {
            this.$root.logOut();
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
            this.errors = errors.response;
            this.loaded = true;
          });
      }
    },
    openEditModal: function (user) {
      this.editingUser = user;
      this.editingUser.familyName = user.family.name;
      this.editingUser.secretSantaName = user.mystery_santa
        ? user.mystery_santa.name
        : null;
    },
    updateUser: function (user) {
      var userParams = {
        id: user.id,
        name: user.name,
        is_admin: user.is_admin ? true : false,
      };

      this.users.forEach((loopUser) => {
        if (user.secretSantaName === loopUser.name) {
          console.log(user.secretSantaName);
          console.log(loopUser);
          userParams.mystery_santa_id = loopUser.id;
        }
      });

      this.families.forEach((family) => {
        if (family.name === user.familyName) {
          userParams.family_id = family.id;
        }
      });

      axios.patch(`/users/${userParams.id}`, userParams).catch((errors) => {
        console.log("errors: ", errors);
        this.errors = errors.response;
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
            console.log("errors: ", errors.response);
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
            this.getUsers();
          })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
            this.errors = errors.response;
          });
      }
    },
  },
};
</script>