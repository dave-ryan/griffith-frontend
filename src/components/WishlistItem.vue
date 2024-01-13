<template>
  <div>
    <Spinner size="small" :visible="item.loading" />
    <div class="form-check form-check-inline me-0">
      <input
        class="form-check-input"
        type="checkbox"
        :value="item.id"
        :id="`checkbox-` + item.id"
        :checked="item.purchaser_id"
        :disabled="
          (item.purchaser_id && item.purchaser_id !== currentUser.id) ||
          item.loading
        "
        @change="$emit('toggleCheckBox')"
      />
      <span
        :class="
          (item.purchaser_id && item.purchaser_id !== currentUser.id) ||
          item.loading
            ? 'fw-light'
            : 'form-check-label'
        "
      >
        {{ item.name }}
        <span v-if="item.link">
          -
          <a
            :href="`//` + item.link.replace(/^https?:\/\//, '')"
            target="_blank"
            >link</a
          ></span
        >
      </span>
      <span
        v-if="item.purchaser && item.purchaser_id"
        :class="
          item.purchaser_id === currentUser.id ? 'text-success' : 'text-danger'
        "
      >
        - Purchased By
        {{ item.purchaser_id === currentUser.id ? "You!" : "Someone Else" }}
        {{ currentUser.is_admin ? " - " + item.purchaser.name : "" }}
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
  props: ["item", "currentUser"],
  emits: ["toggleCheckBox"],
};
</script>
