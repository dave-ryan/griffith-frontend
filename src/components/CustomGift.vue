<template>
  <div class="d-flex align-items-center justify-content-center">
    <Spinner size="small" :visible="deletingCustomGift?.user_id === user.id" />
    <input
      :id="'customGiftCheckbox-' + user.id"
      class="form-check-input me-1 check-box"
      type="checkbox"
      @change="$emit('toggleCustomGiftCheckBox', $event, user)"
      :checked="customGift"
      :disabled="deletingCustomGift?.user_id === user.id"
    />
    <span
      class="text-truncate d-inline-block custom-gift-name"
      ref="customGiftName"
      @click="toggleTruncation()"
      truncated="true"
      :class="deletingCustomGift?.user_id === user.id ? 'fw-light' : ''"
      v-if="customGift?.note"
    >
      {{ customGift.note }}
    </span>
    <span
      v-else
      :class="deletingCustomGift?.user_id === user.id ? 'fw-light' : ''"
    >
      Something
      <strong>not</strong> on {{ user.name }}'s list
    </span>
    <button
      type="button"
      class="btn btn-secondary btn-sm ms-2"
      data-bs-toggle="modal"
      data-bs-target="#customGiftModal"
      @click="$emit('editCustomGift', user)"
      v-if="customGift"
      :disabled="deletingCustomGift?.user_id === user.id"
    >
      <i class="bi bi-tools"></i>
    </button>
  </div>
</template>

<style scoped>
.custom-gift-name {
  max-width: 80%;
}
.check-box {
  margin-top: 0.1rem;
}
</style>

<script>
import Spinner from "./Spinner.vue";
export default {
  components: { Spinner },
  props: ["user", "deletingCustomGift", "customGift"],
  emits: ["toggleCustomGiftCheckBox", "editCustomGift"],
  methods: {
    toggleTruncation() {
      let el = this.$refs.customGiftName;
      if (el.getAttribute("truncated") === "true") {
        el.setAttribute("truncated", "false");
        el.classList.remove("text-truncate", "d-inline-block");
      } else {
        el.setAttribute("truncated", "true");
        el.classList.add("text-truncate", "d-inline-block");
      }
    },
  },
};
</script>
