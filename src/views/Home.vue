<template>
  <div class="container-fluid pe-0 ps-0 mt-5 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :contentLoaded="contentLoaded"
      :splashLoaded="splashLoaded"
      :lowPresentCount="lowPresentCount"
      @loadSplash="splashLoaded = true"
    />

    <transition name="content" mode="out-in">
      <div
        v-if="contentLoaded && splashLoaded"
        class="row ps-2 pe-2 text-break"
      >
        <div class="col">
          <div class="row mb-5 mt-5">
            <div class="col">
              <h2>
                {{ indexview ? "Everyone" : "Your Family" }}
              </h2>
              <div class="row">
                <div class="col">
                  <div
                    class="row mt-3"
                    v-for="user in indexview ? everyone : family"
                    :key="user.id"
                  >
                    <div class="col">
                      <button
                        class="btn btn-outline-success mb-1"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#christmas-list-${user.id}`"
                      >
                        {{ user.name }}
                        <i
                          class="position-absolute top-0 start-100 translate-middle bi bi-check-lg text-success ps-1 pe-1 rounded-circle bg-white border border-success"
                          v-if="
                            user.wishedgifts?.some(
                              (item) => item.purchaser_id === me.id
                            ) || findCustomGift(user)
                          "
                        ></i>
                      </button>
                      <div
                        class="collapse list-collapse"
                        aria-expanded="false"
                        :id="`christmas-list-${user.id}`"
                      >
                        <span v-if="user.wishedgifts.length < 1"
                          >{{ user.name }} hasn't made a christmas list yet!
                          Remind them! &#128578;</span
                        >
                        <WishList
                          v-for="item in user.wishedgifts"
                          :key="item.id"
                          :item="item"
                          :me="me"
                          @toggleCheckBox="toggleCheckBox(item)"
                        />
                        <div class="row">
                          <div class="col-5"></div>
                          <div class="col-2">
                            <hr class="fw-light" />
                          </div>
                          <div class="col-5"></div>
                        </div>

                        <div class="form-check form-check-inline">
                          <input
                            :id="user.id"
                            class="form-check-input"
                            type="checkbox"
                            @change="toggleCustomGiftCheckBox($event, user)"
                            :checked="findCustomGift(user)"
                          />
                          <span
                            class="text-truncate truncated"
                            v-if="findCustomGift(user)?.note"
                          >
                            {{ findCustomGift(user).note }}
                          </span>
                          <span v-else>
                            Something
                            <strong>not</strong> on {{ user.name }}'s list
                          </span>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm ms-1"
                            data-bs-toggle="modal"
                            data-bs-target="#customGiftModal"
                            @click="editCustomGift(user)"
                            v-if="findCustomGift(user)"
                          >
                            <i class="bi bi-tools"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- View Change Buttons -->
          <div class="row mb-3">
            <div class="col">
              <button
                @click="getEveryone"
                class="btn btn-outline-primary"
                v-if="!indexview"
              >
                Load Everyone's Lists
              </button>
              <button
                @click="getFamily"
                class="btn btn-outline-primary"
                v-if="indexview"
              >
                Load Your Family's List
              </button>
            </div>
          </div>

          <!-- Secret Santa Section -->
          <div class="row" v-if="secretSanta && !indexview">
            <div class="row">
              <div class="col-2 col-sm-3 col-md-4"></div>
              <div class="col-8 col-sm-6 col-md-4"><hr /></div>
              <div class="col-2 col-sm-3 col-md-4"></div>
            </div>
            <div class="row mt-2">
              <div class="col">
                <h2 class="mb-3">Your Secret Santa</h2>
                <button
                  class="btn btn-outline-success mb-1"
                  data-bs-toggle="collapse"
                  data-bs-target="#christmas-list-ss"
                >
                  {{ secretSanta.name }}
                  <i
                    class="position-absolute top-0 start-100 translate-middle bi bi-check-lg text-success ps-1 pe-1 rounded-circle bg-white border border-success"
                    v-if="
                      secretSanta.wishedgifts &&
                      secretSanta.wishedgifts.some(
                        (item) => item.purchaser_id === me.id
                      )
                    "
                  ></i>
                </button>
                <div
                  class="collapse list-collapse"
                  aria-expanded="false"
                  id="christmas-list-ss"
                >
                  <span v-if="secretSanta.wishedgifts.length === 0"
                    >{{ secretSanta.name }} hasn't made their christmas list
                    yet! Remind them! &#128578;</span
                  >
                  <WishList
                    v-for="item in secretSanta.wishedgifts"
                    :key="item.id"
                    :item="item"
                    :me="me"
                    @toggleCheckBox="toggleCheckBox(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div
      class="position-fixed top-0 start-50 translate-middle-x p-3"
      style="z-index: 1100"
    >
      <div
        id="toast"
        class="toast fade align-items-center text-white bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-delay="3500"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ errorMessage }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <div
      class="modal fade"
      id="customGiftModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered" key="loaded">
        <div class="modal-content">
          <form
            @submit.prevent="updateCustomGift"
            id="editingItemForm"
            novalidate
          >
            <div class="modal-header">
              <h5 class="modal-title">
                Something <strong>not</strong> on {{ editingUserName }}'s list
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <label class="input-group-text"
                >What are you geting {{ editingUserName }}?</label
              >
              <div class="input-group mb-2">
                <input
                  type="text"
                  v-model="editingCustomGift.note"
                  class="form-control"
                  required
                  id="customGiftInput"
                />
                <div class="invalid-feedback">
                  A note of what you are getting them might be helpful!
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="submit"
                class="btn btn-success"
                data-bs-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.row {
  --bs-gutter-x: 0;
}

