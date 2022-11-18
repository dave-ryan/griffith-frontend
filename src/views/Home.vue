<template>
  <div class="container-fluid me-0 pt-5 pb-5 text-center">
    <div v-if="!loaded && wheelgif">
      <img src="../assets/images/loading.gif" alt="" />
    </div>
    <transition mode="out-in">
      <div v-if="loaded" class="row pt-5">
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
            <div class="me-auto">
              <hr />
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
      loaded: false,
      indexview: false,
      me: null,
      wheelgif: true,
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
      this.loaded = false;
      axios
        .get("/users")
        .then((response) => {
          this.loaded = true;
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
      this.loaded = false;
      this.indexview = false;
      axios.get(`/families/${this.me.family.id}`).then((response) => {
        this.loaded = true;
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
