<template>
  <Spinner size="small" :visible="deletingCustomGift?.user_id === user.id" />
  <div
    class="form-check form-check-inline me-0 d-flex flex-wrap justify-content-center align-content-center"
  >
    <input
      :id="'customGiftCheckbox-' + user.id"
      class="form-check-input me-2"
      type="checkbox"
      @change="$emit('toggleCustomGiftCheckBox', $event, user)"
      :checked="customGift"
      :disabled="deletingCustomGift?.user_id === user.id"
    />
    <span
      class="text-truncate align-middle"
      :class="deletingCustomGift?.user_id === user.id ? 'fw-light' : ''"
      v-if="customGift?.note"
    >
      {{ customGift.note }}
    </span>
    <span
      v-else
      class="align-middle"
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
.text-truncate {
  max-width: 70%;
  display: inline-block;
}
.form-check .form-check-input {
  margin-top: 7px;
}
</style>

<script>
import Spinner from "./Spinner.vue";
export default {
  components: { Spinner },
  props: ["user", "deletingCustomGift", "customGift"],
  emits: ["toggleCustomGiftCheckBox", "editCustomGift"],
};
</script>
