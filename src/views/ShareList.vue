<template>
  <div class="container-fluid ps-0 pe-0 mb-5 text-center">
    <Splash
      :src="splashSrc"
      :pageLoaded="pageLoaded"
      @splashImgLoaded="splashImgLoaded = true"
    />
    <Spinner
      :visible="pageLoaded && !contentLoaded"
      top="75%"
      position="absolute"
      size="large"
    />
    <transition name="content" mode="out-in">
      <div
        v-if="pageLoaded && splashImgLoaded && !unauthorized && targetUser"
        class="ps-3 pe-3 mt-5"
      >
        <div class="row">
          <div class="col"></div>
          <div class="col-lg-10">
            <div v-if="currentUser?.id !== targetUser.id">
              <h2>{{ targetUser.name }}'s List</h2>
              <GiftList :user="targetUser" />
              <button
                class="btn btn-warning mt-5"
                @click="addFriend"
                :class="alreadyFriends || friendAdded ? 'disabled' : ''"
              >
                <span v-if="!friendAdded && !alreadyFriends">
                  Add {{ targetUser.name }} as a Friend
                </span>
                <span v-if="alreadyFriends"
                  >Already Friends with {{ targetUser.name }} 😊
                </span>
                <span v-if="friendAdded"> Added! </span>
              </button>
              <div>
                When you add them as friends, they will be able to see your
                wishlist, and you will be able to see theirs
              </div>
            </div>
            <div v-if="currentUser?.id === targetUser.id">
              <h2>This is your share page</h2>
              <div>
                Copy this link to share with a friend, and they can see your
                list, and if anyone purchased a gift
              </div>
              <transition name="fade">
                <div
                  v-if="copied"
                  class="position-absolute start-50 translate-middle-x"
                >
                  Copied to your clipboard!
                </div>
              </transition>
              <div class="mt-4">
                <code class="fakelink" @click="copyLink()">{{ url }}</code>
              </div>
            </div>
          </div>
          <div class="col"></div>
        </div>
        <div class="mt-5" v-if="!currentUser">
          <router-link class="btn btn-primary" to="/login">Log In</router-link>
        </div>
      </div>
    </transition>
    <transition name="content" mode="out-in">
      <div v-if="unauthorized" class="ps-3 pe-3 mt-5">
        <h2>Sorry, wrong user or share code.</h2>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fakelink {
  cursor: pointer;
}
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import axios from "axios";
import Splash from "../components/Splash";
import Spinner from "../components/Spinner";
import GiftList from "../components/GiftList";
import christmasTree from "../assets/images/tree-cropped-compressed.jpg";

export default {
  emits: ["onError", "logOut"],
  components: { Splash, Spinner, GiftList },
  data() {
    return {
      alreadyFriends: false,
      friendAdded: false,
      targetUser: null,
      pageLoaded: false,
      contentLoaded: false,
      splashSrc: christmasTree,
      unauthorized: false,
      currentUser: null,
      url: "",
      copied: false,
    };
  },
  created() {
    this.url = window.location.href;

    axios
      .get("/current-user")
      .then((response) => {
        this.currentUser = response.data;
        this.getUser();
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          this.currentUser = null;
          this.getUser();
        } else {
          error.critical = true;
          error.function = "getMe";
          this.$emit("onError", error);
        }
      });
  },
  methods: {
    addFriend() {
      axios
        .put(`/users/${this.targetUser.id}/friend`)
        .then(() => {
          this.friendAdded = true;
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            this.$emit("logOut");
          } else {
            error.critical = true;
            error.function = "addFriend";
            this.$emit("onError", error);
          }
        });
    },
    getUser() {
      const urlParams = new URLSearchParams(window.location.search);
      let userId = urlParams.get("userId");
      let params = {
        share_code: urlParams.get("shareCode"),
      };
      axios
        .get(`/users/${userId}`, { params })
        .then((response) => {
          this.targetUser = response.data;
          this.pageLoaded = true;
          this.contentLoaded = true;
          if (this.currentUser?.friends?.length) {
            this.currentUser.friends.forEach((friend) => {
              if (friend.id === this.targetUser.id) {
                this.alreadyFriends = true;
              }
            });
          }
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            this.unauthorized = true;
            this.pageLoaded = true;
            this.contentLoaded = true;
          } else {
            error.critical = true;
            error.function = "shareMe";
            this.$emit("onError", error);
          }
        });
    },
    copyLink() {
      navigator.clipboard.writeText(this.url);
      this.copied = true;
      setTimeout(() => {
        this.copied = false; //fade out
      }, 200);
    },
  },
};
</script>