.truncated {
  max-width: 200px;
  display: inline-block;
  vertical-align: top;
}
</style>

<script>
import axios from "axios";
import { Toast } from "bootstrap";
import WishList from "../components/WishList.vue";
import Splash from "../components/Splash.vue";
import { Modal } from "bootstrap";
import splashImage from "../assets/images/tree-cropped-compressed.jpg";

export default {
  components: { WishList, Splash },
  data: function () {
    return {
      family: [],
      everyone: [],
      secretSanta: null,
      christmasLists: {},
      contentLoaded: false,
      indexview: false,
      loading: false,
      me: null,
      splashLoaded: false,
      pageLoaded: false,
      lowPresentCount: false,
      editingCustomGift: {},
      editingUserName: "",
      errorMessage: "",
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
      splashSrc: splashImage,
    };
  },
  created: function () {
    axios
      .get("/users/me")
      .then((response) => {
        this.me = response.data;
        if (
          this.me.wishedgifts.reduce((total, currentgift) => {
            return currentgift.purchaser ? total : (total += 1);
          }, 0) < 4
        ) {
          this.lowPresentCount = true;
        }

        this.getFamily();
      })
      .catch((errors) => {
        if (errors.response?.status === 401) {
          this.$root.logOut();
        }
      });
  },
  methods: {
    findCustomGift(user) {
      return user.customgifts.find(
        (item) => item.customgift_purchaser_id === this.me.id
      );
    },
    getEveryone: function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.indexview = true;
      this.contentLoaded = false;
      axios
        .get("/users")
        .then((response) => {
          this.contentLoaded = true;
          var my_id = this.me.id;
          this.everyone = response.data.filter(function (user) {
            return user.id != my_id;
          });
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
        });
    },
    getFamily: function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.contentLoaded = false;
      this.indexview = false;
      axios.get(`/families/${this.me.family.id}`).then((response) => {
        this.pageLoaded = true;
        this.contentLoaded = true;
        var my_id = this.me.id;
        this.family = response.data.users
          .filter(function (user) {
            return user.id != my_id;
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      });
      this.me.mystery_santa ? this.getSecretSanta() : "";
    },
    getSecretSanta: function () {
      axios
        .get(`/users/${this.me.mystery_santa.id}`)
        .then((response) => {
          this.secretSanta = response.data;
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
        });
    },
    editCustomGift(user) {
      this.setEditingCustomGift(this.findCustomGift(user));
      this.editingUserName = user.name;
    },
    focusInput() {
      document.getElementById("customGiftInput").focus();
    },
    setEditingCustomGift(gift) {
      this.editingCustomGift = {
        id: gift.id,
        note: gift.note,
        user: gift.user,
        user_id: gift.user_id,
        customgift_purchaser: gift.customgift_purchaser,
        customgift_purchaser_id: gift.customgift_purchaser_id,
      };
      this.customGiftCopy = gift;
    },
    toggleCustomGiftCheckBox: function (event, user) {
      if (event.target.checked) {
        this.loading = true;
        let params = {
          user_id: user.id,
          customgift_purchaser_id: this.me.id,
          note: "",
        };
        let myModal = new Modal(document.getElementById("customGiftModal"), {});
        myModal.show();
        axios.post("/customgifts", params).then((response) => {
          if (response.status === 200) {
            this.setEditingCustomGift(response.data);
            this.editingUserName = response.data.user.name;
            user.customgifts.push(response.data);
            this.loading = false;
            setTimeout(() => {
              document.getElementById("customGiftInput").focus();
            }, 400);
          }
        });
      } else {
        let gift = this.findCustomGift(user);
        axios
          .delete(`/customgifts/${gift.id}`)
          .then(() => {
            gift.customgift_purchaser_id = null;
          })
          .catch((errors) => {
            console.log("errors: ", errors);
            console.log("errors: ", errors.response?.data?.errors);
          });
      }
    },
    toggleCheckBox: function (item) {
      item.loading = true;
      let purchasing = !item.purchaser_id ? true : false;
      item.purchaser_id = purchasing ? this.me.id : null;
      item.purchaser = purchasing ? this.me : null;
      axios
        .patch(`/wishedgifts/${item.id}`, {
          purchaser_id: this.me.id,
          purchasing: purchasing,
        })
        .then((response) => {
          item.purchaser_id = response.data.purchaser_id;
          item.purchaser = response.data.purchaser;
          item.loading = false;
        })
        .catch((errors) => {
          item.loading = false;
          let error = errors.response.data;
          if (error && error.purchaser) {
            this.errorMessage = error.errors;
            item.purchaser = error.purchaser;
            item.purchaser_id = error.purchaser_id;
          } else {
            this.getEveryone();
            this.errorMessage = error.errors
              ? error.errors
              : this.defaultErrorMessage;
          }
          var toast = new Toast(document.getElementById("toast"));
          toast.show();
        });
    },
    toggleChristmasList: function (user) {
      axios
        .get(`/users/${user.id}/christmaslist`)
        .then((response) => {
          this.family[user.id] = response.data;
        })
        .catch((errors) => {
          console.log("errors: ", errors.response.data.errors);
        });
    },
    updateCustomGift() {
      let id = this.editingCustomGift.id;
      let params = this.editingCustomGift;
      let user = this.family.find((user) => user.id === params.user_id);
      let editingGift = this.findCustomGift(user);
      axios
        .patch(`/customgifts/${id}`, params)
        .then((response) => {
          let newGift = response.data;
          editingGift.id = newGift.id;
          editingGift.note = newGift.note;
          editingGift.user_id = newGift.user_id;
          editingGift.customgift_purchaser = newGift.customgift_purchaser;
          editingGift.customgift_purchaser_id = newGift.customgift_purchaser_id;
        })
        .catch((errors) => {
          console.log("errors: ", errors);
          console.log("errors: ", errors.response?.data?.errors);
        });
    },
  },
};
</script>
