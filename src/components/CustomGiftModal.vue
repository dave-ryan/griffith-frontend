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
          @submit.prevent="emitUpdate"
          id="editingItemForm"
          novalidate
          :disabled="loading"
        >
          <div class="modal-header">
            <h5 class="modal-title">
              Something <strong>not</strong> on {{ userName }}'s list
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
                >What are you geting {{ userName }}?</label
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
export default {
  components: { Spinner },
  props: ["loading", "userName", "editingCustomGift"],
  emits: ["submit"],
  computed: {
    customGiftLocal: {
      get: function () {
        return this.editingCustomGift;
      },
      set: function (value) {
        this.$emit("editingCustomGiftChange", value);
      },
    },
  },
  methods: {
    emitUpdate() {
      this.$emit("submit", this.customGiftLocal);
    },
  },
};
</script>
