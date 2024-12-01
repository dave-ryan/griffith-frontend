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
          !currentUser ||
          (gift.purchaser_id && gift.purchaser_id !== currentUser?.id) ||
          gift.loading
        "
        @change="$emit('toggleCheckBox')"
      />
      <span
        :class="
          (gift.purchaser_id && gift.purchaser_id !== currentUser?.id) ||
          gift.loading
            ? 'fw-light'
            : 'form-check-label' && currentUser
            ? ''
            : 'sharing'
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
      <span v-if="gift.purchaser">
        <span v-if="gift.purchaser.id === currentUser?.id" class="text-success"
          >- Purchased By You!</span
        >
        <span v-if="gift.purchaser.id !== currentUser?.id" class="text-danger"
          >- Purchased By
          <span
            ref="tooltip"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="gift.purchaser.name"
            >Someone Else</span
          >
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
.sharing {
  opacity: 1 !important;
}
</style>

<script>
import Spinner from "../components/Spinner";
import { Tooltip } from "bootstrap";
export default {
  components: { Spinner },
  props: ["gift", "currentUser"],
  emits: ["toggleCheckBox"],
  mounted() {
    this.$nextTick(() => {
      if (this.gift.purchaser && this.$refs.tooltip) {
        new Tooltip(this.$refs.tooltip);
      }
    });
  },
};
</script>
