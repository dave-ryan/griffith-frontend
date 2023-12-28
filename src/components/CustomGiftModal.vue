<template>
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
          :disabled="loading"
        >
          <div class="modal-header">
            <h5 class="modal-title">
              Something <strong>not</strong> on {{ user?.name }}'s list
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              :disabled="loading"
            ></button>
          </div>

          <div class="modal-body">
            <transition mode="out-in">
              <Spinner v-if="loading" top="50%" position="fixed" />
            </transition>

            <div class="form-floating" :disabled="loading">
              <input
                type="text"
                v-model="customGiftLocal.note"
                class="form-control"
                required
                id="customGiftInput"
                :disabled="loading"
                placeholder="books"
              />
              <label class="pt-2" for="customGiftInput"
                >What are you geting {{ user?.name }}?</label
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
              data-bs-dismiss="modal"
              :disabled="loading"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script>
import Spinner from "../components/Spinner.vue";
import axios from "axios";
import { Modal } from "bootstrap";

export default {
  components: { Spinner },
  props: ["loading", "user", "gift", "me"],
  emits: ["onCustomGiftChange"],
  computed: {
    customGiftLocal: {
      get: function () {
        return this.gift;
      },
      set: function (gift) {
        this.$emit("onCustomGiftChange", gift);
      },
    },
  },
  methods: {
    createOrUpdateCustomGift() {
      this.gift.id ? this.updateCustomGift() : this.createCustomGift();
    },
    createCustomGift() {
      console.log(this.gift);
      let params = {
        user_id: this.user.id,
        customgift_purchaser_id: this.me.id,
        note: this.gift.note || "",
      };
      axios
        .post("/customgifts", params)
        .then((response) => {
          this.loadingCustomGiftModal = false;
          this.customGiftLocal = response.data;
        })
        .catch((error) => {
          error.function = "toggleCustomGiftCheckBox, post /customgifts";
          this.$emit("onError", error);
          let modal = new Modal(document.getElementById("customGiftModal"), {});
          modal.hide();
        });
    },
    updateCustomGift() {
      axios
        .patch(`/customgifts/${this.gift.id}`, this.gift)
        .then(() => {})
        .catch((error) => {
          error.function = "updateCustomGift";
          this.$emit("onError", error);
        });
    },
  },
};
</script>
