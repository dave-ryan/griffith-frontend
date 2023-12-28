<template>
  <div class="container-fluid mb-5 ps-0 pe-0 text-center">
    <Splash
      :src="splashSrc"
      :contentLoaded="contentLoaded"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />

    <transition mode="out-in">
      <LowPresentWarning
        v-if="lowPresentCount && splashImgLoaded && contentLoaded"
      />
    </transition>

    <transition mode="out-in">
      <Spinner
        v-if="pageLoaded && !contentLoaded"
        top="75%"
        position="absolute"
      />
    </transition>

    <transition name="content" mode="out-in">
      <div
        v-if="splashImgLoaded && contentLoaded"
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
                        <WishlistItem
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
                            @click="setCustomGift(user)"
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
                  <WishlistItem
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

    <CustomGiftModal
      :loading="loadingCustomGiftModal"
      :user="editingCustomGiftUser"
      :gift="editingCustomGift"
      :me="me"
      @onCustomGiftChange="onCustomGiftChange"
    />
  </div>
</template>

<style scoped>
.truncated {
  max-width: 200px;
  display: inline-block;
  vertical-align: top;
}
</style>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import splashImage from "../assets/images/tree-cropped-compressed.jpg";
import WishlistItem from "../components/WishlistItem.vue";
import CustomGiftModal from "../components/CustomGiftModal.vue";
import Splash from "../components/Splash.vue";
import LowPresentWarning from "../components/LowPresentWarning.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: {
    WishlistItem,
    Splash,
    LowPresentWarning,
    Spinner,
    CustomGiftModal,
  },
  emits: ["logOut", "onError", "clearError", "onHomePageLoaded"],
  data() {
    return {
      family: [],
      everyone: [],
      secretSanta: null,
      christmasLists: {},
      contentLoaded: false,
      indexview: false,
      loadingCustomGiftModal: false,
      me: null,
      splashImgLoaded: false,
      pageLoaded: false,
      lowPresentCount: false,
      editingCustomGift: {},
      editingCustomGiftUser: {},
      editingGift: "",
      defaultErrorMessage:
        "Oops! Something went wrong. Try refreshing the page",
      splashSrc: splashImage,
    };
  },
  created() {
    this.$emit("clearError");
    this.getMe();
  },
  methods: {
    findCustomGift(user) {
      return user?.customgifts?.find(
        (item) => item.customgift_purchaser_id === this.me.id
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
          var my_id = this.me.id;
          this.everyone = response.data.filter(function (user) {
            return user.id != my_id;
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
        .get(`/families/${this.me.family.id}`)
        .then((response) => {
          this.$emit("onHomePageLoaded");
          this.pageLoaded = true;
          this.contentLoaded = true;
          var my_id = this.me.id;
          this.family = response.data.users
            .filter(function (user) {
              return user.id != my_id;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getFamily";
          this.$emit("onError", error);
        });
      this.me.mystery_santa ? this.getSecretSanta() : "";
    },
    getMe() {
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
        .catch((error) => {
          if (error.response?.status === 401) {
            this.$emit("logOut");
          } else {
            error.critical = true;
            error.function = "getMe";
            this.$emit("onError", error);
          }
        });
    },
    getSecretSanta() {
      axios
        .get(`/users/${this.me.mystery_santa.id}`)
        .then((response) => {
          this.secretSanta = response.data;
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getSecretSanta";
          this.$emit("onError", error);
        });
    },
    setCustomGift(user) {
      this.editingCustomGiftUser = user;
      this.editingCustomGift = this.findCustomGift(user);
      this.focusInput();
    },
    focusInput() {
      document.getElementById("customGiftInput").focus();
    },
    onCustomGiftChange(gift) {
      this.editingCustomGiftUser.customgifts.push(gift);
    },
    toggleCustomGiftCheckBox(event, user) {
      this.editingCustomGift = this.findCustomGift(user) || {};
      this.editingCustomGiftUser = user;
      if (event?.target?.checked) {
        let modal = new Modal(document.getElementById("customGiftModal"), {});
        modal.show();
      } else {
        axios
          .delete(`/customgifts/${this.editingCustomGift.id}`)
          .then(() => {
            this.editingCustomGift.customgift_purchaser_id = null;
          })
          .catch((error) => {
            error.function = "toggleCustomGiftCheckBox";
            this.$emit("onError", error);
          });
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
          purchaser_id: this.me.id,
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
  },
};
</script>
