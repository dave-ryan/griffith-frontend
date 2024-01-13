<template>
  <div>
    <Spinner size="small" :visible="deletingCustomGift?.user_id === user.id" />
    <div class="form-check form-check-inline me-0">
      <input
        :id="'customGiftCheckbox-' + user.id"
        class="form-check-input"
        type="checkbox"
        @change="$emit('toggleCustomGiftCheckBox', $event, user)"
        :checked="associatedCustomGift"
        :disabled="deletingCustomGift?.user_id === user.id"
      />
      <span
        class="text-truncate truncated align-middle"
        :class="deletingCustomGift?.user_id === user.id ? 'fw-light' : ''"
        v-if="associatedCustomGift?.note"
      >
        {{ associatedCustomGift.note }}
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
        v-if="associatedCustomGift"
        :disabled="deletingCustomGift?.user_id === user.id"
      >
        <i class="bi bi-tools"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.truncated {
  max-width: 200px;
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
  props: ["user", "deletingCustomGift", "associatedCustomGift"],
  emits: ["toggleCustomGiftCheckBox", "editCustomGift"],
};
</script>
