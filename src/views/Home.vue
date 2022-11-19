<template>
  <div class="container-fluid m-0 pe-0 ps-0 pb-5 text-center">
    <div v-if="!contentloaded && wheelgif" class="pt-5">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <transition name="splashTransition" mode="out-in">
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
    <transition name="splashTransition" mode="out-in">
      <div class="row" v-show="!splashLoaded && pageLoaded">
        <div class="col">
          <img
            src="../assets/images/tree-cropped-blurred.jpg"
            class="img splash shadow"
            alt=""
            v-on:load="this.splashLoaded = true"
          />
        </div>
      </div>
    </transition>

    <transition mode="out-in">
      <div v-if="contentLoaded" class="row pt-5">
        <div class="col">
          <div class="row mb-5">
            <div class="col">
              <h3 v-if="indexview">Everyone</h3>
              <h3 v-if="!indexview">Your Family</h3>
              <div v-if="indexview" class="row">
                <div class="col">
                  <div
                    class="row mt-3"
                    v-for="user in everyone"
                    :key="`everyone-` + user.id"
                  >
                    <div class="col">
                      <button
                        class="btn btn-outline-success"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#birthday-list-${user.id}`"
                      >
                        {{ user.name }}
                      </button>
                      <i
                        class="bi bi-check-lg text-success"
                        v-if="
                          user.wishedgifts &&
                          user.wishedgifts.some(
                            (item) => item.purchaser_id === me.id
                          )
                        "
                      ></i>
                      <div
                        class="collapse"
                        aria-expanded="false"
                        :id="`birthday-list-${user.id}`"
                      >
                        <span v-if="user.wishedgifts.length < 1"
                          >this person hasn't made their christmas list yet!
                          remind them! :)</span
                        >
                        <div
                          v-for="item in user.wishedgifts"
                          :key="`everyitem` + item.id"
                        >
                          <div
                            v-if="item.purchaser && item.purchaser_id != me.id"
                          >
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                checked
                                :id="`birthday-checkbox-` + item.id"
                                disabled
                              />
                              <label
                                class="form-check-label"
                                :for="`birthday-checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                              <span class="text-danger">
                                purchased by {{ item.purchaser.name }}
                              </span>
                            </div>
                          </div>
                          <div
                            v-else-if="
                              item.purchaser_id && item.purchaser_id === me.id
                            "
                          >
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                checked
                                @click="toggleCheckBox(item)"
                                :id="`birthday-checkbox-` + item.id"
                              />
                              <label
                                class="form-check-label"
                                :for="`birthday-checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                              <span class="text-success">
                                purchased by you!</span
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                @click="toggleCheckBox(item)"
                                :id="`checkbox-` + item.id"
                              />
                              <label
                                class="form-check-label"
                                :for="`checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!indexview" class="row">
                <div class="col">
                  <div class="row mt-3" v-for="user in family" :key="user.id">
                    <div class="col">
                      <button
                        class="btn btn-outline-success"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#christmas-list-${user.id}`"
                      >
                        {{ user.name }}
                      </button>
                      <i
                        class="bi bi-check-lg text-success"
                        v-if="
                          user.wishedgifts &&
                          user.wishedgifts.some(
                            (item) => item.purchaser_id === me.id
                          )
                        "
                      ></i>
                      <div
                        class="collapse"
                        aria-expanded="false"
                        :id="`christmas-list-${user.id}`"
                      >
                        <span v-if="user.wishedgifts.length < 1"
                          >this person hasn't made their christmas list yet!
                          remind them! :)</span
                        >
                        <div v-for="item in user.wishedgifts" :key="item.id">
                          <div
                            v-if="item.purchaser && item.purchaser_id != me.id"
                          >
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                checked
                                :id="`checkbox-` + item.id"
                                disabled
                              />
                              <label
                                class="form-check-label"
                                :for="`checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                              <span class="text-danger">
                                purchased by {{ item.purchaser.name }}
                              </span>
                            </div>
                          </div>
                          <div
                            v-else-if="
                              item.purchaser_id && item.purchaser_id === me.id
                            "
                          >
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                checked
                                @click="toggleCheckBox(item)"
                                :id="`checkbox-` + item.id"
                              />
                              <label
                                class="form-check-label"
                                :for="`checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                              <span class="text-success">
                                purchased by you!</span
                              >
                            </div>
                          </div>
                          <div v-else>
                            <div class="form-check form-check-inline">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value=""
                                @click="toggleCheckBox(item)"
                                :id="`checkbox-` + item.id"
                              />
                              <label
                                class="form-check-label"
                                :for="`checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link || item.purchaser_id">
                                  -
                                </span>
                                <a
                                  v-if="item.link"
                                  :href="
                                    `//` + item.link.replace(/^https?:\/\//, '')
                                  "
                                  target="_blank"
                                  >link</a
                                >
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-5">
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
          <div class="row" v-if="secretSanta && !indexview">
            <div class="ps-5 pe-5">
              <hr class="ps-5 pe-5" />
            </div>
            <div class="col mt-2">
              <h3 class="mb-3">Your Secret Santa</h3>
              <button
                class="btn btn-outline-success"
                data-bs-toggle="collapse"
                data-bs-target="#christmas-list-ss"
              >
                {{ secretSanta.name }}
              </button>
              <div
                class="collapse"
                aria-expanded="false"
                id="christmas-list-ss"
              >
                <span v-if="secretSanta.wishedgifts.length === 0"
                  >this person hasn't made their christmas list yet! remind
                  them! :)</span
                >
                <div v-for="item in secretSanta.wishedgifts" :key="item.id">
                  <div v-if="item.purchaser && item.purchaser_id != me.id">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        checked
                        :id="`checkbox-` + item.id"
                        disabled
                      />
                      <label
                        class="form-check-label"
                        :for="`checkbox-` + item.id"
                        :id="`label-` + item.id"
                      >
                        {{ item.name }}
                        <span v-if="item.link || item.purchaser_id"> - </span>
                        <a
                          v-if="item.link"
                          :href="`//` + item.link.replace(/^https?:\/\//, '')"
                          target="_blank"
                          >link</a
                        >
                      </label>
                      <span class="text-danger">
                        purchased by {{ item.purchaser.name }}</span
                      >
                    </div>
                  </div>
                  <div
                    v-else-if="item.purchaser_id && item.purchaser_id === me.id"
                  >
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        checked
                        @click="toggleCheckBox(item)"
                        :id="`checkbox-` + item.id"
                      />
                      <label
                        class="form-check-label"
                        :for="`checkbox-` + item.id"
                        :id="`label-` + item.id"
                      >
                        {{ item.name }}
                        <span v-if="item.link || item.purchaser_id"> - </span>
                        <a
                          v-if="item.link"
                          :href="`//` + item.link.replace(/^https?:\/\//, '')"
                          target="_blank"
                          >link</a
                        >
                      </label>
                      <span class="text-success"> purchased by you!</span>
                    </div>
                  </div>
                  <div v-else>
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        @click="toggleCheckBox(item)"
                        :id="`checkbox-` + item.id"
                      />
                      <label
                        class="form-check-label"
                        :for="`checkbox-` + item.id"
                        :id="`label-` + item.id"
                      >
                        {{ item.name }}
                        <span v-if="item.link || item.purchaser_id"> - </span>
                        <a
                          v-if="item.link"
                          :href="`//` + item.link.replace(/^https?:\/\//, '')"
                          target="_blank"
                          >link</a
                        >
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.splash {
  object-fit: cover;
  object-position: center;
  object-position: 100% 0;
  width: 100%;
  max-height: 18em;
}
.splashTransition-enter-active,
.splashTransition-leave-active {
  transition: all 0.7s ease;
}
.splashTransition-enter-from,
.splashTransition-leave-to {
  transform: none;
  opacity: 0;
}
.row {
  --bs-gutter-x: 0;
}
</style>

<script>
import axios from "axios";
export default {
  data: function () {
    return {
      family: [],
      everyone: [],
      secretSanta: null,
      christmasLists: {},
      contentLoaded: false,
      indexview: false,
      me: null,
      wheelgif: true,
      splashLoaded: false,
      pageLoaded: false,
    };
  },
  created: function () {
    axios
      .get("/users/me")
      .then((response) => {
        this.me = response.data;
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
    toggleCheckBox: function (item) {
      if (item.purchaser_id) {
        item.purchaser_id = null;
        item.purchaser = null;
        axios
          .patch(`/wishedgifts/${item.id}`, { purchaser_id: null })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
          });
      } else {
        item.purchaser_id = this.me.id;
        axios
          .patch(`/wishedgifts/${item.id}`, { purchaser_id: this.me.id })
          .catch((errors) => {
            console.log("errors: ", errors.response.data.errors);
          });
      }
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
        this.wheelgif = false;
        var my_id = this.me.id;
        this.family = response.data.users
          .filter(function (user) {
            return user.id != my_id;
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      });
      this.me.mystery_santa ? this.getSecretSanta() : "";
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
  },
};
</script>
