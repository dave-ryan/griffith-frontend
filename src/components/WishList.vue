<template>
  <div>
    <transition mode="out-in">
      <span class="spinner-container" v-if="item.loading">
        <span
          class="spinner-border spinner-border-sm me-2"
          role="status"
        ></span>
      </span>
    </transition>
    <div class="form-check form-check-inline me-0">
      <input
        class="form-check-input"
        type="checkbox"
        :value="item.id"
        :id="`checkbox-` + item.id"
        :checked="item.purchaser_id"
        :disabled="
          (item.purchaser_id && item.purchaser_id !== me.id) || item.loading
        "
        @change="$emit('toggleCheckBox')"
      />
      <span
        :class="
          (item.purchaser_id && item.purchaser_id !== me.id) || item.loading
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
        :class="item.purchaser_id === me.id ? 'text-success' : 'text-danger'"
      >
        - Purchased By
        {{ item.purchaser_id === me.id ? "You!" : "Someone Else" }}
        {{ me.is_admin ? " - " + item.purchaser.name : "" }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.spinner-container {
  position: absolute;
  transform: translate(-100%);
}
</style>

<script>
export default {
  props: ["item", "me"],
  emits: ["toggleCheckBox"],
};
</script>
