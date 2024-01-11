<template>
  <div class="container-fluid mb-5 ps-0 pe-0 text-center">
    <Splash
      :src="splashSrc"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />

    <transition mode="out-in">
      <LowPresentWarning
        v-if="lowPresentCount && splashImgLoaded && contentLoaded"
      />
    </transition>

    <Spinner
      :visible="pageLoaded && !contentLoaded"
      top="75%"
      position="absolute"
      size="large"
    />

    <transition name="content" mode="out-in">
      <div
        v-if="currentUser && splashImgLoaded && contentLoaded"
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
                              (item) => item.purchaser_id === currentUser.id
                            ) || findCustomGift(user)
                          "
                        ></i>
                      </button>
                      <div
                        class="collapse list-collapse"
                        aria-expanded="false"
                        :id="`christmas-list-${user.id}`"
                      >
                        <span v-if="user.wishedgifts?.length < 1"
                          >{{ user.name }} hasn't made a christmas list yet!
                          Remind them! &#128578;</span
                        >
                        <WishlistItem
                          v-for="item in user.wishedgifts"
                          :key="item.id"
                          :item="item"
                          :currentUser="currentUser"
                          @toggleCheckBox="toggleCheckBox(item)"
                        />
                        <div class="row">
                          <div class="col-5"></div>
                          <div class="col-2">
                            <hr class="fw-light" />
                          </div>
                          <div class="col-5"></div>
                        </div>

                        <Spinner
                          size="small"
                          :visible="deletingCustomGift?.user_id === user.id"
                        />

                        <div class="form-check form-check-inline me-0">
                          <input
                            :id="'customGiftCheckbox-' + user.id"
                            class="form-check-input"
                            type="checkbox"
                            @change="toggleCustomGiftCheckBox($event, user)"
                            :checked="findCustomGift(user)"
                            :disabled="deletingCustomGift?.user_id === user.id"
                          />
                          <span
                            class="text-truncate truncated align-middle"
                            :class="
                              deletingCustomGift?.user_id === user.id
                                ? 'fw-light'
                                : ''
                            "
                            v-if="findCustomGift(user)?.note"
                          >
                            {{ findCustomGift(user).note }}
                          </span>
                          <span
                            v-else
                            class="align-middle"
                            :class="
                              deletingCustomGift?.user_id === user.id
                                ? 'fw-light'
                                : ''
                            "
                          >
                            Something
                            <strong>not</strong> on {{ user.name }}'s list
                          </span>
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#customGiftModal"
                            @click="editCustomGift(user)"
                            v-if="findCustomGift(user)"
                            :disabled="deletingCustomGift?.user_id === user.id"
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
                        (item) => item.purchaser_id === currentUser.id
                      )
                    "
                  ></i>
                </button>
                <div
                  class="collapse list-collapse"
                  aria-expanded="false"
                  id="christmas-list-ss"
                >
                  <span v-if="secretSanta?.wishedgifts?.length === 0"
                    >{{ secretSanta.name }} hasn't made their christmas list
                    yet! Remind them! &#128578;</span
                  >
                  <WishlistItem
                    v-for="item in secretSanta.wishedgifts"
                    :key="item.id"
                    :item="item"
                    :currentUser="currentUser"
                    @toggleCheckBox="toggleCheckBox(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Custom Gift Modal -->
    <div
      class="modal fade"
      id="customGiftModal"
      tabindex="-1"
      data-bs-backdrop="static"
    >
      <div class="modal-dialog modal-dialog-centered" key="loaded">
        <div class="modal-content">
          <form
            @submit.prevent="createOrUpdateCustomGift()"
            id="editingItemForm"
            novalidate
          >
            <div class="modal-header">
              <h5 class="modal-title">
                Something <strong>not</strong> on
                {{ editingCustomGiftUser?.name }}'s list
              </h5>
              <button
                ref="Close"
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                :disabled="loadingCustomGiftModal"
              ></button>
            </div>

            <div class="modal-body">
              <Spinner
                :visible="loadingCustomGiftModal"
                top="50%"
                position="fixed"
              />

              <div class="form-floating" :disabled="loadingCustomGiftModal">
                <input
                  type="text"
                  v-model="editingCustomGift.note"
                  class="form-control"
                  required
                  id="customGiftInput"
                  :disabled="loadingCustomGiftModal"
                  placeholder="books"
                />
                <label class="pt-2" for="customGiftInput"
                  >What are you geting {{ editingCustomGiftUser?.name }}?</label
                >
                <div class="invalid-feedback">
                  A note of what you are getting them might be helpful!
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="submit"
                class="btn btn-success"
                :disabled="loadingCustomGiftModal"
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

