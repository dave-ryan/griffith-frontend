<template>
  <div>
    <div class="form-check form-check-inline me-0">
      <Spinner
        size="small"
        position="absolute"
        top="50%"
        left="-10px"
        :visible="gift.loading"
      />
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
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        :title="gift.purchaser_id === currentUser.id ? '' : gift.purchaser.name"
      >
        - Purchased By
        <span>
          {{ gift.purchaser_id === currentUser.id ? "You!" : "Someone Else" }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.form-check {
  position: relative;
}
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
