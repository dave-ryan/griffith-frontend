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

    <!-- View Change Buttons -->
    <transition name="content" mode="out-in">
      <div v-if="splashImgLoaded && pageLoaded" class="row mt-5 mb-5">
        <div class="d-grid gap-2 d-md-block">
          <button
            @click="getBirthdays()"
            class="btn nopulse col-md-2 ms-4 me-4"
            :class="
              currentDisplayMode === displayMode.Birthdays
                ? 'btn-primary disabled btn-lg'
                : 'btn-outline-primary'
            "
          >
            Upcoming Birthdays
          </button>
          <button
            v-if="currentUser.family_id"
            @click="getFamily()"
            class="btn nopulse col-md-2 ms-4 me-4 ms-md-4 me-md-4"
            :class="
              currentDisplayMode === displayMode.Family
                ? 'btn-primary disabled btn-lg'
                : 'btn-outline-primary'
            "
          >
            Your Family
          </button>
          <button
            v-if="currentUser.friends"
            @click="getFriends()"
            class="btn nopulse col-md-2 ms-4 me-4 ms-md-4 me-md-4"
            :class="
              currentDisplayMode === displayMode.Friends
                ? 'btn-primary disabled btn-lg'
                : 'btn-outline-primary'
            "
          >
            Friends
          </button>
          <button
            v-if="currentUser.family_id"
            @click="getEveryone()"
            class="btn nopulse col-md-2 ms-4 me-4"
            :class="
              currentDisplayMode === displayMode.Everyone
                ? 'btn-primary disabled btn-lg'
                : 'btn-outline-primary'
            "
          >
            Everyone
          </button>
        </div>
      </div>
    </transition>

    <transition name="content" mode="out-in">
      <div v-if="splashImgLoaded && contentLoaded" class="ps-2 pe-2 text-break">
        <h2
          v-if="
            users.length === 0 && currentDisplayMode === displayMode.Birthdays
          "
        >
          No Upcoming Birthdays :(
        </h2>
        <!-- If we always show the "Friends" button, uncomment this -->
        <!-- <div
          v-if="
            users.length === 0 && currentDisplayMode === displayMode.Friends
          "
        >
          <h2>No Friends :(</h2>
        </div> -->
        <!-- Lists -->
        <div class="row mb-5 mt-5">
          <div :class="usersOverflow.length > 0 ? 'col-md-6' : 'col'">
            <GiftList
              v-for="user in users"
              :key="user.id"
              :user="user"
              :secretSanta="secretSanta"
              :currentUser="currentUser"
              :deletingCustomGift="deletingCustomGift"
              :customGift="findCustomGift(user)"
              @toggleCheckBox="toggleCheckBox"
              @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
              @editCustomGift="editCustomGift"
            />
          </div>

          <div class="col-md-6" v-if="usersOverflow.length > 0">
            <GiftList
              v-for="user in usersOverflow"
              :key="user.id"
              :user="user"
              :secretSanta="secretSanta"
              :currentUser="currentUser"
              :deletingCustomGift="deletingCustomGift"
              :customGift="findCustomGift(user)"
              @toggleCheckBox="toggleCheckBox"
              @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
              @editCustomGift="editCustomGift"
            />
          </div>
        </div>

        <!-- Secret Santa List -->
        <div
          class="row mt-2"
          v-if="secretSanta && currentDisplayMode === displayMode.Family"
        >
          <div class="d-flex justify-content-center">
            <hr class="w-50 fw-light" />
          </div>
          <div class="row">
            <div class="col">
              <h2 class="mb-3">Your Secret Santa</h2>
              <GiftList
                :user="secretSanta"
                :secretSanta="secretSanta"
                :currentUser="currentUser"
                :deletingCustomGift="deletingCustomGift"
                :customGift="findCustomGift(secretSanta)"
                @toggleCheckBox="toggleCheckBox"
                @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
                @editCustomGift="editCustomGift"
              />
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
            id="customGiftForm"
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
                <div class="invalid-feedback">What are you getting them?</div>
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
button {
  transition: all 0.25s ease;
}
</style>

<script>
import axios from "axios";
import { Modal } from "bootstrap";
import { nextTick } from "vue";
import christmasTree from "../assets/images/tree-cropped-compressed.jpg";
import birthdayBaloons from "../assets/images/singlebaloon.jpg";
import Splash from "../components/Splash";
import LowPresentWarning from "../components/LowPresentWarning";
import Spinner from "../components/Spinner";
import GiftList from "../components/GiftList";

export default {
  components: {
    Splash,
    LowPresentWarning,
    Spinner,
    GiftList,
  },
  props: ["currentUser", "christmasTime"],
  emits: ["logOut", "onError", "clearError", "onHomePageLoaded", "onUserLoad"],
  data() {
    return {
      users: [],
      usersOverflow: [],
      secretSanta: null,
      displayFriendsButton: false,
      currentDisplayMode: this.displayMode?.Birthdays,
      displayMode: {
        Birthdays: 0,
        Family: 1,
        Everyone: 2,
        Friends: 3,
      },
      lowPresentCount: false,
      deletingCustomGift: null,
      editingCustomGift: {},
      editingCustomGiftUser: {},
      loadingCustomGiftModal: false,
      splashImgLoaded: false,
      splashSrc: this.christmasTime ? christmasTree : birthdayBaloons,
      contentLoaded: false,
      pageLoaded: false,
    };
  },
  created() {
    this.$emit("clearError");
    if (this.currentUser) {
      if (this.christmasTime) {
        this.getFamily();
        this.getSecretSanta();
      } else {
        this.getBirthdays();
      }
    } else {
      this.getMe();
    }
  },
  methods: {
    checkCustomGiftForm() {
      return this.editingCustomGift?.note?.length > 0;
    },
    createOrUpdateCustomGift() {
      document
        .getElementById("customGiftForm")
        ?.classList?.add("was-validated");
      if (this.checkCustomGiftForm()) {
        document
          .getElementById("customGiftForm")
          .classList.remove("was-validated");
        this.editingCustomGift.id
          ? this.updateCustomGift()
          : this.createCustomGift();
      }
    },
    createCustomGift() {
      this.loadingCustomGiftModal = true;
      let params = {
        user_id: this.editingCustomGiftUser.id,
        note: this.editingCustomGift.note,
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
    filterUpcomingBirthdays(users) {
      var today = new Date();
      var future = new Date().setMonth(today.getMonth() + 2);

      return users?.filter((user) => {
        if (user.birthday) {
          var userBirthday = new Date(user.birthday).setFullYear(
            new Date(future).getUTCFullYear()
          );
          user.birthdayString = new Date(userBirthday).toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            }
          );
          return userBirthday >= today && userBirthday <= future;
        }
      });
    },
    getBirthdays() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.currentDisplayMode = this.displayMode.Birthdays;
      this.contentLoaded = false;
      axios
        .get("/users")
        .then((response) => {
          this.contentLoaded = true;
          this.pageLoaded = true;
          this.$emit("onHomePageLoaded");
          this.processUserData(this.filterUpcomingBirthdays(response.data));
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getEveryone";
          this.$emit("onError", error);
        });
    },
    getEveryone() {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.currentDisplayMode = this.displayMode.Everyone;
      this.contentLoaded = false;
      axios
        .get("/users")
        .then((response) => {
          this.contentLoaded = true;
          this.processUserData(response.data);
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
      this.currentDisplayMode = this.displayMode.Family;
      axios
        .get("/families")
        .then((response) => {
          this.$emit("onHomePageLoaded");
          this.pageLoaded = true;
          this.contentLoaded = true;
          if (response.data?.users) {
            this.processUserData(response.data.users);
          } else {
            this.getFriends();
          }
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getFamily";
          this.$emit("onError", error);
        });
    },
    getFriends() {
      this.contentLoaded = false;
      this.currentDisplayMode = this.displayMode.Friends;
      axios
        .get("/friends")
        .then((response) => {
          this.processUserData(response.data);
          this.contentLoaded = true;
        })
        .catch((error) => {
          error.critical = true;
          error.function = "getFamily";
          this.$emit("onError", error);
        });
    },
    getMe() {
      axios
        .get("/current-user")
        .then((response) => {
          this.$emit("onUserLoad", response.data);
          console.log(response.data);

          if (this.christmasTime) {
            this.getFamily();
            this.getSecretSanta();
          } else {
            this.getBirthdays();
          }
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
        .get("/secret-santa")
        .then((response) => {
          if (response.data?.id) {
            this.secretSanta = response.data;
          }
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
    processUserData(users) {
      users = users.filter((user) => {
        return user.id != this.currentUser.id;
      });
      if (users.length > 8) {
        this.users = users.slice(0, users.length / 2);
        this.usersOverflow = users.slice(users.length / 2, users.length);
      } else {
        this.users = users;
        this.usersOverflow = [];
      }
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
      let action = !gift.purchaser_id ? "purchasing" : "unpurchasing";
      axios
        .patch(`/gifts/${gift.id}`, {
          purchaser_id: this.currentUser.id,
          gift_action: action,
        })
        .then((response) => {
          gift.purchaser_id = response.data.purchaser_id;
          gift.purchaser = response.data.purchaser;
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