<style scoped>
.truncated {
  max-width: 200px;
  display: inline-block;
  vertical-align: top;
}
.form-check-input {
  margin-top: 8px;
}
</style>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import { nextTick } from "vue";
import splashImage from "../assets/images/tree-cropped-compressed.jpg";
import WishlistItem from "../components/WishlistItem.vue";
import Splash from "../components/Splash.vue";
import LowPresentWarning from "../components/LowPresentWarning.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: { WishlistItem, Splash, LowPresentWarning, Spinner },
  props: ["currentUser"],
  emits: ["logOut", "onError", "clearError", "onHomePageLoaded"],
  data() {
    return {
      family: [],
      everyone: [],
      secretSanta: null,
      indexview: false,
      lowPresentCount: false,
      deletingCustomGift: null,
      editingCustomGift: {},
      editingCustomGiftUser: {},
      loadingCustomGiftModal: false,
      splashImgLoaded: false,
      splashSrc: splashImage,
      contentLoaded: false,
      pageLoaded: false,
    };
  },
  created() {
    this.$emit("clearError");
    this.getFamily();
    this.getSecretSanta();
  },
  methods: {
    createOrUpdateCustomGift() {
      this.editingCustomGift.id
        ? this.updateCustomGift()
        : this.createCustomGift();
    },
    createCustomGift() {
      this.loadingCustomGiftModal = true;
      let params = {
        user_id: this.editingCustomGiftUser.id,
        customgift_purchaser_id: this.currentUser.id,
        note: this.editingCustomGift.note || "",
      };
      axios
        .post("/customgifts", params)
        .then((response) => {
          this.editingCustomGiftUser.customgifts.push(response.data);
          this.hideCustomGiftModal();
        })
        .catch((error) => {
          this.loadingCustomGiftModal = false;
          error.function = "toggleCustomGiftCheckBox, post /customgifts";
          this.$emit("onError", error);
        });
    },
    deleteCustomGift(user) {
      this.deletingCustomGift = this.findCustomGift(user);
      axios
        .delete(`/customgifts/${this.deletingCustomGift.id}`)
        .then(() => {
          for (var key in this.deletingCustomGift) {
            delete this.deletingCustomGift[key];
          }
          this.deletingCustomGift = null;
        })
        .catch((error) => {
          this.deletingCustomGift = null;
          document.getElementById(
            `customGiftCheckbox-${user.id}`
          ).checked = true;
          error.function = "toggleCustomGiftCheckBox";
          this.$emit("onError", error);
        });
    },
    editCustomGift(user) {
      this.editingCustomGiftUser = user;
      this.editingCustomGift = this.findCustomGift(user);
      document.getElementById("customGiftInput").focus();
    },
    findCustomGift(user) {
      return user?.customgifts?.find(
        (item) => item.customgift_purchaser_id === this.currentUser.id
      );
    },
    getEveryone() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.indexview = true;
      this.contentLoaded = false;
      axios
        .get("/users")
        .then((response) => {
          this.contentLoaded = true;
          let currentUser = this.currentUser;
          this.everyone = response.data.filter(function (user) {
            return user.id != currentUser.id;
          });
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getEveryone";
          this.$emit("onError", error);
        });
    },
    getFamily() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.contentLoaded = false;
      this.indexview = false;
      axios
        .get("/families")
        .then((response) => {
          this.$emit("onHomePageLoaded");
          this.pageLoaded = true;
          this.contentLoaded = true;
          let currentUser = this.currentUser;
          this.family = response.data.users
            .filter(function (user) {
              return user.id != currentUser.id;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getFamily";
          this.$emit("onError", error);
        });
    },
    getSecretSanta() {
      axios
        .get("/mystery_santa")
        .then((response) => {
          this.secretSanta = response.data;
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getSecretSanta";
          this.$emit("onError", error);
        });
    },
    async hideCustomGiftModal() {
      this.loadingCustomGiftModal = false;
      this.editingCustomGift = {};
      this.editingCustomGiftUser = {};
      await nextTick();
      this.$refs.Close.click();
    },
    toggleCustomGiftCheckBox(event, user) {
      if (event?.target?.checked) {
        this.editingCustomGiftUser = user;
        new Modal(document.getElementById("customGiftModal"), {}).show();
      } else {
        this.deleteCustomGift(user);
      }
    },
    toggleCheckBox(item) {
      var el = document.getElementById(`checkbox-${item.id}`);
      setTimeout(() => {
        el.checked = !el.checked;
      }, 10);
      item.loading = true;
      let purchasing = !item.purchaser_id ? true : false;
      axios
        .patch(`/wishedgifts/${item.id}`, {
          purchaser_id: this.currentUser.id,
          purchasing: purchasing,
        })
        .then((response) => {
          item.purchaser_id = response.data.purchaser_id;
          item.purchaser = response.data.purchaser;
          item.loading = false;
          el.checked = !el.checked;
        })
        .catch((error) => {
          item.loading = false;
          let errorData = error.response?.data;
          if (errorData?.purchaser) {
            this.$emit("launchErrorToast", "Someone Else Purchased This!");
            item.purchaser = errorData.purchaser;
            item.purchaser_id = errorData.purchaser_id;
          } else {
            error.function = "toggleCheckBox";
            this.$emit("onError", error);
          }
        });
    },
    updateCustomGift() {
      this.loadingCustomGiftModal = true;
      let gift = this.editingCustomGift;
      axios
        .patch(`/customgifts/${gift.id}`, gift)
        .then(() => {
          this.hideCustomGiftModal();
        })
        .catch((error) => {
          this.loadingCustomGiftModal = false;
          error.function = "updateCustomGift";
          this.$emit("onError", error);
        });
    },
  },
};
</script>
