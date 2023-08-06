<template>
  <div class="container-fluid pe-0 ps-0 mt-5 mb-5 text-center">
    <div v-if="!contentLoaded && !pageLoaded" class="mt-5">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <transition name="splash" mode="out-in">
      <div class="row" v-show="splashLoaded && pageLoaded">
        <div class="col">
          <img
            src="../assets/images/tree-cropped-compressed.jpg"
            class="img splash shadow"
            alt=""
            v-on:load="this.splashLoaded = true"
          />
        </div>
      </div>
    </transition>
    <transition name="content" mode="out-in">
      <div class="alert alert-warning" role="alert" v-if="lowPresentCount">
        You Need To Add More Things To
        <router-link to="/my-list" class="alert-link">Your List!</router-link>
        <i class="bi bi-gift ms-2"></i>
      </div>
    </transition>
    <transition name="content" mode="out-in">
      <div v-if="contentLoaded" class="row ps-2 pe-2 text-break">
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
                            user.wishedgifts &&
                            user.wishedgifts.some(
                              (item) => item.purchaser_id === me.id
                            )
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
  </div>
</template>

<style scoped>
.splash {
  object-fit: cover;
  object-position: center;
  object-position: 100% 0;
  width: 100%;
  max-height: 17em;
  min-height: 10em;
}
.row {
  --bs-gutter-x: 0;
}
</style>

<script>
import axios from "axios";
import { Toast } from "bootstrap";
import WishList from "../components/WishList.vue";

export default {
  components: { WishList },
  data: function () {
    return {
      family: [],
      everyone: [],
      secretSanta: null,
      christmasLists: {},
      contentLoaded: false,
      indexview: false,
      me: null,
      splashLoaded: false,
      pageLoaded: false,
      lowPresentCount: false,
      errorMessage: "",
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
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
        console.log("errors: ", errors.response.data.errors);
        if (errors.response.status === 401) {
          this.$root.logOut();
        }
      });
  },
  methods: {
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
    //todo: add loading wheel while we wait for patching to complete
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
          console.log(error);
          if (error) {
            this.errorMessage = error.errors;
            item.purchaser = error.purchaser;
            item.purchaser_id = error.purchaser_id;
          } else {
            this.errorMessage = this.defaultErrorMessage;
          }
          let docEl = document.getElementById("toast");
          var toast = new Toast(docEl);
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
  },
};
</script>
