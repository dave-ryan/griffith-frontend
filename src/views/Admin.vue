<template>
  <div class="container-fluid ps-0 pe-0 text-center">
    <Splash
      :src="splashSrc"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />

    <transition name="content" mode="out-in">
      <div v-if="currentUser && splashImgLoaded && pageLoaded" class="mt-5">
        <div class="row mt-5">
          <h2>Admin</h2>
          <!-- Endpoints -->
          <div class="col-4"></div>
          <div class="col-4">
            <button
              class="btn btn-success m-2"
              data-bs-toggle="modal"
              data-bs-target="#createUser"
            >
              Create User
            </button>
            <button
              class="btn btn-outline-success m-2"
              data-bs-toggle="modal"
              data-bs-target="#createFamily"
            >
              Create Family
            </button>
          </div>
          <div class="col-4"></div>
        </div>
        <div class="row">
          <div class="col-2"></div>
          <div class="col-8">
            <button class="btn btn-danger m-2" @click="resetData">
              Wipe data and reseed
            </button>
            <button class="btn btn-danger m-2" @click="cleanupGifts">
              Cleanup Gifts from Last Year
            </button>
            <button class="btn btn-outline-danger" @click="secretSantaShuffle">
              Secret Santa Shuffle
            </button>
          </div>
          <div class="col-2"></div>
        </div>
        <div class="row" v-if="visible">
          <div class="alert alert-success" role="alert">
            Secret Santas have been shuffled!
          </div>
        </div>
        <div class="row">
          <div class="col">
            <button class="btn btn-warning m-2" @click="testGetUsers">
              GET /users
            </button>
            <button class="btn btn-warning m-2" @click="testGetMe">
              GET /me
            </button>
            <button class="btn btn-warning m-2" @click="testGetFamilies">
              GET /families
            </button>
          </div>
        </div>

        <!-- Edit Users -->
        <div class="row mt-5">
          <h4>Users</h4>
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
                  data-bs-target="#editUserModal"
                  @click="editUser(user)"
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

        <!-- Edit Families -->
        <div class="row mt-5">
          <div v-for="family in families" :key="family.id" class="col">
            {{ family.name }} - id:<strong>{{ family.id }}</strong>
            <div class="row">
              <div class="col">
                <button
                  type="button"
                  class="btn btn-outline-success m-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editFamily"
                  @click="editFamily(family)"
                >
                  Edit Family
                </button>
                <button
                  class="btn btn-outline-danger"
                  @click="deleteFamily(family)"
                >
                  Delete Family
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Secret Santa Map -->
        <div class="row mb-5 mt-5">
          <div class="col-1"></div>
          <div class="col-5 m-1">
            <h4>Men</h4>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">User</th>
                  <th scope="col">Buying For:</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in men" :key="user.id">
                  <th scope="row">{{ user.id }}</th>
                  <td>{{ user.name }}</td>
                  <td>{{ user.mystery_santa?.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-5 m-1">
            <h4>Women</h4>
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">User</th>
                  <th scope="col">Buying For:</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in women" :key="user.id">
                  <th scope="row">{{ user.id }}</th>
                  <td>{{ user.name }}</td>
                  <td>{{ user.mystery_santa?.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-1"></div>
        </div>

        <!-- Create Family Modal -->
        <div
          class="modal fade"
          id="createFamily"
          tabindex="-1"
          aria-labelledby="newFamilyModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div
            class="modal-dialog modal-dialog-centered"
            id="createFamilyModal"
          >
            <div class="modal-content">
              <form
                @submit.prevent="createFamily(newFamilyParams)"
                id="newFamilyParamsForm"
                novalidate
              >
                <div class="modal-header">
                  <h3 class="modal-title" id="createFamilyLabel">
                    Create a new Family
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
                    <span class="input-group-text">Family Name</span>
                    <input
                      type="text"
                      v-model="newFamilyParams.name"
                      class="form-control"
                      required
                    />
                    <div class="invalid-feedback">Must have a family name</div>
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
                    v-if="!newFamilyParams.name"
                  >
                    Create Family
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    v-if="newFamilyParams.name"
                  >
                    Create Family
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Edit Family Modal -->
        <div
          class="modal fade"
          id="editFamily"
          tabindex="-1"
          aria-labelledby="newFamilyModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered" id="editFamilyModal">
            <div class="modal-content">
              <form
                @submit.prevent="updateFamily(editFamilyParams)"
                id="editFamilyParamsForm"
                novalidate
              >
                <div class="modal-header">
                  <h3 class="modal-title" id="editFamilyLabel">
                    Editing: {{ editFamilyParams.name }}
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
                    <span class="input-group-text">Family Name</span>
                    <input
                      type="text"
                      v-model="editFamilyParams.name"
                      class="form-control"
                      required
                    />
                    <div class="invalid-feedback">Must have a family name</div>
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
                    v-if="!editFamilyParams.name"
                  >
                    Save Changes
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    v-if="editFamilyParams.name"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Create User Modal -->
        <div
          class="modal fade"
          id="createUser"
          tabindex="-1"
          aria-labelledby="createUserLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered" id="createUserModal">
            <div class="modal-content">
              <form
                @submit.prevent="createUser(newUserParams)"
                id="newUserParamsForm"
                novalidate
              >
                <div class="modal-header">
                  <h3 class="modal-title" id="createModalLabel">
                    Create a new user
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
                      v-model="newUserParams.name"
                      class="form-control"
                      required
                    />
                    <div class="invalid-feedback">
                      Can't have a user without a name
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text">New Password</span>
                    <input
                      type="text"
                      v-model="newUserParams.password"
                      class="form-control"
                      required
                    />
                    <div class="invalid-feedback">You need a password!</div>
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
                      v-model="newUserParams.familyName"
                    >
                      <option v-for="family in families" :key="family.id">
                        {{ family.name }}
                      </option>
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="santaGroupSelector"
                        >Santa Group</label
                      >
                    </div>
                    <select
                      required
                      id="santaGroupSelector"
                      class="custom-select"
                      v-model="newUserParams.santa_group"
                    >
                      <option>1 - Male</option>
                      <option>2 - Female</option>
                      <option>3 - Non-Participant</option>
                    </select>
                    <div class="invalid-feedback">Select a santa group</div>
                  </div>

                  <div
                    class="input-group mb-3"
                    v-if="
                      newUserParams.santa_group === '1 - Male' ||
                      newUserParams.santa_group === '2 - Female'
                    "
                  >
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="secretSantaSelector"
                        >Secret Santa</label
                      >
                    </div>
                    <select
                      required
                      id="secretSantaSelector"
                      class="custom-select"
                      v-model="newUserParams.secretSantaName"
                    >
                      <option v-for="user in users" :key="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                    <div class="invalid-feedback">
                      A user must have someone to buy a gift for
                    </div>
                  </div>

                  <div
                    class="input-group mb-3"
                    @click="flipAdmin(newUserParams)"
                  >
                    <div class="form-check form-check-inline">
                      <label class="form-check-label" for="">
                        Admin Status
                      </label>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        value=""
                        @click="flipAdmin(newUserParams)"
                        v-if="!newUserParams.is_admin"
                      />
                      <input
                        type="checkbox"
                        class="form-check-input"
                        checked
                        @click="flipAdmin(newUserParams)"
                        v-if="newUserParams.is_admin"
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
                    v-if="
                      !newUserParams.name ||
                      !newUserParams.santa_group ||
                      !newUserParams.password ||
                      !newUserParams.familyName
                    "
                  >
                    Create User
                  </button>
                  <button
                    type="submit"
                    class="btn btn-success"
                    data-bs-dismiss="modal"
                    v-if="
                      newUserParams.name &&
                      newUserParams.santa_group &&
                      newUserParams.password &&
                      newUserParams.familyName
                    "
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Edit User Modal -->
        <div
          class="modal fade"
          id="editUserModal"
          tabindex="-1"
          aria-labelledby="editUserModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div class="modal-dialog modal-dialog-centered" id="editingModal">
            <div class="modal-content">
              <form
                @submit.prevent="updateUser(editingUser)"
                id="editingUserForm"
                novalidate
              >
                <div class="modal-header">
                  <h3 class="modal-title" id="editUserModalLabel">
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
                    <span class="input-group-text">New Password</span>
                    <input
                      type="text"
                      v-model="editingUser.password"
                      class="form-control"
                    />
                  </div>
                  <div class="input-group mb-3" v-if="editingUser.santa_group">
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
                      <label class="input-group-text" for="secretSantaSelector"
                        >Santa Group</label
                      >
                    </div>
                    <select
                      id="santaGroupSelector"
                      class="custom-select"
                      v-model="editingUser.santa_group"
                    >
                      <option value="1">1 - Male</option>
                      <option value="2">2 - Female</option>
                      <option :value="null">
                        Null - Not doing secret santa
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

                  <div class="input-group mb-3" @click="flipAdmin(editingUser)">
                    <div class="form-check form-check-inline">
                      <label class="form-check-label" for="">
                        Admin Status
                      </label>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        value=""
                        @click="flipAdmin(editingUser)"
                        v-if="!editingUser.is_admin"
                      />
                      <input
                        type="checkbox"
                        class="form-check-input"
                        checked
                        @click="flipAdmin(editingUser)"
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

<style scoped></style>

<script>
import axios from "axios";
import Splash from "../components/Splash";
import splashImage from "../assets/images/snowman.jpg";

export default {
  components: { Splash },
  emits: ["logOut", "onError", "clearError"],
  props: ["currentUser"],
  data() {
    return {
      visible: false,
      users: [],
      editingUser: {},
      editFamilyParams: {},
      newUserParams: {},
      newFamilyParams: {},
      errors: null,
      families: [],
      splashSrc: splashImage,
      pageLoaded: false,
      splashImgLoaded: false,
    };
  },
  created() {
    if (this.currentUser?.is_admin) {
      this.getUsers();
    } else {
      this.$router.push("/home");
    }
  },
  computed: {
    men() {
      return this.users.filter((user) => {
        return user.santa_group === 1;
      });
    },
    women() {
      return this.users.filter((user) => {
        return user.santa_group === 2;
      });
    },
  },
  methods: {
    cleanupGifts() {
      axios
        .put("/admin/wishedgifts-cleanup")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          error.function = "cleanupGifts";
          this.$emit("onError", error);
        });
    },
    createFamily(familyParams) {
      axios
        .post("/families", familyParams)
        .then((response) => {
          console.log(response.data);
          this.families.push(familyParams);
        })
        .catch((error) => {
          error.function = "createFamily";
          this.$emit("onError", error);
        });
    },
    createUser(userParams) {
      userParams.santa_group = parseInt(userParams.santa_group.charAt());
      this.families.forEach((family) => {
        if (family.name === userParams.familyName) {
          userParams.family_id = family.id;
        }
      });
      if (userParams.is_admin === "true") {
        userParams.is_admin = true;
      }
      this.users.forEach((user) => {
        if (user.name === userParams.secretSantaName) {
          userParams.mystery_santa_id = user.id;
        }
      });
      console.log("user params: ", userParams);
      axios
        .post("/users", userParams)
        .then((response) => {
          console.log(response.data);
          this.users.push(userParams);
        })
        .catch((error) => {
          error.function = "createUser";
          this.$emit("onError", error);
        });
    },
    deleteFamily(family) {
      if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS FAMILY?")) {
        axios
          .delete(`/families/${family.id}`)
          .then((response) => {
            console.log(response.data);
            if (response.status === 200) {
              this.families = this.families.filter((remainingfamily) => {
                return remainingfamily.id != family.id;
              });
            }
          })
          .catch((error) => {
            error.function = "deleteFamily";
            this.$emit("onError", error);
          });
      }
    },
    deleteUser(user) {
      if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS USER?")) {
        axios
          .delete(`/users/${user.id}`)
          .then((response) => {
            console.log(response.data);

            if (response.status === 200) {
              this.users = this.users.filter((remainingUser) => {
                return remainingUser.id != user.id;
              });
            }
          })
          .catch((error) => {
            error.function = "deleteUser";
            this.$emit("onError", error);
          });
      }
    },
    editFamily(family) {
      this.editFamilyParams = family;
    },
    editUser(user) {
      this.editingUser = user;
      this.editingUser.familyName = user.family.name;
      this.editingUser.secretSantaName = user.mystery_santa
        ? user.mystery_santa.name
        : null;
    },
    flipAdmin(user) {
      user.is_admin = !user.is_admin;
    },
    getUsers() {
      axios
        .get("/admin/families")
        .then((response) => {
          console.log(response.data);
          this.families = response.data;
          this.users = response.data
            .map((family) => family.users)
            .flat()
            .sort((a, b) => a.name.localeCompare(b.name));
          this.pageLoaded = true;
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getUsers";
          this.$emit("onError", error);
        });
    },
    resetData() {
      if (confirm("ARE YOU SURE YOU WANT TO RESET EVERYTHING???")) {
        axios
          .put("admin/reboot")
          .then(() => {
            this.$emit("logOut");
          })
          .catch((error) => {
            error.function = "resetData";
            this.$emit("onError", error);
          });
      }
    },
    secretSantaShuffle() {
      if (
        confirm("ARE YOU SURE YOU WANT TO SHUFFLE EVERYONE'S SECRET SANTA?")
      ) {
        axios
          .put("/admin/secret-santa-shuffle")
          .then((response) => {
            console.log(response.data);
            this.visible = true;
            this.getUsers();
          })
          .catch((error) => {
            error.function = "secretSantaShuffle";
            this.$emit("onError", error);
          });
      }
    },
    testGetUsers() {
      this.$emit("clearError");
      axios
        .get("/users")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          error.function = "testGetUsers";
          this.$emit("onError", error);
        });
    },
    testGetMe() {
      this.$emit("clearError");
      axios
        .get("/users/me")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          error.function = "testGetMe";
          this.$emit("onError", error);
        });
    },
    testGetFamilies() {
      this.$emit("clearError");
      axios
        .get("/families")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          error.function = "testGetFamilies";
          this.$emit("onError", error);
        });
    },
    updateFamily(family) {
      axios
        .patch(`/families/${family.id}`, family)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          error.function = "updateFamily";
          this.$emit("onError", error);
        });
    },
    updateUser(user) {
      var userParams = {
        id: user.id,
        name: user.name,
        is_admin: user.is_admin ? true : false,
        santa_group: user.santa_group,
      };

      console.log("santa group:", user.santa_group);
      console.log("password", user.password);

      if (user.password !== "" && user.password) {
        console.log("password changed");
        userParams.password = user.password;
      }

      this.users.forEach((loopUser) => {
        if (user.secretSantaName === loopUser.name) {
          console.log(user.secretSantaName);
          console.log(loopUser);
          userParams.mystery_santa_id = loopUser.id;
        }
      });

      if (!userParams.santa_group) {
        userParams.mystery_santa_id = null;
      }

      this.families.forEach((family) => {
        if (family.name === user.familyName) {
          userParams.family_id = family.id;
        }
      });

      axios
        .patch(`/users/${userParams.id}`, userParams)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          error.function = "updateUser";
          this.$emit("onError", error);
        });
    },
  },
};
</script>
