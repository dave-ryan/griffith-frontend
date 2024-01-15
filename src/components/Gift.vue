<template>
  <div>
    <Spinner size="small" :visible="gift.loading" />
    <div class="form-check form-check-inline me-0">
      <input
        class="form-check-input"
        type="checkbox"
        :value="gift.id"
        :id="`checkbox-` + gift.id"
        :checked="gift.purchaser_id"
        :disabled="
          (gift.purchaser_id && gift.purchaser_id !== currentUser.id) ||
          gift.loading
        "
        @change="$emit('toggleCheckBox')"
      />
      <span
        :class="
          (gift.purchaser_id && gift.purchaser_id !== currentUser.id) ||
          gift.loading
            ? 'fw-light'
            : 'form-check-label'
        "
      >
        {{ gift.name }}
        <span v-if="gift.link">
          -
          <a
            :href="`//` + gift.link.replace(/^https?:\/\//, '')"
            target="_blank"
            >link</a
          ></span
        >
      </span>
      <span
        v-if="gift.purchaser && gift.purchaser_id"
        :class="
          gift.purchaser_id === currentUser.id ? 'text-success' : 'text-danger'
        "
      >
        - Purchased By
        {{ gift.purchaser_id === currentUser.id ? "You!" : "Someone Else" }}
        {{ currentUser.is_admin ? " - " + gift.purchaser.name : "" }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.form-check .form-check-input {
  margin-top: 5px;
}
</style>

<script>
import Spinner from "../components/Spinner";
export default {
  components: { Spinner },
  props: ["gift", "currentUser"],
  emits: ["toggleCheckBox"],
};
</script>
