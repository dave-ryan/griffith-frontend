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
      <div v-if="contentLoaded" class="row">
        <div class="col">
          <div class="row mb-5 mt-5">
            <div class="col">
              <h2 v-if="indexview">Everyone</h2>
              <h2 v-if="!indexview">Your Family</h2>

              <!-- Family View -->
              <div v-if="!indexview" class="row">
                <div class="col">
                  <div class="row mt-3" v-for="user in family" :key="user.id">
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
                                <span v-if="item.link"> - </span>
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
                                - Purchased By
                                <span v-if="me.is_admin !== true"
                                  >Someone Else</span
                                >
                                <span v-if="me.is_admin === true">
                                  {{ item.purchaser.name }}</span
                                >
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
                                <span v-if="item.link"> - </span>
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
                                - Purchased By You!</span
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
                                <span v-if="item.link"> - </span>
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

              <!-- Index View -->
              <div v-if="indexview" class="row">
                <div class="col">
                  <div
                    class="row mt-3"
                    v-for="user in everyone"
                    :key="`everyone-` + user.id"
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
                                :id="`christmas-checkbox-` + item.id"
                                disabled
                              />
                              <label
                                class="form-check-label"
                                :for="`christmas-checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link"> - </span>
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
                                - Purchased By
                                <span v-if="me.is_admin !== true"
                                  >Someone Else</span
                                >
                                <span v-if="me.is_admin === true">
                                  {{ item.purchaser.name }}
                                </span>
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
                                :id="`christmas-checkbox-` + item.id"
                              />
                              <label
                                class="form-check-label"
                                :for="`christmas-checkbox-` + item.id"
                                :id="`label-` + item.id"
                              >
                                {{ item.name }}
                                <span v-if="item.link"> - </span>
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
                                - Purchased By You!</span
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
                                <span v-if="item.link"> - </span>
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
                          <span v-if="item.link"> - </span>
                          <a
                            v-if="item.link"
                            :href="`//` + item.link.replace(/^https?:\/\//, '')"
                            target="_blank"
                            >link</a
                          >
                        </label>
                        <span class="text-danger">
                          - Purchased By
                          <span v-if="me.is_admin !== true">Someone Else</span>
                          <span v-if="me.is_admin === true">
                            {{ item.purchaser.name }}</span
                          >
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
                          <span v-if="item.link"> - </span>
                          <a
                            v-if="item.link"
                            :href="`//` + item.link.replace(/^https?:\/\//, '')"
                            target="_blank"
                            >link</a
                          >
                        </label>
                        <span class="text-success">- Purchased By You!</span>
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
                          <span v-if="item.link"> - </span>
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
  max-height: 17em;
  min-height: 10em;
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
      splashLoaded: false,
      pageLoaded: false,
      lowPresentCount: false,
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
