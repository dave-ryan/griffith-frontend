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
        v-if="currentUser && secretSanta && splashImgLoaded && contentLoaded"
        class="row ps-2 pe-2 text-break"
      >
        <div class="col">
          <div class="row mb-5 mt-5">
            <div class="col">
              <h2>
                {{ indexview ? "Everyone" : "Your Family" }}
              </h2>
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
                    <transition mode="out-in">
                      <i
                        class="position-absolute top-0 start-100 translate-middle bi bi-check-lg text-success ps-1 pe-1 rounded-circle bg-white border border-success"
                        v-if="
                          user.gifts?.some(
                            (gift) => gift.purchaser_id === currentUser.id
                          ) || findCustomGift(user)
                        "
                      ></i>
                    </transition>
                  </button>
                  <div
                    class="collapse list-collapse"
                    aria-expanded="false"
                    :id="`christmas-list-${user.id}`"
                  >
                    <span v-if="user.gifts?.length < 1"
                      >{{ user.name }} hasn't made a christmas list yet! Remind
                      them! &#128578;</span
                    >

                    <Gift
                      v-for="gift in user.gifts"
                      :key="gift.id"
                      :gift="gift"
                      :currentUser="currentUser"
                      @toggleCheckBox="toggleCheckBox(gift)"
                    />
                    <div class="d-flex justify-content-center">
                      <hr class="w-25 fw-light" />
                    </div>

                    <CustomGift
                      :user="user"
                      :deletingCustomGift="deletingCustomGift"
                      :associatedCustomGift="findCustomGift(user)"
                      @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
                      @editCustomGift="editCustomGift"
                    />
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
                  <transition mode="out-in">
                    <i
                      class="position-absolute top-0 start-100 translate-middle bi bi-check-lg text-success ps-1 pe-1 rounded-circle bg-white border border-success"
                      v-if="
                        secretSanta.gifts &&
                        secretSanta.gifts.some(
                          (gift) => gift.purchaser_id === currentUser.id
                        )
                      "
                    ></i>
                  </transition>
                </button>
                <div
                  class="collapse list-collapse"
                  aria-expanded="false"
                  id="christmas-list-ss"
                >
                  <span v-if="secretSanta?.gifts?.length === 0"
                    >{{ secretSanta.name }} hasn't made their christmas list
                    yet! Remind them! &#128578;</span
                  >
                  <Gift
                    v-for="gift in secretSanta.gifts"
                    :key="gift.id"
                    :gift="gift"
                    :currentUser="currentUser"
                    @toggleCheckBox="toggleCheckBox(gift)"
                  />

                  <div class="d-flex justify-content-center">
                    <hr class="w-25 fw-light" />
                  </div>

                  <CustomGift
                    :user="secretSanta"
                    :deletingCustomGift="deletingCustomGift"
                    :associatedCustomGift="findCustomGift(secretSanta)"
                    @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
                    @editCustomGift="editCustomGift"
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
            id="editinggiftForm"
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

<style scoped></style>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import { nextTick } from "vue";
import splashImage from "../assets/images/tree-cropped-compressed.jpg";
import Gift from "../components/Gift";
import Splash from "../components/Splash";
import LowPresentWarning from "../components/LowPresentWarning";
import Spinner from "../components/Spinner";
import CustomGift from "../components/CustomGift";

export default {
  components: { Gift, Splash, LowPresentWarning, Spinner, CustomGift },
  props: ["currentUser"],
  emits: ["logOut", "onError", "clearError", "onHomePageLoaded", "onUserLoad"],
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
    if (this.currentUser) {
      this.getFamily();
      this.getSecretSanta();
    } else {
      this.getMe();
    }
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
          error.function = "createCustomGiftCheckBox";
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
          error.function = "deleteCustomGiftCheckBox";
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
        (gift) => gift.customgift_purchaser_id === this.currentUser.id
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
          this.everyone = response.data.filter((user) => {
            return user.id != this.currentUser.id;
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
          this.family = response.data.users.filter((user) => {
            return user.id != this.currentUser.id;
          });
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getFamily";
          this.$emit("onError", error);
        });
    },
    getMe() {
      axios
        .get("/me")
        .then((response) => {
          this.$emit("onUserLoad", response.data);
          this.currentUserId = response.data.id;
          this.getFamily();
          this.getSecretSanta();
        })
        .catch((error) => {
          if (error.response.status === 401) {
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
        .get("/secret-santa")
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
      if (event.target?.checked) {
        this.editingCustomGiftUser = user;
        setTimeout(() => {
          document.getElementById(
            `customGiftCheckbox-${this.editingCustomGiftUser.id}`
          ).checked = false;
        }, 0);
        new Modal(document.getElementById("customGiftModal"), {}).show();
      } else {
        this.deleteCustomGift(user);
      }
    },
    toggleCheckBox(gift) {
      var el = document.getElementById(`checkbox-${gift.id}`);
      setTimeout(() => {
        el.checked = !el.checked;
      }, 0);
      gift.loading = true;
      let purchasing = !gift.purchaser_id ? "purchasing" : "unpurchasing";
      axios
        .patch(`/gifts/${gift.id}`, {
          purchaser_id: this.currentUser.id,
          purchasing: purchasing,
        })
        .then((response) => {
          gift.purchaser_id = response.data.purchaser_id;
          gift.loading = false;
          el.checked = !el.checked;
        })
        .catch((error) => {
          gift.loading = false;
          let errorData = error.response?.data;
          if (errorData?.purchaser) {
            this.$emit("launchErrorToast", "Someone Else Purchased This!");
            gift.purchaser = errorData.purchaser;
            gift.purchaser_id = errorData.purchaser_id;
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
