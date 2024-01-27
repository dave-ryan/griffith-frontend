<template>
  <div class="row mt-3">
    <div class="col">
      <button
        class="btn mb-1"
        :class="
          user.id === secretSanta?.id
            ? 'btn-outline-danger'
            : 'btn-outline-success'
        "
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
          >{{ user.name }} hasn't made a christmas list yet! Remind them!
          &#128578;</span
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
          :customGift="customGift"
          @toggleCustomGiftCheckBox="toggleCustomGiftCheckBox"
          @editCustomGift="editCustomGift"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script>
import Gift from "./Gift";
import CustomGift from "./CustomGift";

export default {
  components: { Gift, CustomGift },
  props: [
    "user",
    "currentUser",
    "secretSanta",
    "deletingCustomGift",
    "customGift",
  ],
  emits: ["toggleCheckBox", "toggleCustomGiftCheckBox", "editCustomGift"],
  methods: {
    findCustomGift(user) {
      return user?.customgifts?.find(
        (gift) => gift.customgift_purchaser_id === this.currentUser.id
      );
    },
    toggleCheckBox(gift) {
      this.$emit("toggleCheckBox", gift);
    },
    toggleCustomGiftCheckBox(event, user) {
      this.$emit("toggleCustomGiftCheckBox", event, user);
    },
    editCustomGift(user) {
      this.$emit("editCustomGift", user);
    },
  },
};
</script>
